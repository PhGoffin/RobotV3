
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: 
 * @Last Modified time: 2024-04-15 11:15:22
 * @Description: Copy an AI_Path
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyAI_Path = (pathID, position) => {

    const error = ref(null)

    const copyTheAI_Path = async (aipath, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyAI_Path.js/copyTheAI_Path', 3, 'LOCAL Database copy AI_Path not implemented', trace)
            } else {
                consoleLog('copyAI_Path.js/copyTheAI_Path', 3, 'position: ' + position + ', pathID: ' + pathID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aipath/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'pathID': pathID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of an AI_Path')
                }
                aipath.value = await data.json()
                consoleLog('copyAI_Path.js/copyTheAI_Path', 3, '--- copyFunction ---' + url + 'aipath/copy', trace)
                consoleLog('copyAI_Path.js/copyTheAI_Path', 3, '--- Message: ' + aipath.value.message, trace)
                consoleLog('copyAI_Path.js/copyTheAI_Path', 3, aipath.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyAI_Path.js/copyTheAI_Path', 3, error.value, trace)
        }
    }

    return { error, copyTheAI_Path }
}

export default copyAI_Path