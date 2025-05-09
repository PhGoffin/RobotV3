
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-30
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-30 08:56:09
 * @Description: Import a scenario
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const importScenario = (currentSubprojectID, scenarioName, scenarioID) => {

    const error = ref(null)

    const importTheScenario = async (scenario, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('importScenario.js/importTheScenario', 3, 'LOCAL Database import scenario not implemented', trace)
            } else {
                consoleLog('importScenario.js/importTheScenario', 3, 'currentSubprojectID: ' + currentSubprojectID + ', scenario: ' + scenarioName + ', scenarioID: ' + scenarioID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'scenario/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'currentSubprojectID': currentSubprojectID, 'scenarioName': scenarioName, 'scenarioID': scenarioID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a scenario')
                }
                scenario.value = await data.json()
                consoleLog('importScenario.js/importTheScenario', 3, '--- importScenario ---' + url + 'scenario/import', trace)
                consoleLog('importScenario.js/importTheScenario', 3, '--- Message: ' + scenario.value.message, trace)
                consoleLog('importScenario.js/importTheScenario', 3, scenario.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('importScenario.js/importTheScenario', 3, error.value, trace)
        }
    }

    return { error, importTheScenario }
}

export default importScenario