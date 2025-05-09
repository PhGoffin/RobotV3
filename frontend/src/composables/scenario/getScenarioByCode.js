/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-29
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-29 15:38:50
 * @Description: get a Scenario by code (name)
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const getScenarioByCode = (subprojectID, code) => {

    const error = ref(null)

    const getScenario = async (scenario, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getScenarioByCode.js/getScenario', 3, 'LOCAL Database Get Scenario by Code not implemented', trace)
            } else {
                consoleLog('getScenarioByCode.js/getScenario', 3,'subprojectID: ' + subprojectID + ', scenario: ' + code, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'scenario/code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subprojectID': subprojectID, 'scenario': code  })
                })
                if (!data.ok) {
                    throw Error('Error during the get scenario by code')
                }
                scenario.value = await data.json()
                consoleLog('getScenarioByCode.js/getScenario', 3, '--- getScenarioByCode ---' + url + 'scenario/code', trace)
                consoleLog('getScenarioByCode.js/getScenario', 3, '--- Message: ' + scenario.value.message, trace)
                consoleLog('getScenarioByCode.js/getScenario', 3, scenario.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getScenarioByCode.js/getScenario', 3, error.value, trace)
        }
    }

    return { error, getScenario }
}

export default getScenarioByCode