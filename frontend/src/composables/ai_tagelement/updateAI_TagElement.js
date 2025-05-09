
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-20
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-20 17:11:30
 * @Description: Update AI_TagElement
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';
// level, pathID, name, value, active
const updateAI_TagElement = (tagelementID, pathID, selectorID, active) => {

    const error = ref(null)

    const updateTheAI_TagElement = async (tagelement, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateAI_TagElement.js/updateTheAI_TagElement', 3, 'LOCAL Database update AI_TagElement not implemented', trace)
            } else {
                consoleLog('updateAI_TagElement.js/updateTheAI_TagElement', 3, 'tagelementID: ' + tagelementID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagelement/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'pathID': pathID, 'selectorID': selectorID, 'value': value, 'active': active, 'tagelementID': tagelementID })
                })
                if (!data.ok) {
                    throw Error('Error during the update AI_TagElement')
                }
                tagelement.value = await data.json()
                consoleLog('updateAI_TagElement.js/updateTheAI_TagElement', 3, '--- updatetagelement ---' + url + 'aitagelement/update', trace)
                consoleLog('updateAI_TagElement.js/updateTheAI_TagElement', 3, '--- Message: ' + tagelement.value.message, trace)
                consoleLog('updateAI_TagElement.js/updateTheAI_TagElement', 3, tagelement.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateAI_TagElement.js/updateTheAI_TagElement', 3, error.value, trace)
        }
    }

    return { error, updateTheAI_TagElement }
}

export default updateAI_TagElement