/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-07
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-22 12:12:45
 * @Description: Execute a selenium suite
 */


import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const executeSuite = (suiteName, suiteID, projectID, subprojectID, userID, userName) => {
    const error = ref(null)
    const execSuite = async (selenium, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('executeSuite.js/execSuite', 3, 'LOCAL Database Execute Suite not implemented', trace)
            } else {
                consoleLog('executeSuite.js/execSuite', 3, 'suiteID: ' + suiteID + " - " + suiteName, trace)

                    const url = process.env.VUE_APP_MYSQL_API
                    let data = await fetch(url + 'Selenium/robot/suite', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({  'suiteName': suiteName, 'suiteID': suiteID, 'projectID': projectID, 'subprojectID': subprojectID, 'userID': userID , 'userName': userName})
                    })
                    if (!data.ok) {
                        throw Error('Error during the execution of the Suite')
                    }
                    selenium.value = await data.json()
                    consoleLog('executeSuite.js/execSuite', 3, '--- seleniumSuite ---' + url + 'Selenium/robot/suite', trace)
                    consoleLog('executeSuite.js/execSuite', 3, selenium.value, trace)

            }

        } catch (err) {
            error.value = err.message
            consoleLog('executeSuite.js/execSuite', 3, error.value, trace)
        }
    }

    return { error, execSuite }
}

export default executeSuite