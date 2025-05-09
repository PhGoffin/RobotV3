/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-26
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Copy a Parameter
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyParameter = (parameterID, position) => {

    const error = ref(null)

    const copyTheParameter = async (parameter, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyParameter.js/copyTheParameter', 3, 'LOCAL Database Copy Parameter not implemented', trace)
            } else {
                consoleLog('copyParameter.js/copyTheParameter', 3,'parameterID: ' + parameterID + ', Position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'parameter/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'parameterID': parameterID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a parameter')
                }
                parameter.value = await data.json()
                consoleLog('copyParameter.js/copyTheParameter', 3, '--- copyParameter ---' + url + 'parameter/copy', trace)
                consoleLog('copyParameter.js/copyTheParameter', 3, '--- Message: ' + parameter.value.message, trace)
                consoleLog('copyParameter.js/copyTheParameter', 3, parameter.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyParameter.js/copyTheParameter', 3, error.value, trace)
        }
    }

    return { error, copyTheParameter }
}

export default copyParameter