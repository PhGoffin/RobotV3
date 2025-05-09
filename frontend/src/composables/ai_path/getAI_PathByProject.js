
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-21 11:31:23
 * @Description: Get AI_Paths by project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAI_PathByProject = (projectID) => {

    const error = ref(null)

    const getTheAI_Path = async (aipath, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAI_PathByProject.js/getTheAI_Path', 3, 'LOCAL Database get AI_Paths by project not implemented', trace)
            } else {
                consoleLog('getAI_PathByProject.js/getTheAI_Path', 3, 'projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aipath/project', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID })
                })                
                if (!data.ok) {
                    throw Error('Error during the get AI_Path by project')
                }
                aipath.value = await data.json()
                consoleLog('getAI_PathByProject.js/getTheAI_Path', 3, '--- getaipathByProject ---' + url + 'aipath/project', trace)
                consoleLog('getAI_PathByProject.js/getTheAI_Path', 3, '--- Message: ' + aipath.value.message, trace)
                consoleLog('getAI_PathByProject.js/getTheAI_Path', 3, aipath.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getAI_PathByProject.js/getTheAI_Path', 3, error.value, trace)
        }
    }

    return { error, getTheAI_Path }
}

export default getAI_PathByProject