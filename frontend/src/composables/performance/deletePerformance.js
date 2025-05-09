/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-12-09
 * @Last Modified by: 
 * @Last Modified time: 2024-12-09 10:55:49
 * @Description: Delete a performance
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deletePerformance = (performanceID) => {

    const error = ref(null)

    const deleteThePerformance = async (performance, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deletePerformance.js/deleteThePerformance', 3, 'LOCAL Database delete performance not implemented', trace)
            } else {
                consoleLog('deletePerformance.js/deleteThePerformance', 3, 'performanceID: ' + performanceID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'performance/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'performanceID': performanceID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the performance')
                }
                performance.value = await data.json()
                consoleLog('deletePerformance.js/deleteThePerformance', 3, '--- deletePerformance ---' + url + 'performance/delete', trace)
                consoleLog('deletePerformance.js/deleteThePerformance', 3, '--- Message: ' + performance.value.message, trace)
                consoleLog('deletePerformance.js/deleteThePerformance', 3, performance.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deletePerformance.js/deleteThePerformance', 3, error.value, trace)
        }
    }

    return { error, deleteThePerformance }
}

export default deletePerformance