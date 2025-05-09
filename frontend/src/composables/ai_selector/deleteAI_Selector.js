
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: 
 * @Last Modified time: 2024-04-12 13:59:17
 * @Description: Delete an AI_Selector
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteAI_Selector = (selectorID) => {

    const error = ref(null)

    const deleteTheAI_Selector = async (aiselector, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteAI_Selector.js/deleteTheAI_Selector', 3, 'LOCAL Database delete AI_Selector not implemented', trace)
            } else {
                consoleLog('deleteAI_Selector.js/deleteTheAI_Selector', 3, 'selectorID: ' + selectorID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aiselector/delete/' + selectorID)
                if (!data.ok) {
                    throw Error('Error during the delete of an AI_Selector')
                }
                aiselector.value = await data.json()
                consoleLog('deleteAI_Selector.js/deleteTheAI_Selector', 3, '--- deleteFunction ---' + url + 'aiselector/delete/' + selectorID, trace)
                consoleLog('deleteAI_Selector.js/deleteTheAI_Selector', 3, '--- Message: ' + aiselector.value.message, trace)
                consoleLog('deleteAI_Selector.js/deleteTheAI_Selector', 3, aiselector.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteAI_Selector.js/deleteTheAI_Selector', 3, error.value, trace)
        }
    }

    return { error, deleteTheAI_Selector }
}

export default deleteAI_Selector