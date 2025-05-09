
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: 
 * @Last Modified time: 2024-04-15 13:00:17
 * @Description: Update AI_Attribute position
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionAI_Attribute = (attributeID, position) => {

    const error = ref(null)

    const updateTheAI_Attribute = async (aiattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionAI_Attribute.js/updateTheAI_Attribute', 3, 'LOCAL Database update AI_Attribute position not implemented', trace)
            } else {
                consoleLog('updatePositionAI_Attribute.js/updateTheAI_Attribute', 3, 'attributeID: ' + attributeID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aiattribute/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'attributeID': attributeID })
                })
                if (!data.ok) {
                    throw Error('Error during the update AI_Attribute position')
                }
                aiattribute.value = await data.json()
                consoleLog('updatePositionAI_Attribute.js/updateTheAI_Attribute', 3, '--- updatePositionaiattribute ---' + url + 'aiattribute/position', trace)
                consoleLog('updatePositionAI_Attribute.js/updateTheAI_Attribute', 3, '--- Message: ' + aiattribute.value.message, trace)
                consoleLog('updatePositionAI_Attribute.js/updateTheAI_Attribute', 3, aiattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionAI_Attribute.js/updateTheAI_Attribute', 3, error.value, trace)
        }
    }

    return { error, updateTheAI_Attribute }
}

export default updatePositionAI_Attribute