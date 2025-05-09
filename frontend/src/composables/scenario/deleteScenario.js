/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-21
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete a scenario
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteScenario = (subprojectID, scenarioID) => {

    const error = ref(null)

    const deleteTheScenario = async (scenario, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteScenario.js/deleteTheScenario', 3, 'LOCAL Database delete scenario not implemented', trace)
            } else {
                consoleLog('deleteScenario.js/deleteTheScenario', 3, 'subprojectID: ' + subprojectID + ', scenarioID: ' + scenarioID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'scenario/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subprojectID': subprojectID, 'scenarioID': scenarioID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the scenario')
                }
                scenario.value = await data.json()
                consoleLog('deleteScenario.js/deleteTheScenario', 3, '--- deleteScenario ---' + url + 'scenario/delete', trace)
                consoleLog('deleteScenario.js/deleteTheScenario', 3, '--- Message: ' + scenario.value.message, trace)
                consoleLog('deleteScenario.js/deleteTheScenario', 3, scenario.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteScenario.js/deleteTheScenario', 3, error.value, trace)
        }
    }

    return { error, deleteTheScenario }
}

export default deleteScenario