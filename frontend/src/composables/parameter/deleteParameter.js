/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-26
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Delete a Parameter
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteParameter = (parameterID) => {

    const error = ref(null)

    const deleteTheParameter = async (parameter, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteParameter.js/deleteTheParameter', 3, 'LOCAL Database Delete Parameter not implemented', trace)
            } else {
                consoleLog('deleteParameter.js/deleteTheParameter', 3,'parameterID: ' + parameterID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'parameter/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'parameterID': parameterID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of a parameter')
                }
                parameter.value = await data.json()
                consoleLog('deleteParameter.js/deleteTheParameter', 3,'--- deleteParameter ---' + url + 'parameter/delete', trace)
                consoleLog('deleteParameter.js/deleteTheParameter', 3,'--- Message: ' + parameter.value.message, trace)
                consoleLog('deleteParameter.js/deleteTheParameter', 3,parameter.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteParameter.js/deleteTheParameter', 3, error.value, trace)
        }
    }

    return { error, deleteTheParameter }
}

export default deleteParameter