/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-30
 * @Last Modified by: 
 * @Last Modified time: 2024-10-04 09:24:54
 * @Description: Update a function
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updateFunction = (functionName, rulefunction, comment, tip1, parameter1, defaultValue1, natural1, tip2, parameter2, defaultValue2, natural2, 
                        tip3, parameter3, defaultValue3, natural3, tip4, parameter4, defaultValue4, natural4, active, functionID) => {

    const error = ref(null)

    const updateTheFunction = async (testfunction, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateFunction.js/updateTheFunction', 3, 'LOCAL Database Update function not implemented', trace)
            } else {
                consoleLog('updateFunction.js/updateTheFunction', 3, 'functionID: ' + functionID + ', comment: ' + comment , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'function/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'functionName': functionName, 'rulefunction':rulefunction, 'comment': comment, 
                    'tip1': tip1, 'parameter1': parameter1, 'defaultValue1': defaultValue1, 'natural1': natural1, 'tip2': tip2, 'parameter2': parameter2, 'defaultValue2': defaultValue2, 'natural2': natural2, 
                    'tip3': tip3, 'parameter3': parameter3, 'defaultValue3': defaultValue3, 'natural3': natural3, 'tip4': tip4, 'parameter4': parameter4, 'defaultValue4': defaultValue4, 'natural4': natural4,
                    'active': active, 'functionID': functionID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a function')
                }
                testfunction.value = await data.json()
                consoleLog('updateFunction.js/updateTheFunction', 3, '--- updateFunction ---' + url + 'function/update', trace)
                consoleLog('updateFunction.js/updateTheFunction', 3, '--- Message: ' + testfunction.value.message, trace)
                consoleLog('updateFunction.js/updateTheFunction', 3, testfunction.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateFunction.js/updateTheFunction', 3, error.value, trace)
        }
    }

    return { error, updateTheFunction }
}

export default updateFunction