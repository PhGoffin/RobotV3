/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-26
 * @Last Modified by: 
 * @Last Modified time: 2024-04-11 07:09:55
 * @Description: Add a new parameter
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addParameter = (projectID, storyheaderID, code, paramValue, inputoutput, comment, position, active) => {

    const error = ref(null)

    const addNewParameter = async (parameter, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addParameter.js/addNewParameter', 3, 'LOCAL Database Add Parameter not implemented', trace)
            } else {
                consoleLog('addParameter.js/addNewParameter', 3,'parameter: ' + parameter,  trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'parameter/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'storyheaderID': storyheaderID, 'code': code, 'paramValue': paramValue, 'inputoutput': inputoutput, 'comment': comment, 'position': position, 'active': active })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a parameter')
                }
                parameter.value = await data.json()
                consoleLog('addParameter.js/addNewParameter', 3, '--- createParameter ---' + url + 'parameter/create', trace)
                consoleLog('addParameter.js/addNewParameter', 3, '--- Message: ' + parameter.value.message, trace)
                consoleLog('addParameter.js/addNewParameter', 3, parameter.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addParameter.js/addNewParameter', 3, error.value, trace)
        }
    }

    return { error, addNewParameter }
}

export default addParameter