
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-20
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-20 17:06:15
 * @Description: Delete all AI_TagElement
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteAllAI_TagElement = (projectID, trainingID) => {

    const error = ref(null)

    const deleteTheAI_TagElement = async (aitagelement, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteAllAI_TagElement.js/deleteTheAI_TagElement', 3, 'LOCAL Database delete All AI_TagElement not implemented', trace)
            } else {
                consoleLog('deleteAllAI_TagElement.js/deleteTheAI_TagElement', 3, 'projectID: ' + projectID + 'trainingID: ' + trainingID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagelement/fulldelete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'trainingID': trainingID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of an AI_TagElement')
                }
                aitagelement.value = await data.json()
                consoleLog('deleteAllAI_TagElement.js/deleteTheAI_TagElement', 3, '--- deleteAttribute ---' + url + 'aitagelement/fulldelete' , trace)
                consoleLog('deleteAllAI_TagElement.js/deleteTheAI_TagElement', 3, '--- Message: ' + aitagelement.value.message, trace)
                consoleLog('deleteAllAI_TagElement.js/deleteTheAI_TagElement', 3, aitagelement.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteAllAI_TagElement.js/deleteTheAI_TagElement', 3, error.value, trace)
        }
    }

    return { error, deleteTheAI_TagElement }
}

export default deleteAllAI_TagElement