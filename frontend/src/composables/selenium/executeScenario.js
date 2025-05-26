/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-27
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-22 12:11:45
 * @Description: Execute a selenium scenario
 */


import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const executeScenario = (scenarioName, scenarioID, projectID, subprojectID, userID, userName) => {

    const error = ref(null)

    const execTest = async (selenium, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('executeScenario.js/execTest', 3, 'LOCAL Database Execute Scenario not implemented', trace)
            } else {
                consoleLog('executeScenario.js/execTest', 3, 'scenarioID: ' + scenarioID + " - " + scenarioName, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'playwright/robot/test', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'scenarioName': scenarioName, 'scenarioID': scenarioID, 'projectID': projectID, 'subprojectID': subprojectID, 'userID': userID, 'userName': userName })
                })
                if (!data.ok) {
                    throw Error('Error during the execution of the Test scenario')
                }
                selenium.value = await data.json()
                consoleLog('executeScenario.js/execTest', 3, '--- seleniumScenario ---' + url + 'playwright/robot/test', trace)
                consoleLog('executeScenario.js/execTest', 3, selenium.value, trace)

            }

        } catch (err) {
            error.value = err.message
            consoleLog('executeScenario.js/execTest', 3, error.value, trace)
        }
    }

    return { error, execTest }
}

export default executeScenario