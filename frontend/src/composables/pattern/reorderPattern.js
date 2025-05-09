
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: 
 * @Last Modified time: 2024-04-12 14:12:43
 * @Description: Reorder Patterns
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderPattern = (projectID) => {

    const error = ref(null)

    const reorderThePattern = async (pattern, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderPattern.js/reorderThePattern', 3, 'LOCAL Database reorder Patterns not implemented', trace)
            } else {
                consoleLog('reorderPattern.js/reorderThePattern', 3, 'projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'pattern/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID })
                })
                if (!data.ok) {
                    throw Error('Error during the reorder Pattern')
                }
                pattern.value = await data.json()
                consoleLog('reorderPattern.js/reorderThePattern', 3, '--- reorderpattern ---' + url + 'pattern/reorder', trace)
                consoleLog('reorderPattern.js/reorderThePattern', 3, '--- Message: ' + pattern.value.message, trace)
                consoleLog('reorderPattern.js/reorderThePattern', 3, pattern.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderPattern.js/reorderThePattern', 3, error.value, trace)
        }
    }

    return { error, reorderThePattern }
}

export default reorderPattern