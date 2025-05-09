
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-25
 * @Last Modified by: 
 * @Last Modified time: 2024-04-25 08:36:35
 * @Description: Get AI_TagElements by pattern
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAI_TagElementByPattern = (tagelementID) => {

    const error = ref(null)

    const getTheAI_TagElement = async (tagelement, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAI_TagElementByPattern.js/getTheAI_TagElement', 3, 'LOCAL Database get AI_TagElements by pattern not implemented', trace)
            } else {
                consoleLog('getAI_TagElementByPattern.js/getTheAI_TagElement', 3, 'tagelementID: ' + tagelementID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagelement/pattern', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'tagelementID': tagelementID })
                })
                if (!data.ok) {
                    throw Error('Error during the get AI_TagElement by pattern')
                }
                tagelement.value = await data.json()
                consoleLog('getAI_TagElementByPattern.js/getTheAI_TagElement', 3, '--- gettagelementByPattern ---' + url + 'aitagelement/pattern', trace)
                consoleLog('getAI_TagElementByPattern.js/getTheAI_TagElement', 3, tagelement.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getAI_TagElementByPattern.js/getTheAI_TagElement', 3, error.value, trace)
        }
    }

    return { error, getTheAI_TagElement }
}

export default getAI_TagElementByPattern