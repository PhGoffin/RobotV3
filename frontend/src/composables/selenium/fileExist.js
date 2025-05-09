/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-21
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-19 06:52:50
 * @Description: Check if a file exists on the server
 */


import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const fileExist = (filename) => {

    const error = ref(null)

    const checkFile = async (selenium, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('fileExist.js/checkFile', 3, 'LOCAL Database fielExist Scenario not implemented', trace)
            } else {
                consoleLog('fileExist.js/checkFile', 3, 'filename: ' + filename, trace)

                    const url = process.env.VUE_APP_MYSQL_API
                    let data = await fetch(url + 'Selenium/robot/isFile', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({  'filename': filename })
                    })

                    console.log ('Data: ', data)
                    if (!data.ok) {
                        throw Error('Error during the check of a file')
                    }
                    selenium.value = await data.json()
                    consoleLog('fileExist.js/checkFile', 3, '--- checkFile ---' + url + 'Selenium/robot//isFile - filename: ' + filename, trace)
                    consoleLog('fileExist.js/checkFile', 3, selenium.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('fileExist.js/checkFile', 3, error.value, trace)
        }
    }

    return { error, checkFile }
}

export default fileExist