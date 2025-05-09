/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-26
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-10 15:08:00
 * @Description: Get all the parameters by the projectID and code
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getParametersByCode = (projectID, code) => {

    const error = ref(null)

    const loadParameters = async (parameters, trace) => {
        try {


            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getParametersByCode.js/loadParameters', 3, 'LOCAL Database parameter by code not implemented', trace)
            } else {
                consoleLog('getParametersByCode.js/loadParameters', 3, 'projectID: ' + projectID + ', code: ' + code ,trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'parameter/code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'code': code })
                })
                if (!data.ok) {
                    throw Error('no parameter available')
                }
                parameters.value = await data.json()
                consoleLog('getParametersByCode.js/loadParameters', 3, parameters.value,trace)
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getParametersByCode.js/loadParameters', 3, err, trace)
        }
    }

    return { error, loadParameters }
}

export default getParametersByCode