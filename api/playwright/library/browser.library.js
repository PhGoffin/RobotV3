

/**
* @author 	Philippe Goffin
* @name   	browser utility
* @property	class 
*
* @description 
*  Playwright browser functions
*
* @version 
* V1.0 PGO	23/05/2025	Initial version   
*
*/


class BrowserUtility {
    constructor() {
        this.browser = 0
        this.page = 0
        this.headless = 0
        this.browserName = 'chromeXX'
        this.device = ''
        this.context = 0
    }


    /**
     * @function
     *   getBrowser: get the browser instance
     *
     */
    getBrowser() {
        return this.browser
    }



    /**
     * @function
     *   getPage: get the page instance
     *
     */
    getPage() {
        return this.page
    }


    /**
     * @function
     *   getHeadless: get the headless instance
     *
     */
    getHeadless() {
        return this.headless
    }


    /**
     * @function
     *   getBrowserName: get the browserName instance
     *
     */
    getBrowserName() {
        console.log('getBrowserName', this.browserName)
        return this.browserName
    }


    /**
     * @function
     *   getDevice: get the device instance
     *
     */
    getDevice() {
        return this.device
    }


    /**
     * @function
     *   getContext: get the context instance
     *
     */
    getContext() {
        return this.context
    }



    /**
     * @function
     *   startBrowser: start a browser and return the page
     *
     *  @param {number} data.projectID     ID of the project
     *  @param {number} data.subprojectID  ID of the subproject
     *  @param {number} data.userID        ID of the user* 
     * 
     */

