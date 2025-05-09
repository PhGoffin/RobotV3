
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-19
 * @Last Modified by: 
 * @Last Modified time: 2024-04-19 08:27:48
 * @Description: Delete all AI_TagAttribute
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteAllAI_TagAttribute = (projectID, trainingID) => {

    const error = ref(null)

    const deleteTheAI_TagAttribute = async (aitagattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteAllAI_TagAttribute.js/deleteTheAI_TagAttribute', 3, 'LOCAL Database delete All AI_TagAttribute not implemented', trace)
            } else {
                consoleLog('deleteAllAI_TagAttribute.js/deleteTheAI_TagAttribute', 3, 'projectID: ' + projectID + 'trainingID: ' + trainingID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagattribute/fulldelete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'trainingID': trainingID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of an AI_TagAttribute')
                }
                aitagattribute.value = await data.json()
                consoleLog('deleteAllAI_TagAttribute.js/deleteTheAI_TagAttribute', 3, '--- deleteAttribute ---' + url + 'aitagattribute/fulldelete' , trace)
                consoleLog('deleteAllAI_TagAttribute.js/deleteTheAI_TagAttribute', 3, '--- Message: ' + aitagattribute.value.message, trace)
                consoleLog('deleteAllAI_TagAttribute.js/deleteTheAI_TagAttribute', 3, aitagattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteAllAI_TagAttribute.js/deleteTheAI_TagAttribute', 3, error.value, trace)
        }
    }

    return { error, deleteTheAI_TagAttribute }
}

export default deleteAllAI_TagAttribute