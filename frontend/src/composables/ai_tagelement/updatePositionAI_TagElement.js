
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-20
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-20 17:12:28
 * @Description: Update AI_TagElement position
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionAI_TagElement = (tagelementID, position) => {

    const error = ref(null)

    const updateTheAI_TagElement = async (tagelement, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionAI_TagElement.js/updateTheAI_TagElement', 3, 'LOCAL Database update AI_TagElement position not implemented', trace)
            } else {
                consoleLog('updatePositionAI_TagElement.js/updateTheAI_TagElement', 3, 'tagelementID: ' + tagelementID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagelement/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'tagelementID': tagelementID })
                })
                if (!data.ok) {
                    throw Error('Error during the update AI_TagElement position')
                }
                tagelement.value = await data.json()
                consoleLog('updatePositionAI_TagElement.js/updateTheAI_TagElement', 3, '--- updatePositiontagelement ---' + url + 'aitagelement/position', trace)
                consoleLog('updatePositionAI_TagElement.js/updateTheAI_TagElement', 3, '--- Message: ' + tagelement.value.message, trace)
                consoleLog('updatePositionAI_TagElement.js/updateTheAI_TagElement', 3, tagelement.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionAI_TagElement.js/updateTheAI_TagElement', 3, error.value, trace)
        }
    }

    return { error, updateTheAI_TagElement }
}

export default updatePositionAI_TagElement