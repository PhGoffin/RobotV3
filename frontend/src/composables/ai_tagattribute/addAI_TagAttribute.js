
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-17
 * @Last Modified by: 
 * @Last Modified time: 2024-04-18 10:21:14
 * @Description: Add a new AI_TagAttribute
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addAI_TagAttribute = (projectID, level, pathID, pathValue, attributeID, value, position, active) => {

    const error = ref(null)

    const addNewAI_TagAttribute = async (tagattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addAI_TagAttribute.js/addNewAI_TagAttribute', 3, 'LOCAL Database Add tag attribute not implemented', trace)
            } else {
                consoleLog('addAI_TagAttribute.js/addNewAI_TagAttribute', 3, 'attributeID: ' + attributeID + ', position: ' + position, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagattribute/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'level': level, 'pathID': pathID, 'pathValue': pathValue, 'attributeID': attributeID, 'value': value, 'position': position, 'active': active })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new AI_TagAttribute')
                }
                tagattribute.value = await data.json()
                consoleLog('addAI_TagAttribute.js/addNewAI_TagAttribute', 3, '--- AttributeFunction ---' + url + 'aitagattribute/create', trace)
                consoleLog('addAI_TagAttribute.js/addNewAI_TagAttribute', 3, '--- Message: ' + tagattribute.value.message, trace)
                consoleLog('addAI_TagAttribute.js/addNewAI_TagAttribute', 3, tagattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addAI_TagAttribute.js/addNewAI_TagAttribute', 3, error.value, trace)
        }
    }

    return { error, addNewAI_TagAttribute }
}

export default addAI_TagAttribute