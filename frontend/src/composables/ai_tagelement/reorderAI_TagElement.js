
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-20
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-20 17:09:16
 * @Description: Reorder AI_TagElements
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderAI_TagElement = (projectID) => {

    const error = ref(null)

    const reorderTheAI_TagElement = async (tagelement, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderAI_TagElement.js/reorderTheAI_TagElement', 3, 'LOCAL Database reorder AI_TagElements not implemented', trace)
            } else {
                consoleLog('reorderAI_TagElement.js/reorderTheAI_TagElement', 3, 'projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagelement/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID })
                })
                if (!data.ok) {
                    throw Error('Error during the reorder AI_TagElement')
                }
                tagelement.value = await data.json()
                consoleLog('reorderAI_TagElement.js/reorderTheAI_TagElement', 3, '--- reordertagelement ---' + url + 'aitagelement/reorder', trace)
                consoleLog('reorderAI_TagElement.js/reorderTheAI_TagElement', 3, '--- Message: ' + tagelement.value.message, trace)
                consoleLog('reorderAI_TagElement.js/reorderTheAI_TagElement', 3, tagelement.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderAI_TagElement.js/reorderTheAI_TagElement', 3, error.value, trace)
        }
    }

    return { error, reorderTheAI_TagElement }
}

export default reorderAI_TagElement