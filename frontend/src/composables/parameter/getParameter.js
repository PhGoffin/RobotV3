/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-26
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Load detail of a parameter
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getParameter = (parameterID) => {

    const error = ref(null)

    const loadParameter = async (parameter, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getParameter.js/loadParameter', 3, 'LOCAL Database get Parameter is not implemented', trace)
            } else {
                consoleLog('getParameter.js/loadParameter', 3,' parameterID ' + parameterID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'parameter/' + parameterID)
                if (!data.ok) {
                    throw Error('No parameter available')
                }
                parameter.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getParameter.js/loadParameter', 3, err)
        }
    }

    return { error, loadParameter }
}

export default getParameter