    async startBrowser(data) {

        const { chromium, firefox, webkit, devices } = require('playwright'); // chromium, firefox or webkit
        const { getReferenceByCode } = require("../../reference/reference.service.js");
        const { getProjectById } = require("../../project/project.service.js")
        const { fileExist } = require("./file.library")
        const path = require('path')


        let ret = 0
        let headless = 0 // 0 by default (browser is visible)
        let browserName = 'chrome'
        let certificate = '<N/A>'
        let certificateCode = '<N/A>'
        let certificateUrl = '<N/A>'

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

        // Get the certificate (if any)
        const dataAPI4 = { projectID: data.projectID, userID: data.userID, code: 'Certificate' }
        const reference4 = await getReferenceByCode(dataAPI4);
        if (reference4.length) {
            if (reference4[0].label != '<N/A>') {
                certificate = reference4[0].label

                // Get the certificate code (mandatory)
                const dataAPI5 = { projectID: data.projectID, userID: data.userID, code: 'CertificateCode' }
                const reference5 = await getReferenceByCode(dataAPI5);
                if (reference5.length) {
                    if (reference5[0].label != '<N/A>') {
                        certificateCode = reference5[0].label
                    } else {
                        console.log('When a certificate is used, the certificateCode is mandatory!')
                        //await logfile(data.userID, "Error", "When a certificate is used, the certificateCode is mandatory!")
                        ret = { success: 0, message: "Browser with certificate: certificateCode is mandatory!" }
                        return (ret)
                    }
                } else {
                    console.log('When a certificate is used, the certificateCode is mandatory!')
                    //await logfile(data.userID, "Error", "When a certificate is used, the certificateCode is mandatory!")
                    ret = { success: 0, message: "Browser with certificate: certificateCode is mandatory!" }
                    return (ret)
                }

                // Get the certificate url (mandatory)
                const dataAPI6 = { projectID: data.projectID, userID: data.userID, code: 'CertificateUrl' }
                const reference6 = await getReferenceByCode(dataAPI6);
                if (reference6.length) {
                    if (reference6[0].label != '<N/A>') {
                        certificateUrl = reference6[0].label
                    } else {
                        console.log('When a certificate is used, the certificateUrl is mandatory!')
                        //await logfile(data.userID, "Error", "When a certificate is used, the certificateUrl is mandatory!")
                        ret = { success: 0, message: "Browser with certificate: certificateUrl is mandatory!" }
                        return (ret)
                    }
                } else {
                    console.log('When a certificate is used, the certificateUrl is mandatory!')
                    //await logfile(data.userID, "Error", "When a certificate is used, the certificateUrl is mandatory!")
                    ret = { success: 0, message: "Browser with certificate: certificateUrl is mandatory!" }
                    return (ret)
                }


            }
        }
        console.log('Certificate: ' + certificate)
        console.log('CertificateCode: ' + certificateCode)
        console.log('CertificateUrl: ' + certificateUrl)



        /* 
         ============================================================
                            Work with certificate
         ============================================================

        // Give the certificate to use
         const autoSelectCert = JSON.stringify([
             {
                 "pattern": "*", 
                 "filter": {
                     "SUBJECT": { "CN": "Mergo D'Heer Alaune (Authentication))" }
                 }
             }
         ]);
         
 
         // Take the first certificate in the list
         const autoSelectCert = JSON.stringify([
             {
                 "pattern": "*",
                 "filter": {} // Pas de filtre = prend le premier trouvé
             }
         ]);

        //        
        // use a specific exported certificated (file .pfx or .p12 + password)
        // Si tu obtiens un fichier .crt et une clé .key séparés au lieu d'un .pfx, sache que Playwright accepte aussi ce format 
        // (utilise certPath et keyPath au lieu de pfxPath).
            const browser = await chromium.launch({ 
                headless: headless,
                args: ['--start-maximized'] 
            });

            // Configuration du contexte avec le certificat client
            const context = await browser.newContext({
                ignoreHTTPSErrors: true,
                clientCertificates: [{
                    origin: 'https://auth.mondossier.rrn', // L'URL précise du serveur
                    pfxPath: './path/to/certificat.pfx', // Chemin vers ton fichier
                    passphrase: 'ton_mot_de_passe'       // Le mot de passe du PFX
                }]
            });

            const page = await context.newPage();
            return { browser, context, page };


        */

        let browser

        switch (browserName) {
            case 'chrome':
                //browser = await chromium.launch({ headless: headless, args: ['--start-maximized', `--auto-select-certificate-for-urls=${autoSelectCert}`, '--ignore-certificate-errors'] });
                browser = await chromium.launch({ headless: headless, args: ['--start-maximized'] });
                break
            case 'firefox':
                browser = await firefox.launch({ headless: headless, args: ['--start-maximized'] });
                break
            case 'safari':
                browser = await webkit.launch({ headless: headless, args: ['--start-maximized'] });
                break
        }


        let context
        let page
        let device = '<N/A>'

        if (certificate == '<N/A>') {

            // ============================================
            // ======        No Certificate         ======
            // ============================================

            console.log('No certificate used!')

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

            const dataAPI3 = { projectID: data.projectID, userID: data.userID, code: 'Device' }
            const reference3 = await getReferenceByCode(dataAPI3);
            if (reference3.length) {
                if (reference3[0].label != '<N/A>') {
                    device = reference3[0].label

                }
            }
            console.log('Device: ' + device)


            context = await browser.newContext();
            page = await context.newPage();

            /*
                context = await browser.newContext({
                viewport: null, // Utile avec --start-maximized
                ignoreHTTPSErrors: true // INDISPENSABLE ici
            });
            page = await context.newPage();
            */


            if (device != '<N/A>') {
                context = await browser.newContext({
                    ...devices[device], // Apply the device settings
                    // ignoreHTTPSErrors: true // INDISPENSABLE ici
                });
                page = await context.newPage();
            } else {
                context = await browser.newContext({
                    viewport: null,
                    //ignoreHTTPSErrors: true // INDISPENSABLE ici

                });
                page = await context.newPage();
            }


        } else {

            // ============================================
            // ======        Use Certificate         ======
            // ============================================

            console.log('Using the certificate ' + certificate)

            let projectName
            // Get the name of the project
            const result = await getProjectById(data.projectID);
            if (result.length) {
                projectName = result[0].project
            } else {
                ret = { success: 0, message: "startBrowser: Cannot find the project: " + data.projectID + "!" }
                return (ret)
            }


            let pathName = '../../../uploads/' + data.projectID + '_' + projectName + '/'
            let certificatePath = path.join(__dirname, pathName + certificate)

            // Check if the certificate exist
            ret = await fileExist(certificatePath)
            if (!ret) {
                // file not found!
                ret = { success: 0, message: "startBrowser: Cannot find the certificate: " + certificatePath + "!" }
                return (ret)
            }
            console.log ("the certificate: " + certificatePath + " exists!")

            const isCertificatePfxP12 = /\.(p12|pfx)$/i.test(certificate);
            const isCertificateCrt = /\.crt$/i.test(certificate);
            let clientCert

            if (isCertificatePfxP12) {
                console.log('Create a context for a certificate .p12 or .pfx')
                // Configuration for certificate .pfx or.p12 + password
                clientCert = {
                    origin: certificateUrl,
                    pfxPath: certificatePath,
                    passphrase: certificateCode
                };

            } else if (isCertificateCrt) {
                console.log('Create a context for a certificate Certificate .crt');
                // Configuration for certificate .crt + (optional) password
                let certificateKey = certificatePath.replace('.crt', '.key')

                // Check if the certificate key exists
                ret = await fileExist(certificateKey)
                if (!ret) {
                    // file not found!
                    ret = { success: 0, message: "startBrowser: Cannot find the certificate key: " + certificateKey + "!" }
                    return (ret)
                }
                console.log ("the certificate key: " + certificateKey + " exists!")

                clientCert = {
                    origin: certificateUrl,
                    certPath: certificatePath,
                    keyPath: certificateKey,
                    // Only adds the passphrase property if it's not '<N/A>'
                    ...(certificateCode !== '<N/A>' && { passphrase: certificateCode })
                };

            } else {
                console.log('Invalid certificate, use only the follwoing extension: .p12, .pfx or .crt!')
                ret = { success: 0, message: "Invalid certificate, use only the follwoing extension: .p12, .pfx or .crt!" }
                return (ret)
            }


            // Remove the comment later and remove the line under the comment block


            // context = await browser.newContext({
            //     ignoreHTTPSErrors: true,
            //     clientCertificates: [clientCert]
            // });

            context = await browser.newContext();  // to be removed later

            page = await context.newPage();

        }




        this.page = page
        this.browser = browser
        this.context = context
        this.headless = headless
        this.browserName = browserName
        this.device = device

        ret = { success: 1, message: "Browser started!", page: page, browser: browser, headless: headless, browserName: browserName, device: device, context: context }

        return (ret)

    }


    /**
     * @function
     *   quitBrowser: Quit the browser
     *
     */
    async quitBrowser() {

        if (this.browser == 0) {
            console.log('Browser is already closed!')
            return { success: 1, message: 'Browser already stopped!' }
        }

        try {
            await this.browser.close()
            this.browser = 0 // just to free the memory
            return { success: 1, message: 'Driver stopped!' }
        } catch (err) {
            console.log('quitBrowser fatal error detected!')
            //console.log(err.message)
            return { success: 0, message: err.message }
        }
    }



} // end class

// Export BrowserUtility
module.exports = BrowserUtility;

