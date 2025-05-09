/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-15
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Scenario position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionScenario = (scenarioID, position) => {

    const error = ref(null)

    const updateThePosition = async (scenario, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionScenario.js/updateThePosition', 3, 'LOCAL Database Update Scenario position not implemented', trace)
            } else {
                consoleLog('updatePositionScenario.js/updateThePosition', 3,'scenarioID: ' + scenarioID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'scenario/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'scenarioID': scenarioID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the scenario position')
                }
                scenario.value = await data.json()
                consoleLog('updatePositionScenario.js/updateThePosition', 3, '--- updatePositionScenario ---' + url + 'scenario/position', trace)
                consoleLog('updatePositionScenario.js/updateThePosition', 3, '--- Message: ' + scenario.value.message, trace)
                consoleLog('updatePositionScenario.js/updateThePosition', 3, scenario.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionScenario.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionScenario