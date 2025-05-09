
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: 
 * @Last Modified time: 2024-04-15 11:19:52
 * @Description: Reorder AI_Paths
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderAI_Path = (projectID) => {

    const error = ref(null)

    const reorderTheAI_Path = async (aipath, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderAI_Path.js/reorderTheAI_Path', 3, 'LOCAL Database reorder AI_Paths not implemented', trace)
            } else {
                consoleLog('reorderAI_Path.js/reorderTheAI_Path', 3, 'projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aipath/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID })
                })
                if (!data.ok) {
                    throw Error('Error during the reorder AI_Path')
                }
                aipath.value = await data.json()
                consoleLog('reorderAI_Path.js/reorderTheAI_Path', 3, '--- reorderaipath ---' + url + 'aipath/reorder', trace)
                consoleLog('reorderAI_Path.js/reorderTheAI_Path', 3, '--- Message: ' + aipath.value.message, trace)
                consoleLog('reorderAI_Path.js/reorderTheAI_Path', 3, aipath.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderAI_Path.js/reorderTheAI_Path', 3, error.value, trace)
        }
    }

    return { error, reorderTheAI_Path }
}

export default reorderAI_Path