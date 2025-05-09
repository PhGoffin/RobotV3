
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-17
 * @Last Modified by: 
 * @Last Modified time: 2024-04-18 09:00:48
 * @Description: Copy an AI_Attribute
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyAI_TagAttribute = (tagattributeID, position) => {

    const error = ref(null)

    const copyTheAI_TagAttribute = async (tagattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyAI_TagAttribute.js/copyTheAI_TagAttribute', 3, 'LOCAL Database copy AI_Attribute not implemented', trace)
            } else {
                consoleLog('copyAI_TagAttribute.js/copyTheAI_TagAttribute', 3, 'position: ' + position + ', tagattributeID: ' + tagattributeID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagattribute/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'tagattributeID': tagattributeID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of an AI_Attribute')
                }
                tagattribute.value = await data.json()
                consoleLog('copyAI_TagAttribute.js/copyTheAI_TagAttribute', 3, '--- copyFunction ---' + url + 'aitagattribute/copy', trace)
                consoleLog('copyAI_TagAttribute.js/copyTheAI_TagAttribute', 3, '--- Message: ' + tagattribute.value.message, trace)
                consoleLog('copyAI_TagAttribute.js/copyTheAI_TagAttribute', 3, tagattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyAI_TagAttribute.js/copyTheAI_TagAttribute', 3, error.value, trace)
        }
    }

    return { error, copyTheAI_TagAttribute }
}

export default copyAI_TagAttribute