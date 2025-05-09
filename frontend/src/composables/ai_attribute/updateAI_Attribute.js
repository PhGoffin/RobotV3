
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: 
 * @Last Modified time: 2024-04-15 12:59:32
 * @Description: Update AI_Attribute
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updateAI_Attribute = (attributeID, name, first, intermediate, last, comment, active) => {

    const error = ref(null)

    const updateTheAI_Attribute = async (aiattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateAI_Attribute.js/updateTheAI_Attribute', 3, 'LOCAL Database update AI_Attribute not implemented', trace)
            } else {
                consoleLog('updateAI_Attribute.js/updateTheAI_Attribute', 3, 'attributeID: ' + attributeID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aiattribute/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'name': name, 'first': first, 'intermediate': intermediate, 'last': last, 'comment': comment, 'active': active, 'attributeID': attributeID })
                })
                if (!data.ok) {
                    throw Error('Error during the update AI_Attribute')
                }
                aiattribute.value = await data.json()
                consoleLog('updateAI_Attribute.js/updateTheAI_Attribute', 3, '--- updateaiattribute ---' + url + 'aiattribute/update', trace)
                consoleLog('updateAI_Attribute.js/updateTheAI_Attribute', 3, '--- Message: ' + aiattribute.value.message, trace)
                consoleLog('updateAI_Attribute.js/updateTheAI_Attribute', 3, aiattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateAI_Attribute.js/updateTheAI_Attribute', 3, error.value, trace)
        }
    }

    return { error, updateTheAI_Attribute }
}

export default updateAI_Attribute