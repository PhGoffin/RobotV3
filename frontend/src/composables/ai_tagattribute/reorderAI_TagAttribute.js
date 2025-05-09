
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-17
 * @Last Modified by: 
 * @Last Modified time: 2024-04-18 09:00:15
 * @Description: Reorder AI_TagAttributes
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderAI_TagAttribute = (projectID) => {

    const error = ref(null)

    const reorderTheAI_TagAttribute = async (tagattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderAI_TagAttribute.js/reorderTheAI_TagAttribute', 3, 'LOCAL Database reorder AI_TagAttributes not implemented', trace)
            } else {
                consoleLog('reorderAI_TagAttribute.js/reorderTheAI_TagAttribute', 3, 'projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagattribute/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID })
                })
                if (!data.ok) {
                    throw Error('Error during the reorder AI_TagAttribute')
                }
                tagattribute.value = await data.json()
                consoleLog('reorderAI_TagAttribute.js/reorderTheAI_TagAttribute', 3, '--- reordertagattribute ---' + url + 'aitagattribute/reorder', trace)
                consoleLog('reorderAI_TagAttribute.js/reorderTheAI_TagAttribute', 3, '--- Message: ' + tagattribute.value.message, trace)
                consoleLog('reorderAI_TagAttribute.js/reorderTheAI_TagAttribute', 3, tagattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderAI_TagAttribute.js/reorderTheAI_TagAttribute', 3, error.value, trace)
        }
    }

    return { error, reorderTheAI_TagAttribute }
}

export default reorderAI_TagAttribute