/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-21
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:17:23
 * @Description: Get the scenario by ID
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getScenario = (scenarioID) => {

    const error = ref(null)

    const loadScenario = async (scenario, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getScenario.js/loadScenario', 3, 'LOCAL Database scenario by ID not implemented', trace)
            } else {
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'scenario/' + scenarioID)
                if (!data.ok) {
                    throw Error('no scenario available')
                }
                scenario.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getScenario.js/loadScenario', 3, err, trace)
        }
    }

    return { error, loadScenario }
}

export default getScenario