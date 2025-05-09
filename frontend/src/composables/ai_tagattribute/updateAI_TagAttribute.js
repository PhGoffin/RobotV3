
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-17
 * @Last Modified by: 
 * @Last Modified time: 2024-04-18 10:21:32
 * @Description: Update AI_TagAttribute
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';
// level, pathID, name, value, active
const updateAI_TagAttribute = (tagattributeID, level, pathID, pathValue, attributeID, value, active) => {

    const error = ref(null)

    const updateTheAI_TagAttribute = async (tagattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateAI_TagAttribute.js/updateTheAI_TagAttribute', 3, 'LOCAL Database update AI_TagAttribute not implemented', trace)
            } else {
                consoleLog('updateAI_TagAttribute.js/updateTheAI_TagAttribute', 3, 'tagattributeID: ' + tagattributeID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagattribute/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'level': level, 'pathID': pathID, 'pathValue': pathValue, 'attributeID': attributeID, 'value': value, 'active': active, 'tagattributeID': tagattributeID })
                })
                if (!data.ok) {
                    throw Error('Error during the update AI_TagAttribute')
                }
                tagattribute.value = await data.json()
                consoleLog('updateAI_TagAttribute.js/updateTheAI_TagAttribute', 3, '--- updatetagattribute ---' + url + 'aitagattribute/update', trace)
                consoleLog('updateAI_TagAttribute.js/updateTheAI_TagAttribute', 3, '--- Message: ' + tagattribute.value.message, trace)
                consoleLog('updateAI_TagAttribute.js/updateTheAI_TagAttribute', 3, tagattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateAI_TagAttribute.js/updateTheAI_TagAttribute', 3, error.value, trace)
        }
    }

    return { error, updateTheAI_TagAttribute }
}

export default updateAI_TagAttribute