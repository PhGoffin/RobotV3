
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: 
 * @Last Modified time: 2024-04-15 11:17:26
 * @Description: Get an AI_Path
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAI_Path = (pathID) => {

    const error = ref(null)

    const getTheAI_Path = async (aipath, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAI_Path.js/getTheAI_Path', 3, 'LOCAL Database get AI_Path not implemented', trace)
            } else {
                consoleLog('getAI_Path.js/getTheAI_Path', 3, 'pathID: ' + pathID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aipath/' + pathID)
                if (!data.ok) {
                    throw Error('Error during the get AI_Path')
                }
                aipath.value = await data.json()
                consoleLog('getAI_Path.js/getTheAI_Path', 3, '--- get aipath ---' + url + 'aipath/' + pathID, trace)
                consoleLog('getAI_Path.js/getTheAI_Path', 3, '--- Message: ' + aipath.value.message, trace)
                consoleLog('getAI_Path.js/getTheAI_Path', 3, aipath.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getAI_Path.js/getTheAI_Path', 3, error.value, trace)
        }
    }

    return { error, getTheAI_Path }
}

export default getAI_Path