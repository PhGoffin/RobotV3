/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-21
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:17:23
 * @Description: Get all the scenarios by a subproject
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAllScenariosBySubproject = (subprojectID) => {

    const error = ref(null)

    const loadScenarios = async (scenarios, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAllScenariosBySubproject.js/loadScenarios', 3, 'LOCAL Database scenario by subproject not implemented', trace)
            } else {
                consoleLog('getAllScenariosBySubproject.js/loadScenarios', 3, 'subprojectID: ' + subprojectID ,trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'scenario/subproject/' + subprojectID)
                if (!data.ok) {
                    throw Error('no scenario available')
                }
                scenarios.value = await data.json()
                consoleLog('getAllScenariosBySubproject.js/loadScenarios', 3, '--- getAllScenariosBySubproject ---' + url + 'scenario/subproject/' + subprojectID, trace)
                consoleLog('getAllScenariosBySubproject.js/loadScenarios', 3,'--- Message: ' + scenarios.value.message, trace)
                consoleLog('getAllScenariosBySubproject.js/loadScenarios', 3, scenarios.value, trace)

            }

        } catch (err) {
            error.value = err.message
            consoleLog('getAllScenariosBySubproject.js/loadScenarios', 3, err, trace)
        }
    }

    return { error, loadScenarios }
}

export default getAllScenariosBySubproject