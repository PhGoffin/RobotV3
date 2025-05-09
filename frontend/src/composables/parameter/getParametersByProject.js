/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-26
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:19:17
 * @Description: Get all the parameters by the projectID
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getParametersByProject = (projectID) => {

    const error = ref(null)

    const loadParameters = async (parameters, trace) => {
        try {


            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getParametersByProject.js/loadParameters', 3, 'LOCAL Database parameter by project not implemented', trace)
            } else {
                consoleLog('getParametersByProject.js/loadParameters', 3, 'projectID: ' + projectID  ,trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'parameter/project/' + projectID)
                if (!data.ok) {
                    throw Error('no parameter available')
                }
                parameters.value = await data.json()
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getParametersByProject.js/loadParameters', 3, err, trace)
        }
    }

    return { error, loadParameters }
}

export default getParametersByProject