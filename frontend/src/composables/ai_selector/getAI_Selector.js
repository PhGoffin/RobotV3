
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: 
 * @Last Modified time: 2024-04-12 13:13:43
 * @Description: Get an AI_Selector
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAI_Selector = (selectorID) => {

    const error = ref(null)

    const getTheAI_Selector = async (aiselector, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAI_Selector.js/getTheAI_Selector', 3, 'LOCAL Database get AI_Selector not implemented', trace)
            } else {
                consoleLog('getAI_Selector.js/getTheAI_Selector', 3, 'selectorID: ' + selectorID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aiselector/' + selectorID)
                if (!data.ok) {
                    throw Error('Error during the get AI_Selector')
                }
                aiselector.value = await data.json()
                consoleLog('getAI_Selector.js/getTheAI_Selector', 3, '--- get AISelector ---' + url + 'aiselector/' + selectorID, trace)
                consoleLog('getAI_Selector.js/getTheAI_Selector', 3, '--- Message: ' + aiselector.value.message, trace)
                consoleLog('getAI_Selector.js/getTheAI_Selector', 3, aiselector.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getAI_Selector.js/getTheAI_Selector', 3, error.value, trace)
        }
    }

    return { error, getTheAI_Selector }
}

export default getAI_Selector