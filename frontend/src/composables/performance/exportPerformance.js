/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-12-13
 * @Last Modified by: 
 * @Last Modified time: 2024-12-13 08:10:27
 * @Description: Export Performances into a json file
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const exportPerformance = ( projectID, filename) => {

    const error = ref(null)

    const exportThePerformance = async (performance, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('exportPerformance.js/exportThePerformance', 3, 'LOCAL Database Export performances not implemented', trace)
            } else {
                consoleLog('exportPerformance.js/exportThePerformance', 3, 'projectID: ' + projectID + ', filename: ' + filename, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'performance/export', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'filename': filename  })
                })
                if (!data.ok) {
                    throw Error('Error during the export of the performances')
                }
                performance.value = await data.json()
                consoleLog('exportPerformance.js/exportThePerformance', 3, '--- exportPerformance ---' + url + 'performance/export', trace)
                consoleLog('exportPerformance.js/exportThePerformance', 3, '--- Message: ' + performance.value.message, trace)
                consoleLog('exportPerformance.js/exportThePerformance', 3, performance.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('exportPerformance.js/exportThePerformance', 3, error.value, trace)
        }
    }

    return { error, exportThePerformance }
}

export default exportPerformance