/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-15
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 11:02
 * @Description: Copy a Scenario
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyScenario = (scenarioID, position, userName, today) => {

    const error = ref(null)

    const copyTheScenario = async (scenario, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyScenario.js/copyTheScenario', 3, 'LOCAL Database Copy Scenario not implemented', trace)
            } else {
                consoleLog('copyScenario.js/copyTheScenario', 3,'scenarioID: ' + scenarioID + ', Position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'scenario/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'user': userName, 'today': today, 'scenarioID': scenarioID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a scenario')
                }
                scenario.value = await data.json()
                consoleLog('copyScenario.js/copyTheScenario', 3, '--- copyScenario ---' + url + 'scenario/copy', trace)
                consoleLog('copyScenario.js/copyTheScenario', 3, '--- Message: ' + scenario.value.message, trace)
                consoleLog('copyScenario.js/copyTheScenario', 3, scenario.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyScenario.js/copyTheScenario', 3, error.value, trace)
        }
    }

    return { error, copyTheScenario }
}

export default copyScenario