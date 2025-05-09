
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-17
 * @Last Modified by: 
 * @Last Modified time: 2024-04-18 08:58:25
 * @Description: Get an AI_TagAttribute
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAI_TagAttribute = (tagattributeID) => {

    const error = ref(null)

    const getTheAI_TagAttribute = async (tagattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAI_TagAttribute.js/getTheAI_TagAttribute', 3, 'LOCAL Database get AI_TagAttribute not implemented', trace)
            } else {
                consoleLog('getAI_TagAttribute.js/getTheAI_TagAttribute', 3, 'tagattributeID: ' + tagattributeID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagattribute/' + tagattributeID)
                if (!data.ok) {
                    throw Error('Error during the get AI_TagAttribute')
                }
                tagattribute.value = await data.json()
                consoleLog('getAI_TagAttribute.js/getTheAI_TagAttribute', 3, '--- get tagattribute ---' + url + 'aitagattribute/' + tagattributeID, trace)
                consoleLog('getAI_TagAttribute.js/getTheAI_TagAttribute', 3, '--- Message: ' + tagattribute.value.message, trace)
                consoleLog('getAI_TagAttribute.js/getTheAI_TagAttribute', 3, tagattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getAI_TagAttribute.js/getTheAI_TagAttribute', 3, error.value, trace)
        }
    }

    return { error, getTheAI_TagAttribute }
}

export default getAI_TagAttribute