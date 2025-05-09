
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: 
 * @Last Modified time: 2024-07-29 09:38:20
 * @Description: Update AI_Path
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updateAI_Path = (pathID, fullPath, pathCondition, weight, comment, active) => {

    const error = ref(null)

    const updateTheAI_Path = async (aipath, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateAI_Path.js/updateTheAI_Path', 3, 'LOCAL Database update AI_Path not implemented', trace)
            } else {
                consoleLog('updateAI_Path.js/updateTheAI_Path', 3, 'pathID: ' + pathID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aipath/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'fullPath': fullPath, 'pathCondition': pathCondition, 'weight': weight, 'comment': comment, 'active': active, 'pathID': pathID })
                })
                if (!data.ok) {
                    throw Error('Error during the update AI_Path')
                }
                aipath.value = await data.json()
                consoleLog('updateAI_Path.js/updateTheAI_Path', 3, '--- updateaipath ---' + url + 'aipath/update', trace)
                consoleLog('updateAI_Path.js/updateTheAI_Path', 3, '--- Message: ' + aipath.value.message, trace)
                consoleLog('updateAI_Path.js/updateTheAI_Path', 3, aipath.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateAI_Path.js/updateTheAI_Path', 3, error.value, trace)
        }
    }

    return { error, updateTheAI_Path }
}

export default updateAI_Path