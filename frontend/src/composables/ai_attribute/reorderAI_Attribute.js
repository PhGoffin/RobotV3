
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: 
 * @Last Modified time: 2024-04-15 12:57:30
 * @Description: Reorder AI_Attributes
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderAI_Attribute = (projectID) => {

    const error = ref(null)

    const reorderTheAI_Attribute = async (aiattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderAI_Attribute.js/reorderTheAI_Attribute', 3, 'LOCAL Database reorder AI_Attributes not implemented', trace)
            } else {
                consoleLog('reorderAI_Attribute.js/reorderTheAI_Attribute', 3, 'projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aiattribute/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID })
                })
                if (!data.ok) {
                    throw Error('Error during the reorder AI_Attribute')
                }
                aiattribute.value = await data.json()
                consoleLog('reorderAI_Attribute.js/reorderTheAI_Attribute', 3, '--- reorderaiattribute ---' + url + 'aiattribute/reorder', trace)
                consoleLog('reorderAI_Attribute.js/reorderTheAI_Attribute', 3, '--- Message: ' + aiattribute.value.message, trace)
                consoleLog('reorderAI_Attribute.js/reorderTheAI_Attribute', 3, aiattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderAI_Attribute.js/reorderTheAI_Attribute', 3, error.value, trace)
        }
    }

    return { error, reorderTheAI_Attribute }
}

export default reorderAI_Attribute