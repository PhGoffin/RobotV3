

/**
* @author 	Philippe Goffin
* @name   	browser utility
* @property	javascript 
*
* @description 
*  Playwright browser functions
*
* @version 
* V1.0 PGO	23/05/2025	Initial version   
*
*/



/**
 * @function
 *   startBrowser: start a browser and return the page
 *
 *  @param {number} data.projectID     ID of the project
 *  @param {number} data.subprojectID  ID of the subproject
 *  @param {number} data.userID        ID of the user* 
 * 
 */
async function startBrowser(data) {
    const { chromium, firefox, webkit, devices } = require('playwright'); // chromium, firefox or webkit
    const { getReferenceByCode } = require("../../reference/reference.service.js");


    let ret = 0
    let headless = 0 // 0 by default (browser is visible)
    let browserName = 'chrome'

    // Get the headless (if any)
    const dataAPI1 = { projectID: data.projectID, userID: data.userID, code: 'Headless' }
    const reference1 = await getReferenceByCode(dataAPI1);
    if (reference1.length) {
        if (reference1[0].label != '<N/A>') {
            headless = reference1[0].label * 1
        }
    }
    if (headless == 1) headless = true
    else headless = false

    console.log('Headless: ' + headless)


    // Get the BrowserName (if any)
    const dataAPI2 = { projectID: data.projectID, userID: data.userID, code: 'Browser' }
    const reference2 = await getReferenceByCode(dataAPI2);
    if (reference2.length) {
        if (reference2[0].label != '<N/A>') {
            browserName = reference2[0].label
            browserName = browserName.toLowerCase()

            if (!"*chrome*firefox*safari*".includes(browserName)) {
                console.log('Invalid browser name, reset to Chrome')
                browserName = 'chrome'
            }

        }
    }
    console.log('Browser: ' + browserName)

    let browser

    switch (browserName) {
        case 'chrome':
            browser = await chromium.launch({ headless: headless });
            break
        case 'firefox':
            browser = await firefox.launch({ headless: headless });
            break
        case 'safari':
            browser = await webkit.launch({ headless: headless });
            break

    }

    // Get the Device (if any) iPhone 6, Pixel 5
    /*
        Mobile Devices:
        ---------------
        Android: Galaxy S7, Galaxy S8, Galaxy S9, Galaxy Note 9, Galaxy Note 20, Pixel 6, Pixel 6 Pro, Pixel 7, Pixel 8, Pixel 8 Pro, OnePlus, Moto G9 Play, Moto G7 Play, Moto G71 5G, Huawei P30 
        iOS: iPhone 7 Plus, iPhone 12 Mini, iPhone 13 Mini, iPhone 11 Pro 
        iPad: iPad Mini, iPad (gen 6), iPad (gen 7), iPad Pro 11, Galaxy Tab S4, Galaxy Tab S5e, Galaxy Tab S6, Galaxy Tab S7, Galaxy Tab S8, Galaxy Tab S9 
        
        Desktop Browsers:
        -----------------
        Chrome: Desktop Chrome, Google Chrome (with various channels like stable, beta, dev, canary)
        Firefox: Desktop Firefox
        Safari: Desktop Safari
        Edge: Microsoft Edge (with channels like stable, beta, dev, canary) 
        
        Other:
        ------
        BlackBerry PlayBook, BlackBerry Z30, Galaxy Note 3, Galaxy Note II, Galaxy S5, Galaxy S8, iPhone 7 Plus, iPhone 12 Mini, iPhone 13 Mini    

    */
    let device = '<N/A>'
    const dataAPI3 = { projectID: data.projectID, userID: data.userID, code: 'Device' }
    const reference3 = await getReferenceByCode(dataAPI3);
    if (reference3.length) {
        if (reference3[0].label != '<N/A>') {
            device = reference3[0].label

        }
    }
    console.log('Device: ' + device)


    let page = await browser.newPage();

    if (device != '<N/A>') {
        const context = await browser.newContext({
            ...devices[device], // Apply the device settings
        });
        page = await context.newPage();
    }



    ret = { success: 1, message: "Browser started!", page: page, browser: browser, headless: headless, browserName: browserName, device: device }

    return (ret)

}





module.exports = {
    startBrowser: startBrowser
};


