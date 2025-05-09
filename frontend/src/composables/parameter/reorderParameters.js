/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-26
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Reorder all the Parameters
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderParameters = (projectID) => {

    const error = ref(null)

    const reorderTheParameter = async (parameter, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderParameters.js/reorderTheParameter', 3, 'LOCAL Database reorder Parameters is not implemented', trace)
            } else {
                consoleLog('reorderParameters.js/reorderTheParameter', 3,'projectID: ' + projectID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'parameter/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID })
                })

                if (!data.ok) {
                    throw Error('No parameter available')
                }
                parameter.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderParameters.js/reorderTheParameter', 3, err)
        }
    }

    return { error, reorderTheParameter }
}

export default reorderParameters