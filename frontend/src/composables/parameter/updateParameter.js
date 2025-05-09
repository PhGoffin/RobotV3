/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-26
 * @Last Modified by: 
 * @Last Modified time: 2024-04-11 07:10:26
 * @Description: Update a parameter
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updateParameter = (parameterID, code, paramValue, inputoutput, comment, active) => {

    const error = ref(null)

    const updateTheParameter = async (parameter, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateParameter.js/updateTheParameter', 3, 'LOCAL Database Update Parameter not implemented', trace)
            } else {
                consoleLog('updateParameter.js/updateTheParameter', 3,'parameterID: ' + parameterID  + ', code:' + code + ', paramValue: ' + paramValue + ', comment: ' + comment, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'parameter/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'code': code, 'paramValue': paramValue, 'inputoutput': inputoutput,  'comment': comment, 'active': active, 'parameterID': parameterID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a parameter')
                }
                parameter.value = await data.json()
                consoleLog('updateParameter.js/updateTheParameter', 3, '--- updateParameter ---' + url + 'parameter/update', trace)
                consoleLog('updateParameter.js/updateTheParameter', 3, '--- Message: ' + parameter.value.message, trace)
                consoleLog('updateParameter.js/updateTheParameter', 3, parameter.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateParameter.js/updateTheParameter', 3, error.value, trace)
        }
    }

    return { error, updateTheParameter }
}

export default updateParameter