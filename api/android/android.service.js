module.exports = {

  /*
   * @Author: Philippe Goffin
   * @Email: artcomputer123@gmail.com
   * @Date: 2026-04-13
   * @Description: All the functions for Android device
   */

  // -----------------------------------------------------------
  // Click on Android device
  // -----------------------------------------------------------
  clickOn: async (data) => {

    console.log('clickOn data', data)
    const Variables = require('../playwright/library/variable.library')
    let variables = new Variables()

    let device = await variables.getPhoneDevice()
    if (!device) device = await variables.setPhoneDevice()

    if (!device) {
      return {
        success: 0,
        message: 'Phone not connected!'
      }
    }

    try {
      const x = Math.round(data.x)
      const y = Math.round(data.y)

      if (isNaN(x) || isNaN(y)) {
        return {
          success: 0,
          message: 'Invalid coordinates'
        }
      }

      console.log(`👉 Tapping at: ${x}, ${y}`)
      await device.shell(`input tap ${x} ${y}`)

      return {
        success: 1,
        message: 'Click OK'
      }

    } catch (e) {
      return {
        success: 0,
        message: e.message
      }
    }
  },

  // -----------------------------------------------------------
  // Take screenshot + UI tree snapshot
  // -----------------------------------------------------------
  getSnapshot: async () => {

    const Variables = require('../playwright/library/variable.library')
    const xml2js = require('xml2js')

    let variables = new Variables()
    let device = await variables.getPhoneDevice()
    if (!device) device = await variables.setPhoneDevice()

    if (!device) {
      return {
        success: 0,
        message: 'Phone not connected!'
      }
    }

    const parser = new xml2js.Parser()

    // --- helpers (local, service-safe)
    const parseBounds = (boundsStr = '') => {
      const m = boundsStr.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/)
      if (!m) return { x: 0, y: 0, width: 0, height: 0 }

      return {
        x: Number(m[1]),
        y: Number(m[2]),
        width: Number(m[3]) - Number(m[1]),
        height: Number(m[4]) - Number(m[2])
      }
    }

    const simplifyNode = (node) => {
      const attr = node?.$ || {}
      return {
        type: attr.class || 'node',
        res: attr['resource-id'] || '',
        text: attr.text || '',
        bounds: parseBounds(attr.bounds),
        children: node.node ? node.node.map(simplifyNode) : []
      }
    }

    const getScreenSize = async () => {
      try {
        const out = (await device.shell('wm size')).toString()
        const m = out.match(/(\d+)x(\d+)/)
        if (m) {
          return { width: Number(m[1]), height: Number(m[2]) }
        }
      } catch (_) { }
      return { width: 1080, height: 1920 }
    }

    try {
      const screenshot = await device.screenshot()
      const screenSize = await getScreenSize()

      let tree = null
      try {
        await device.shell('uiautomator dump /data/local/tmp/view.xml')
        const xml = (await device.shell(
          'cat /data/local/tmp/view.xml'
        )).toString()

        if (xml.includes('<?xml')) {
          const parsed = await parser.parseStringPromise(xml)
          const root = parsed?.hierarchy?.node?.[0]
          if (root) tree = simplifyNode(root)
        }
      } catch (e) {
        console.warn('⚠ UI dump failed, continuing without tree')
      }

      return {
        success: 1,
        message: 'Snapshot OK',
        data: {
          image: screenshot.toString('base64'),
          tree,
          screenSize
        }
      }

    } catch (e) {
      return {
        success: 0,
        message: e.message
      }
    }
  },

  // -----------------------------------------------------------
  // Android Home key
  // -----------------------------------------------------------
  HomeKey: async () => {

    console.log('Home key')

    const Variables = require('../playwright/library/variable.library')
    let variables = new Variables()

    let device = await variables.getPhoneDevice()
    if (!device) device = await variables.setPhoneDevice()

    if (!device) {
      return {
        success: 0,
        message: 'Phone not connected!'
      }
    }

    try {
      await device.shell('input keyevent 3');
      // Sometimes a second press is needed if an app is in a deep sub-menu
      // or if the software keyboard is open.
      await device.shell('input keyevent 3');

      return {
        success: 1,
        message: 'Home key OK!'
      }

    } catch (e) {
      return {
        success: 0,
        message: e.message
      }
    }
  },


  // -----------------------------------------------------------
  // Android Back key
  // -----------------------------------------------------------
  BackKey: async () => {
    console.log('Back key')
    
    const Variables = require('../playwright/library/variable.library')
    let variables = new Variables()


    let device = await variables.getPhoneDevice()
    if (!device) device = await variables.setPhoneDevice()

    if (!device) {
      return {
        success: 0,
        message: 'Phone not connected!'
      }
    }

    try {
      await device.shell('input keyevent 4');
      return {
        success: 1,
        message: 'Back key OK!'
      }

    } catch (e) {
      return {
        success: 0,
        message: e.message
      }
    }
  }




}