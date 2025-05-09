
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-17
 * @Last Modified by: 
 * @Last Modified time: 2024-04-18 09:01:30
 * @Description: Delete an AI_TagAttribute
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteAI_TagAttribute = (tagattributeID) => {

    const error = ref(null)

    const deleteTheAI_TagAttribute = async (aitagattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteAI_TagAttribute.js/deleteTheAI_TagAttribute', 3, 'LOCAL Database delete AI_TagAttribute not implemented', trace)
            } else {
                consoleLog('deleteAI_TagAttribute.js/deleteTheAI_TagAttribute', 3, 'tagattributeID: ' + tagattributeID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagattribute/delete/' + tagattributeID)
                if (!data.ok) {
                    throw Error('Error during the delete of an AI_TagAttribute')
                }
                aitagattribute.value = await data.json()
                consoleLog('deleteAI_TagAttribute.js/deleteTheAI_TagAttribute', 3, '--- deleteAttribute ---' + url + 'aitagattribute/delete/' + tagattributeID, trace)
                consoleLog('deleteAI_TagAttribute.js/deleteTheAI_TagAttribute', 3, '--- Message: ' + aitagattribute.value.message, trace)
                consoleLog('deleteAI_TagAttribute.js/deleteTheAI_TagAttribute', 3, aitagattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteAI_TagAttribute.js/deleteTheAI_TagAttribute', 3, error.value, trace)
        }
    }

    return { error, deleteTheAI_TagAttribute }
}

export default deleteAI_TagAttribute