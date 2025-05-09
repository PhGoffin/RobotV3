
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-17
 * @Last Modified by: 
 * @Last Modified time: 2024-04-18 09:03:28
 * @Description: Update AI_TagAttribute position
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionAI_TagAttribute = (tagattributeID, position) => {

    const error = ref(null)

    const updateTheAI_TagAttribute = async (tagattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionAI_TagAttribute.js/updateTheAI_TagAttribute', 3, 'LOCAL Database update AI_TagAttribute position not implemented', trace)
            } else {
                consoleLog('updatePositionAI_TagAttribute.js/updateTheAI_TagAttribute', 3, 'tagattributeID: ' + tagattributeID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagattribute/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'tagattributeID': tagattributeID })
                })
                if (!data.ok) {
                    throw Error('Error during the update AI_TagAttribute position')
                }
                tagattribute.value = await data.json()
                consoleLog('updatePositionAI_TagAttribute.js/updateTheAI_TagAttribute', 3, '--- updatePositiontagattribute ---' + url + 'aitagattribute/position', trace)
                consoleLog('updatePositionAI_TagAttribute.js/updateTheAI_TagAttribute', 3, '--- Message: ' + tagattribute.value.message, trace)
                consoleLog('updatePositionAI_TagAttribute.js/updateTheAI_TagAttribute', 3, tagattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionAI_TagAttribute.js/updateTheAI_TagAttribute', 3, error.value, trace)
        }
    }

    return { error, updateTheAI_TagAttribute }
}

export default updatePositionAI_TagAttribute