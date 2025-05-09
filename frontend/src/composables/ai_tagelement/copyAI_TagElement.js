
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-20
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-20 17:04:30
 * @Description: Copy an AI_TageElement
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyAI_tagelement = (tagelementID, position) => {

    const error = ref(null)

    const copyTheAI_tagelement = async (tagelement, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyAI_tagelement.js/copyTheAI_tagelement', 3, 'LOCAL Database copy AI_TageElement not implemented', trace)
            } else {
                consoleLog('copyAI_tagelement.js/copyTheAI_tagelement', 3, 'position: ' + position + ', tagelementID: ' + tagelementID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagelement/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'tagelementID': tagelementID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of an AI_TageElement')
                }
                tagelement.value = await data.json()
                consoleLog('copyAI_tagelement.js/copyTheAI_tagelement', 3, '--- copyFunction ---' + url + 'aitagelement/copy', trace)
                consoleLog('copyAI_tagelement.js/copyTheAI_tagelement', 3, '--- Message: ' + tagelement.value.message, trace)
                consoleLog('copyAI_tagelement.js/copyTheAI_tagelement', 3, tagelement.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyAI_tagelement.js/copyTheAI_tagelement', 3, error.value, trace)
        }
    }

    return { error, copyTheAI_tagelement }
}

export default copyAI_tagelement