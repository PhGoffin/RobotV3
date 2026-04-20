/**
* @author 	Philippe Goffin
* @name   	StateScanner
* @property	Class 
*
* @description 
*  Scanner functionalities in a class
*
* @version 
* V1.00 PGO	20/04/2026	Initial version
*
* Scanner states
* --------------
* IDLE --> CONNECTING --> READY --> SCANNING --> ELEMENT_SELECTED --> CLEANUP --> DONE
*
*/

const { chromium, _android } = require('playwright')
const say = require('say')

class StateScanner {


  /**
   * @function
   *   constructor: create an array to contain the Variables
   *
   * @param {string} data contains the device to scan: 1: Web browser, 2: Phone browser, 3: NATIVE ANDROID
   *
   */
  constructor(data) {

    this.data = {
      ...data,
      myDevice: Number(data.myDevice)
    }

    this.state = 'IDLE'

    this.browser = null
    this.context = null
    this.page = null
    this.device = null

    this.result = null
  }


  /**
   * @function
   *   setState: Store the state of the device
   *
   * @param {string} state state of the device
   *
   */
  setState(state) {
    this.state = state
    console.log(`[STATE] → ${state}`)
  }


  /**
   * @function
   *   waitForAndroidPage: Wait for the Phone web browser page ready
   *
   * @param {string} timeout waiting time
   *
   */
  async waitForAndroidPage(timeout = 30000) {


    if (Number(this.data.myDevice) !== 2) {
      throw new Error('waitForAndroidPage called outside Android browser mode');
    }

    const start = Date.now();

    while (Date.now() - start < timeout) {
      const pages = this.context.pages();

      for (const page of pages) {
        const url = page.url();
        if (url && url !== 'about:blank') {
          return page;
        }
      }

      await new Promise(r => setTimeout(r, 500));
    }

    throw new Error('No navigated Android Chrome page detected');
  }



  /**
   * @function
   *   connect: Connect the device depending on the type of device
   *
   */
  async connect() {
    this.setState('CONNECTING');

    const mode = Number(this.data.myDevice);

    // =========================
    // 1️⃣ NORMAL DESKTOP BROWSER
    // =========================
    if (mode === 1) {
      this.browser = await chromium.launch({ headless: false });
      this.context = await this.browser.newContext({
        ignoreHTTPSErrors: true
      });
      this.page = await this.context.newPage();

      this.setState('READY');
      return;
    }

    // =========================
    // 2️⃣ ANDROID CHROME BROWSER
    // =========================
    if (mode === 2) {
      const [device] = await _android.devices();
      if (!device) throw new Error('No Android device');

      this.device = device;

      console.log('[Android] Launching Chrome...');
      this.context = await device.launchBrowser({
        pkg: 'com.android.chrome',
        timeout: 30000
      });

      console.log('[Android] Opening tab via intent...');
      await device.shell(
        `am start -a android.intent.action.VIEW -d "${this.data.myUrl}"`
      );

      console.log('[Android] Waiting for NAVIGATED page...');
      this.page = await this.waitForAndroidPage();

      await this.page.bringToFront();

      console.log('[Android] Page detected:', this.page.url());

      this.setState('READY');
      return;
    }

    // =========================
    // 3️⃣ NATIVE ANDROID
    // =========================
    if (mode === 0) {
      const [device] = await _android.devices();
      if (!device) throw new Error('No Android device');

      this.device = device;
      this.setState('READY');
      return;
    }

    throw new Error(`Unknown device mode: ${mode}`);
  }


