/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-15
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Reorder all the Scenarios
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderScenarios = (subprojectID) => {

    const error = ref(null)

    const reorderTheScenarios = async (scenario, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderScenarios.js/reorderTheScenarios', 3, 'LOCAL Database reorderScenarios is not implemented', trace)
            } else {
                consoleLog('reorderScenarios.js/reorderTheScenarios', 3,'subprojectID: ' + subprojectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'scenario/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subprojectID': subprojectID })
                })

                if (!data.ok) {
                    throw Error('No scenario available')
                }
                scenario.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderScenarios.js/reorderTheScenarios', 3, err)
        }
    }

    return { error, reorderTheScenarios }
}

export default reorderScenarios