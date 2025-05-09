/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-30
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Function position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionFunction = (functionID, position) => {

    const error = ref(null)

    const updateThePosition = async (testfunction, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionFunction.js/updateThePosition', 3, 'LOCAL Database Update Reference position not implemented', trace)
            } else {
                consoleLog('updatePositionFunction.js/updateThePosition', 3,'functionID: ' + functionID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'function/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'functionID': functionID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the function position')
                }
                testfunction.value = await data.json()
                consoleLog('updatePositionFunction.js/updateThePosition', 3, '--- updatePositionFunction ---' + url + 'function/position', trace)
                consoleLog('updatePositionFunction.js/updateThePosition', 3, '--- Message: ' + testfunction.value.message, trace)
                consoleLog('updatePositionFunction.js/updateThePosition', 3, testfunction.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionFunction.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionFunction