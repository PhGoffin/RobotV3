
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-21
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-21 14:47:35
 * @Description: Delete AI_TagAttribute by ai_tagelement
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteByTagElement = (projectID, tagelementID) => {

    const error = ref(null)

    const deleteTheAI_TagAttribute = async (aitagattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteByTagElement.js/deleteTheAI_TagAttribute', 3, 'LOCAL Database delete All AI_TagAttribute not implemented', trace)
            } else {
                consoleLog('deleteByTagElement.js/deleteTheAI_TagAttribute', 3, 'projectID: ' + projectID + 'tagelementID: ' + tagelementID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagattribute/deletebytagelement', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'tagelementID': tagelementID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of an AI_TagAttribute')
                }
                aitagattribute.value = await data.json()
                consoleLog('deleteByTagElement.js/deleteTheAI_TagAttribute', 3, '--- deleteAttribute ---' + url + 'aitagattribute/deletebytagelement' , trace)
                consoleLog('deleteByTagElement.js/deleteTheAI_TagAttribute', 3, '--- Message: ' + aitagattribute.value.message, trace)
                consoleLog('deleteByTagElement.js/deleteTheAI_TagAttribute', 3, aitagattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteByTagElement.js/deleteTheAI_TagAttribute', 3, error.value, trace)
        }
    }

    return { error, deleteTheAI_TagAttribute }
}

export default deleteByTagElement