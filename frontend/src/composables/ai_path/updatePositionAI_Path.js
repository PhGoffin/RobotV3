
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: 
 * @Last Modified time: 2024-04-15 11:22:25
 * @Description: Update AI_Path position
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionAI_Path = (pathID, position) => {

    const error = ref(null)

    const updateTheAI_Path = async (aipath, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionAI_Path.js/updateTheAI_Path', 3, 'LOCAL Database update AI_Path position not implemented', trace)
            } else {
                consoleLog('updatePositionAI_Path.js/updateTheAI_Path', 3, 'pathID: ' + pathID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aipath/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'pathID': pathID })
                })
                if (!data.ok) {
                    throw Error('Error during the update AI_Path position')
                }
                aipath.value = await data.json()
                consoleLog('updatePositionAI_Path.js/updateTheAI_Path', 3, '--- updatePositionaipath ---' + url + 'aipath/position', trace)
                consoleLog('updatePositionAI_Path.js/updateTheAI_Path', 3, '--- Message: ' + aipath.value.message, trace)
                consoleLog('updatePositionAI_Path.js/updateTheAI_Path', 3, aipath.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionAI_Path.js/updateTheAI_Path', 3, error.value, trace)
        }
    }

    return { error, updateTheAI_Path }
}

export default updatePositionAI_Path