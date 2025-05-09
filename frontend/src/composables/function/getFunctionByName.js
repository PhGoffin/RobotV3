/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-10
 * @Last Modified by: 
 * @Last Modified time: 2024-10-03 07:08:13
 * @Description: Get a function by its name
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getFunctionByName = (functionName) => {

    const error = ref(null)

    const getTheFunction = async (testfunction, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getFunctionByName.js/getTheFunction', 3, 'LOCAL Database get function by name not implemented', trace)
            } else {
                consoleLog('getFunctionByName.js/getTheFunction', 3, 'functionName: ' + functionName, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'function/name', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'functionName': functionName })
                })
                if (!data.ok) {
                    throw Error('Error during the get of a function')
                }
                testfunction.value = await data.json()
                consoleLog('getFunctionByName.js/getTheFunction', 3, '--- getFunctionByName ---' + url + 'function/name', trace)
                consoleLog('getFunctionByName.js/getTheFunction', 3, '--- Message: ' + testfunction.value.message, trace)
                consoleLog('getFunctionByName.js/getTheFunction', 3, testfunction.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getFunctionByName.js/getTheFunction', 3, error.value, trace)
        }
    }

    return { error, getTheFunction }
}

export default getFunctionByName