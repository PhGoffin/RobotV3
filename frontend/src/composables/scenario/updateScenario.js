
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-21
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 15:12
 * @Description: Update a scenario
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updateScenario = (subprojectID, scenarioName, comment, active, scenarioID, userName, today) => {

    const error = ref(null)

    const updateTheScenario = async (scenario, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateScenario.js/updateTheScenario', 3, 'LOCAL Database Update scenario not implemented', trace)
            } else {
                consoleLog('updateScenario.js/updateTheScenario', 3, 'subprojectID: ' + subprojectID + ', scenario: ' + scenarioName + ', comment: ' + comment + ', active: ' + active + ', scenarioID: ' + scenarioID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'scenario/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subprojectID': subprojectID, 'scenario': scenarioName, 'comment': comment, 'active': active, 'user': userName, 'today': today, 'scenarioID': scenarioID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a scenario')
                }
                scenario.value = await data.json()
                consoleLog('updateScenario.js/updateTheScenario', 3, '--- updateScenario ---' + url + 'scenario/update', trace)
                consoleLog('updateScenario.js/updateTheScenario', 3, '--- Message: ' + scenario.value.message, trace)
                consoleLog('updateScenario.js/updateTheScenario', 3, scenario.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateScenario.js/updateTheScenario', 3, error.value, trace)
        }
    }

    return { error, updateTheScenario }
}

export default updateScenario