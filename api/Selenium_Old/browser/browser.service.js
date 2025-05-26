const browserMiddelware = require("../library/browser.library")
const browser = new browserMiddelware()

module.exports = {

    /*
     * @Author: Philippe Goffin 
     * @Email: artcomputer123@gmail.com
     * @Date: 2023-11-28 07:49:49 
     * @Last Modified by: 
     * @Last Modified time: 2024-11-27 11:52:26
     * @Description: All the database services available for the API browser
     */

    // -----------------------------------------------------------
    // Get a browser
    // -----------------------------------------------------------
    getBrowser: async () => {
        return new Promise(async (resolve, reject) => {
            const result = await browser.getBrowser()
            //console.log('Service: result:', result)
            if (result.success) {
                //result.driver.get("https://webgate.acceptance.ec.testa.eu/mwp/home ?1fa")
                return resolve({ success: 1, message: "Browser OK!", driver: result.driver })
            } else {
                return reject({ success: 0, message: "Browser KO!" })
            }
        });
    },


    // -----------------------------------------------------------
    // Start a browser
    // -----------------------------------------------------------
    startBrowser: (id) => {
        return new Promise(async (resolve, reject) => {
            const result = await browser.startBrowser(id);
            //console.log(result)
            if (result.success) {
                return resolve({ success: 1, message: "Starting Browser OK!", driver: result.driver })
            } else {
                return reject({ success: 0, message: "Starting Browser KO!" })
            }
        });
    },


    stopBrowser: () => {
        return new Promise(async (resolve, reject) => {

            try {
                //console.log ('debug: browser.service stopBrowser')
                const result = await browser.quitBrowser();
                //console.log('debug: browser.service after stopBrowser: ', result)
                if (result.success) {
                    return resolve({ success: 1, message: "Stop Browser OK!", driver: result.driver })
                } else {
                    return reject({ success: 0, message: "Stop Browser KO!" })
                }
            }
            catch (err) {
                console.log ('stopBrowser: Fatal error: Browser not responding!')
                return reject({ success: 0, message: "Stop Browser not responding!" })
            }
        });
    },


};
