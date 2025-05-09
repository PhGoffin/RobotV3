
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: 
 * @Last Modified time: 2024-04-12 09:59:06
 * @Description: Reorder AI_Selectors
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderAI_Selector = (projectID) => {

    const error = ref(null)

    const reorderTheAI_Selector = async (aiselector, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderAI_Selector.js/reorderTheAI_Selector', 3, 'LOCAL Database reorder AI_Selectors not implemented', trace)
            } else {
                consoleLog('reorderAI_Selector.js/reorderTheAI_Selector', 3, 'projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aiselector/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID })
                })
                if (!data.ok) {
                    throw Error('Error during the reorder AI_Selector')
                }
                aiselector.value = await data.json()
                consoleLog('reorderAI_Selector.js/reorderTheAI_Selector', 3, '--- reorderAISelector ---' + url + 'aiselector/reorder', trace)
                consoleLog('reorderAI_Selector.js/reorderTheAI_Selector', 3, '--- Message: ' + aiselector.value.message, trace)
                consoleLog('reorderAI_Selector.js/reorderTheAI_Selector', 3, aiselector.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderAI_Selector.js/reorderTheAI_Selector', 3, error.value, trace)
        }
    }

    return { error, reorderTheAI_Selector }
}

export default reorderAI_Selector