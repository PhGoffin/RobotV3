/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-26
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Parameter position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionParameter = (parameterID, position) => {

    const error = ref(null)

    const updateThePosition = async (parameter, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionParameter.js/updateThePosition', 3, 'LOCAL Database Update Parameter position not implemented', trace)
            } else {
                consoleLog('updatePositionParameter.js/updateThePosition', 3,'parameterID: ' + parameterID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'parameter/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'parameterID': parameterID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the parameter position')
                }
                parameter.value = await data.json()
                consoleLog('updatePositionParameter.js/updateThePosition', 3, '--- updatePositionParameter ---' + url + 'parameter/position', trace)
                consoleLog('updatePositionParameter.js/updateThePosition', 3, '--- Message: ' + parameter.value.message, trace)
                consoleLog('updatePositionParameter.js/updateThePosition', 3, parameter.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionParameter.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionParameter