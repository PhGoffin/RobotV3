
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-30
 * @Last Modified by: 
 * @Last Modified time: 2024-10-04 09:22:34
 * @Description: Add a new function
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addFunction = (functionName, rulefunction, comment, tip1, parameter1, defaultValue1, natural1, tip2, parameter2, defaultValue2, natural2,
                    tip3, parameter3, defaultValue3, natural3, tip4, parameter4, defaultValue4, natural4, position, active) => {

    const error = ref(null)

    const addNewFunction = async (testfunction, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addFunction.js/addNewFunction', 3, 'LOCAL Database Add Function not implemented', trace)
            } else {
                consoleLog('addFunction.js/addNewFunction', 3, 'functionName: ' + functionName + ', comment: ' + comment + ', position: ' + position, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'function/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'functionName': functionName, 'rulefunction':rulefunction, 'comment': comment, 
                    'tip1': tip1, 'parameter1': parameter1, 'defaultValue1': defaultValue1, 'natural1': natural1, 'tip2': tip2, 
                    'parameter2': parameter2, 'defaultValue2': defaultValue2, 'natural2': natural2, 'tip3': tip3, 'parameter3': parameter3, 'defaultValue3': defaultValue3, 
                    'natural3': natural3, 'tip4': tip4, 'parameter4': parameter4, 'defaultValue4': defaultValue4, 'natural4': natural4, 'position': position, 'active': active })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new function')
                }
                testfunction.value = await data.json()
                consoleLog('addFunction.js/addNewFunction', 3, '--- createFunction ---' + url + 'function/create', trace)
                consoleLog('addFunction.js/addNewFunction', 3, '--- Message: ' + testfunction.value.message, trace)
                consoleLog('addFunction.js/addNewFunction', 3, testfunction.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addFunction.js/addNewFunction', 3, error.value, trace)
        }
    }

    return { error, addNewFunction }
}

export default addFunction