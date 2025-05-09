/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-12-09
 * @Last Modified by: 
 * @Last Modified time: 2024-12-10 07:44:01
 * @Description: Delete all the performances of a scenario in a space
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteAllPerformance = (projectID, space, scenarioID) => {

    const error = ref(null)

    const deleteThePerformance = async (performance, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteAllPerformance.js/deleteThePerformance', 3, 'LOCAL Database full delete performance not implemented', trace)
            } else {
                consoleLog('deleteAllPerformance.js/deleteThePerformance', 3, 'space: ' + space + ', scenarioID: ' + scenarioID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'performance/fulldelete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'space': space, 'scenarioID': scenarioID})
                })
                if (!data.ok) {
                    throw Error('Error during the full delete of the performance')
                }
                performance.value = await data.json()
                consoleLog('deleteAllPerformance.js/deleteThePerformance', 3, '--- deleteAllPerformance ---' + url + 'performance/fulldelete', trace)
                consoleLog('deleteAllPerformance.js/deleteThePerformance', 3, performance.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteAllPerformance.js/deleteThePerformance', 3, error.value, trace)
        }
    }

    return { error, deleteThePerformance }
}

export default deleteAllPerformance