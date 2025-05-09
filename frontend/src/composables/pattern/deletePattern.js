
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: 
 * @Last Modified time: 2024-04-12 09:45:51
 * @Description: Delete a pattern
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deletePattern = (patternID) => {

    const error = ref(null)

    const deleteThePattern = async (pattern, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deletePattern.js/deleteThePattern', 3, 'LOCAL Database delete Pattern not implemented', trace)
            } else {
                consoleLog('deletePattern.js/deleteThePattern', 3, 'patternID: ' + patternID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'pattern/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'patternID': patternID })
                })

                if (!data.ok) {
                    throw Error('Error during the delete of an Pattern')
                }
                pattern.value = await data.json()
                consoleLog('deletePattern.js/deleteThePattern', 3, '--- deletePattern ---' + url + 'pattern/delete/' + patternID, trace)
                consoleLog('deletePattern.js/deleteThePattern', 3, '--- Message: ' + pattern.value.message, trace)
                consoleLog('deletePattern.js/deleteThePattern', 3, pattern.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deletePattern.js/deleteThePattern', 3, error.value, trace)
        }
    }

    return { error, deleteThePattern }
}

export default deletePattern