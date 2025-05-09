
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: 
 * @Last Modified time: 2024-04-12 10:03:37
 * @Description: Update AI_Selector position
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionAI_Selector = (selectorID, position) => {

    const error = ref(null)

    const updateTheAI_Selector = async (aiselector, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionAI_Selector.js/updateTheAI_Selector', 3, 'LOCAL Database update AI_Selector position not implemented', trace)
            } else {
                consoleLog('updatePositionAI_Selector.js/updateTheAI_Selector', 3, 'selectorID: ' + selectorID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aiselector/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'selectorID': selectorID })
                })
                if (!data.ok) {
                    throw Error('Error during the update AI_Selector position')
                }
                aiselector.value = await data.json()
                consoleLog('updatePositionAI_Selector.js/updateTheAI_Selector', 3, '--- updatePositionAISelector ---' + url + 'aiselector/position', trace)
                consoleLog('updatePositionAI_Selector.js/updateTheAI_Selector', 3, '--- Message: ' + aiselector.value.message, trace)
                consoleLog('updatePositionAI_Selector.js/updateTheAI_Selector', 3, aiselector.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionAI_Selector.js/updateTheAI_Selector', 3, error.value, trace)
        }
    }

    return { error, updateTheAI_Selector }
}

export default updatePositionAI_Selector