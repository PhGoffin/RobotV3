/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-30
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Copy a Function
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyFunction = (functionID, position) => {

    const error = ref(null)

    const copyTheFunction = async (testfunction, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyFunction.js/copyTheFunction', 3, 'LOCAL Database Copy Function not implemented', trace)
            } else {
                consoleLog('copyFunction.js/copyTheFunction', 3,'functionID: ' + functionID + ', Position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'function/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'functionID': functionID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a function')
                }
                testfunction.value = await data.json()
                consoleLog('copyFunction.js/copyTheFunction', 3, '--- copyFunction ---' + url + 'function/copy', trace)
                consoleLog('copyFunction.js/copyTheFunction', 3, '--- Message: ' + testfunction.value.message, trace)
                consoleLog('copyFunction.js/copyTheFunction', 3, testfunction.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyFunction.js/copyTheFunction', 3, error.value, trace)
        }
    }

    return { error, copyTheFunction }
}

export default copyFunction