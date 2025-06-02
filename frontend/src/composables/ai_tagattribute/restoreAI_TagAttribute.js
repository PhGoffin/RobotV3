
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2025-06-02
 * @Last Modified by: Someone
 * @Last Modified time: 2025-06-02 10:07:46
 * @Description: Restore original AI_TagAttribute
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const restoreAI_TagAttribute = (tagattributeID) => {

    const error = ref(null)

    const restoreTheAI_TagAttribute = async (aitagattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('restoreAI_TagAttribute.js/restoreTheAI_TagAttribute', 3, 'LOCAL Database delete AI_TagAttribute not implemented', trace)
            } else {
                consoleLog('restoreAI_TagAttribute.js/restoreTheAI_TagAttribute', 3, 'tagattributeID: ' + tagattributeID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagattribute/restore/' + tagattributeID)
                if (!data.ok) {
                    throw Error('Error during the restore of an AI_TagAttribute')
                }
                aitagattribute.value = await data.json()
                consoleLog('restoreAI_TagAttribute.js/restoreTheAI_TagAttribute', 3, '--- restoreAttribute ---' + url + 'aitagattribute/restore/' + tagattributeID, trace)
                consoleLog('restoreAI_TagAttribute.js/restoreTheAI_TagAttribute', 3, '--- Message: ' + aitagattribute.value.message, trace)
                consoleLog('restoreAI_TagAttribute.js/restoreTheAI_TagAttribute', 3, aitagattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('restoreAI_TagAttribute.js/restoreTheAI_TagAttribute', 3, error.value, trace)
        }
    }

    return { error, restoreTheAI_TagAttribute }
}

export default restoreAI_TagAttribute