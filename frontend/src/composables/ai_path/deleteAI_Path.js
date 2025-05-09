
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: 
 * @Last Modified time: 2024-04-15 11:16:20
 * @Description: Delete an AI_Path
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteAI_Path = (pathID) => {

    const error = ref(null)

    const deleteTheAI_Path = async (aipath, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteAI_Path.js/deleteTheAI_Path', 3, 'LOCAL Database delete AI_Path not implemented', trace)
            } else {
                consoleLog('deleteAI_Path.js/deleteTheAI_Path', 3, 'pathID: ' + pathID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aipath/delete/' + pathID)
                if (!data.ok) {
                    throw Error('Error during the delete of an AI_Path')
                }
                aipath.value = await data.json()
                consoleLog('deleteAI_Path.js/deleteTheAI_Path', 3, '--- deleteFunction ---' + url + 'aipath/delete/' + pathID, trace)
                consoleLog('deleteAI_Path.js/deleteTheAI_Path', 3, '--- Message: ' + aipath.value.message, trace)
                consoleLog('deleteAI_Path.js/deleteTheAI_Path', 3, aipath.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteAI_Path.js/deleteTheAI_Path', 3, error.value, trace)
        }
    }

    return { error, deleteTheAI_Path }
}

export default deleteAI_Path