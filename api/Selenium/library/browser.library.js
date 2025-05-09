/**
* @author 	Philippe Goffin
* @name   	browser utility
* @property	class 
*
* @description 
*  Store driver information
*
* @version 
* V1.0 PGO	25/04/2024	Initial version   
*
*/

const { Builder, By, Key, ChromeOptions } = require("selenium-webdriver")


class BrowserUtility {
    constructor() {
        this.chrome = require("selenium-webdriver/chrome")
        this.driver = 0
        //this.options = new this.chrome.Options()
        //console.log('browser constructor')
    }


    /**
     * @function
     *   startBrowser: Start the browser (Obsolete version)
     *
     */
    async startBrowser_Old() {

        //----------------------------------
        // launch the browser
        // ----------------------------------
        try {
            this.driver = new Builder()
            this.driver = await this.driver.forBrowser("chrome").build()
            //console.log('DRIVER: ', this.driver)

            //this.driver.get("https://webgate.acceptance.ec.testa.eu/mwp/home ?1fa")

            return { success: 1, message: 'Driver started!', driver: this.driver }

        } catch (err) {
            console.log(err.message)
            return { success: 0, message: err.message }
        }
    }


    /**
     * @function
     *   startBrowser: Start the browser with a proxy
     *
     */
    async startBrowser(projectID) {
        const proxy = require('selenium-webdriver/proxy');
        const { getParametersByCode } = require("../../parameter/parameter.service.js");
        const { getDummyuserByUser } = require("../../dummyuser/dummyuser.service.js");
        const { decryptPassword } = require("./password.library.js")


        let proxyDummy = ''
        // get the Proxy dumy user
        let dataAPI = { projectID: projectID, code: 'Proxy' }
        const result1 = await getParametersByCode(dataAPI);
        if (result1.length) {
            proxyDummy = result1[0].paramValue
        } else {
            proxyDummy = '<N/A>'
        }

        console.log ('startBrowser - proxyDummy: ' + proxyDummy)


        if (proxyDummy != '<N/A>') {
            // Process with proxy
            // ------------------
            console.log ('startBrowser - getDummyuserByUser')
            dataAPI = { projectID: projectID, dummy: proxyDummy, active: 1 }
            const result1 = await getDummyuserByUser(dataAPI);
            if (result1.length) {
                // get the login
                let proxyUsername = result1[0].user
                // get the password
                let proxyPassword = result1[0].password
                // Decrypt the password
                if (result1[0].crypted) {
                    ret = await decryptPassword(proxyPassword)
                    if (ret.success) {
                        proxyPassword = ret.password
                    } else {
                        return { success: 0, message: "Cannot decrypt the password!", stop: 1 }
                    }
                }
                // get the url
                let proxyurl = result1[0].extraInfo
                //console.log('Dummy login: ' + proxyUsername + ', password: ' + proxyPassword + ' proxyurl: ' + proxyurl)
                let proxyhttp = `http://${proxyUsername}:${proxyPassword}@${proxyurl}`;
                let proxyhttps = `https://${proxyUsername}:${proxyPassword}@${proxyurl}`;

                //----------------------------------
                // launch the browser with Proxy
                // ----------------------------------
                try {
                    console.log ('startBrowser - launch the browser with Proxy')
                    this.driver = new Builder()
                    this.driver = await this.driver
                        .forBrowser("chrome")
                        //.setChromeOptions(this.options)
                        .setProxy(proxy.manual({
                            http: proxyhttp,
                            https: proxyhttps,
                        }))
                        .build()
                    console.log('start browser with proxy ok!')
                    return { success: 1, message: 'Driver with proxy started!', driver: this.driver }

                } catch (err) {
                    console.log(err.message)
                    return { success: 0, message: err.message }
                }

            } else {
                console.log('Error: Cannot find the dummy user: ' + proxyDummy)
                return { success: 0, message: 'Error: Cannot find the dummy user: ' + proxyDummy, stop: 1 }
            }


        } else {
            //----------------------------------
            // launch the browser without proxy
            // ----------------------------------
            try {
                console.log ('before new Builder')
                this.driver = new Builder()
                console.log ('before build')
                this.driver = await this.driver.forBrowser("chrome").build()
                console.log('start browser without proxy ok!')
                return { success: 1, message: 'Driver started!', driver: this.driver }
            } catch (err) {
                console.log(err.message)
                return { success: 0, message: err.message }
            }
        }
    }


    /**
     * @function
     *   quitBrowser: Quit the browser
     *
     */
    async quitBrowser() {

        //console.log ('debug: browser.library quitBrowser')
        
        if (this.driver == 0) {
            console.log('Browser is already closed!')
            return { success: 1, message: 'Browser already stopped!' }
        }

        try {
            //console.log ('debug: browser.library before url')
            //let url = await this.driver.getCurrentUrl()
            //console.log ('debug: browser.library url:', url)
            //console.log ('debug: browser.library before close')
            await this.driver.close()
            //console.log ('debug: browser.library after close')
            await this.driver.quit()
            this.driver = 0 // just to free the memory
            return { success: 1, message: 'Driver stopped!' }
        } catch (err) {
            console.log ('quitBrowser fatal error detected!')
            //console.log(err.message)
            return { success: 0, message: err.message }
        }
    }


    /**
     * @function
     *   getBrowser: get the browser
     *
     */
    async getBrowser() {
        console.log('in getBrowser')
        return { success: 1, driver: this.driver }
    }


} // end class   


// Export BrowserUtility
module.exports = BrowserUtility;