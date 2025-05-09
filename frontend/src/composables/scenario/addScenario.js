
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-21
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 15:36
 * @Description: Add a new scenario
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addScenario = (subprojectID, scenarioName, comment, active, userName, today) => {

    const error = ref(null)
    const position = '0I01'

    const addNewScenario = async (scenario, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addScenario.js/addNewScenario', 3, 'LOCAL Database Add scenario not implemented', trace)
            } else {
                consoleLog('addScenario.js/addNewScenario', 3, 'subprojectID: ' + subprojectID + ', scenario: ' + scenarioName + ', comment: ' + comment + ', active: ' + active, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'scenario/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subprojectID': subprojectID, 'scenario': scenarioName, 'comment': comment, 'position': position, 'active': active, 'user': userName, 'today': today })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new scenario')
                }
                scenario.value = await data.json()
                consoleLog('addScenario.js/addNewScenario', 3, '--- createScenario ---' + url + 'scenario/create', trace)
                consoleLog('addScenario.js/addNewScenario', 3, '--- Message: ' + scenario.value.message, trace)
                consoleLog('addScenario.js/addNewScenario', 3, scenario.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addScenario.js/addNewScenario', 3, error.value, trace)
        }
    }

    return { error, addNewScenario }
}

export default addScenario