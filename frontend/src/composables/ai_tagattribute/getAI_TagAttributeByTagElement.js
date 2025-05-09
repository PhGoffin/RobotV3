
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-21
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-21 08:58:54
 * @Description: Get AI_TagAttributes by tag element
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAI_TagAttributeByTagElement = (projectID, tagelementID) => {

    const error = ref(null)

    const getTheAI_TagAttribute = async (tagattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAI_TagAttributeByTagElement.js/getTheAI_TagAttribute', 3, 'LOCAL Database get AI_TagAttributes by training not implemented', trace)
            } else {
                consoleLog('getAI_TagAttributeByTagElement.js/getTheAI_TagAttribute', 3, 'projectID: ' + projectID + 'tagelementID: ' + tagelementID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagattribute/tagelement', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'tagelementID': tagelementID })
                })
                if (!data.ok) {
                    throw Error('Error during the get AI_TagAttribute by training')
                }
                tagattribute.value = await data.json()
                consoleLog('getAI_TagAttributeByTagElement.js/getTheAI_TagAttribute', 3, '--- gettagattributeByTraining ---' + url + 'aitagattribute/tagelement', trace)
                consoleLog('getAI_TagAttributeByTagElement.js/getTheAI_TagAttribute', 3, '--- Message: ' + tagattribute.value.message, trace)
                consoleLog('getAI_TagAttributeByTagElement.js/getTheAI_TagAttribute', 3, tagattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getAI_TagAttributeByTagElement.js/getTheAI_TagAttribute', 3, error.value, trace)
        }
    }

    return { error, getTheAI_TagAttribute }
}

export default getAI_TagAttributeByTagElement