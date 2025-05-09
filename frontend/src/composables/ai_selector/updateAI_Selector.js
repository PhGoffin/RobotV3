
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: 
 * @Last Modified time: 2024-04-12 10:02:23
 * @Description: Update AI_Selector
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updateAI_Selector = (selectorID, name, endTag, comment, active) => {

    const error = ref(null)

    const updateTheAI_Selector = async (aiselector, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateAI_Selector.js/updateTheAI_Selector', 3, 'LOCAL Database update AI_Selector not implemented', trace)
            } else {
                consoleLog('updateAI_Selector.js/updateTheAI_Selector', 3, 'selectorID: ' + selectorID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aiselector/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'name': name, 'endTag': endTag, 'comment': comment, 'active': active, 'selectorID': selectorID })
                })
                if (!data.ok) {
                    throw Error('Error during the update AI_Selector')
                }
                aiselector.value = await data.json()
                consoleLog('updateAI_Selector.js/updateTheAI_Selector', 3, '--- updateAISelector ---' + url + 'aiselector/update', trace)
                consoleLog('updateAI_Selector.js/updateTheAI_Selector', 3, '--- Message: ' + aiselector.value.message, trace)
                consoleLog('updateAI_Selector.js/updateTheAI_Selector', 3, aiselector.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateAI_Selector.js/updateTheAI_Selector', 3, error.value, trace)
        }
    }

    return { error, updateTheAI_Selector }
}

export default updateAI_Selector