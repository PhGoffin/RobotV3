
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: 
 * @Last Modified time: 2024-04-12 11:05:04
 * @Description: Copy an AI_Selector
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyAI_Selector = (selectorID, position) => {

    const error = ref(null)

    const copyTheAI_Selector = async (aiselector, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyAI_Selector.js/copyTheAI_Selector', 3, 'LOCAL Database copy AI_Selector not implemented', trace)
            } else {
                consoleLog('copyAI_Selector.js/copyTheAI_Selector', 3, 'position: ' + position + ', selectorID: ' + selectorID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aiselector/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'selectorID': selectorID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of an AI_Selector')
                }
                aiselector.value = await data.json()
                consoleLog('copyAI_Selector.js/copyTheAI_Selector', 3, '--- copyFunction ---' + url + 'aiselector/copy', trace)
                consoleLog('copyAI_Selector.js/copyTheAI_Selector', 3, '--- Message: ' + aiselector.value.message, trace)
                consoleLog('copyAI_Selector.js/copyTheAI_Selector', 3, aiselector.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyAI_Selector.js/copyTheAI_Selector', 3, error.value, trace)
        }
    }

    return { error, copyTheAI_Selector }
}

export default copyAI_Selector