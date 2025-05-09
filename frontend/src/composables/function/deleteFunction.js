/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-23
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete a function
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteFunction = (functionID) => {

    const error = ref(null)

    const deleteTheFunction = async (testfunction, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteFunction.js/deleteTheFunction', 3, 'LOCAL Database delete function not implemented', trace)
            } else {
                consoleLog('deleteFunction.js/deleteTheFunction', 3, 'functionID: ' + functionID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'function/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'functionID': functionID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the function')
                }
                testfunction.value = await data.json()
                consoleLog('deleteFunction.js/deleteTheFunction', 3, '--- deleteFunction ---' + url + 'function/delete', trace)
                consoleLog('deleteFunction.js/deleteTheFunction', 3, '--- Message: ' + testfunction.value.message, trace)
                consoleLog('deleteFunction.js/deleteTheFunction', 3, testfunction.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteFunction.js/deleteTheFunction', 3, error.value, trace)
        }
    }

    return { error, deleteTheFunction }
}

export default deleteFunction