  /**
   * @function
   *   preparePage: Prepare the page to scan
   *
   */
  async preparePage() {
    if (!this.page) {
      throw new Error('preparePage called with null page');
    }

    // ✅ DESKTOP ONLY: navigate here
    if (this.data.myDevice === 1) {
      console.log('[Desktop] Navigating to URL...');
      await this.page.goto(this.data.myUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
    }

    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(this.data.myDelay * 1000);

    console.log('[DEBUG] Page URL =', this.page.url());
    say.speak('Scanning in progress');
  }



  /**
   * @function
   *   injectInspector: detect elements
   *
   * @param {object} resolve 
   *
   */
  async injectInspector(resolve) {
    if (!this.page) {
      throw new Error('injectInspector called with null page');
    }

    this.setState('SCANNING');

    // Expose callback ONCE (shared across all frames)
    await this.page.exposeFunction('onElementClicked', async (attrs) => {
      this.setState('ELEMENT_SELECTED');
      this.result = attrs;
      resolve(await this.finish(true));
    });

    const injectIntoFrame = async (frame) => {
      try {
        await frame.evaluate(() => {

          if (window.__scannerInjected) return;
          window.__scannerInjected = true;

          let lastHighlighted = null;
          let inspecting = false;

          function clearHighlight() {
            if (lastHighlighted) {
              lastHighlighted.style.outline = '';
              lastHighlighted = null;
            }
          }

          function highlight(el, color = 'red') {
            if (lastHighlighted && lastHighlighted !== el) {
              lastHighlighted.style.outline = '';
            }
            el.style.outline = `2px dashed ${color}`;
            el.style.outlineOffset = '-2px';
            lastHighlighted = el;
          }

          function getBestElementFromPoint(x, y) {
            const elements = document.elementsFromPoint(x, y);

            const scored = elements.map(el => {
              const rect = el.getBoundingClientRect();
              if (!rect.width || !rect.height) return null;

              const style = getComputedStyle(el);
              if (style.pointerEvents === 'none' || style.visibility === 'hidden') {
                return null;
              }

              const area = rect.width * rect.height;
              const tag = el.tagName.toLowerCase();

              const isInteractive =
                tag === 'button' ||
                tag === 'a' ||
                tag === 'input' ||
                tag === 'select' ||
                tag === 'textarea' ||
                el.getAttribute('role') === 'button' ||
                el.onclick ||
                el.tabIndex >= 0;

              return { el, area, isInteractive };
            }).filter(Boolean);

            const interactive = scored.filter(e => e.isInteractive);
            if (interactive.length) {
              return interactive.sort((a, b) => a.area - b.area)[0].el;
            }

            return scored.sort((a, b) => a.area - b.area)[0]?.el || null;
          }

          /* =========================
           * TOUCH / POINTER LOGIC
           * ========================= */

          document.addEventListener('pointerdown', e => {
            inspecting = true;
            e.preventDefault();
            e.stopPropagation();

            const el = getBestElementFromPoint(e.clientX, e.clientY);
            if (el) highlight(el, 'blue');
          }, true);

          document.addEventListener('pointermove', e => {
            if (!inspecting) return;
            e.preventDefault();

            const el = getBestElementFromPoint(e.clientX, e.clientY);
            if (el) highlight(el, 'blue');
          }, true);

          document.addEventListener('pointerup', e => {
            if (!inspecting) return;
            inspecting = false;

            e.preventDefault();
            e.stopPropagation();

            const el = getBestElementFromPoint(e.clientX, e.clientY);
            if (!el) return;

            highlight(el, 'red');

            window.onElementClicked({
              tagName: el.tagName.toLowerCase(),
              id: el.id || 'N/A',
              class: el.className || 'N/A',
              name: el.getAttribute('name') || 'N/A',
              type: el.getAttribute('type') || 'N/A',
              role: el.getAttribute('role') || 'N/A',
              innerText: el.innerText?.slice(0, 50) || 'N/A',
              href: el.getAttribute('href') || 'N/A'
            });
          }, true);

        });
      } catch (e) {
        // Some frames are cross-origin or blocked – safely ignore
      }
    };

    // Inject into existing frames
    for (const frame of this.page.frames()) {
      await injectIntoFrame(frame);
    }

    // Inject into future frames (Amazon, SPAs, ads)
    this.page.on('frameattached', async (frame) => {
      await injectIntoFrame(frame);
    });
  }



  /**
   * @function
   *   browserInjector: inspect element
   *
   */
  browserInjector() {
    let last = null;

    const highlight = el => {
      if (last) last.style.outline = '';
      el.style.outline = '2px dashed red';
      el.style.outlineOffset = '-2px';
      last = el;
    };

    document.addEventListener('pointerover', e => {
      highlight(e.target);
    }, true);

    document.addEventListener('pointerdown', e => {
      e.preventDefault();
      e.stopPropagation();

      const el = e.target;

      window.onElementClicked({
        tagName: el.tagName.toLowerCase(),
        id: el.id || 'N/A',
        class: el.className || 'N/A',
        name: el.getAttribute('name') || 'N/A',
        innerText: el.innerText?.slice(0, 50) || 'N/A'
      });
    }, true);
  }


  /**
   * @function
   *   nativeScan: Virtual Android phone scan
   *
   * @param {object} resolve 
   *
   */  
  async nativeScan(resolve) {
    this.setState('SCANNING')

    say.speak('Please tap on the phone screen')

    this.device.on('touchscreen', async e => {
      if (e.action !== 'tap') return

      const xmlPath = '/sdcard/window_dump.xml'
      await this.device.shell(`uiautomator dump ${xmlPath}`)

      const raw = await this.device.shell(`cat ${xmlPath}`)
      const xml = new TextDecoder().decode(await raw.arrayBuffer())

      const parser = new (require('xml2js').Parser)()
      const tree = await parser.parseStringPromise(xml)

      const element = findElementByCoordinates(tree, e.x, e.y)

      this.result = element
      resolve(await this.finish(!!element))
    })
  }

  async finish(success) {
    this.setState('CLEANUP')

    if (this.browser) await this.browser.close()
    else if (this.context) await this.context.close()
    else if (this.device) await this.device.close()

    this.setState('DONE')

    return {
      success: success ? 1 : 0,
      attributes: this.result,
      message: success ? 'Scan OK' : 'Scan KO'
    }
  }


  /**
   * @function
   *   run: start the scan
   *
   */    
  async run() {
    return new Promise(async (resolve) => {
      try {
        await this.connect()

        if (this.data.myDevice === 0) {
          await this.nativeScan(resolve)
          return
        }

        await this.preparePage()
        await this.injectInspector(resolve)

        // ⛔ DO NOT CONTINUE
        // Scanner now waits for user interaction
      } catch (e) {
        console.error(e)
        resolve(await this.finish(false))
      }
    })
  }

}


module.exports = StateScanner