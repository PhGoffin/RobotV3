
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-17
 * @Last Modified by: 
 * @Last Modified time: 2024-04-18 09:02:27
 * @Description: Get AI_TagAttributes by project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAI_TagAttributeByProject = (projectID) => {

    const error = ref(null)

    const getTheAI_TagAttribute = async (tagattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAI_TagAttributeByProject.js/getTheAI_TagAttribute', 3, 'LOCAL Database get AI_TagAttributes by project not implemented', trace)
            } else {
                consoleLog('getAI_TagAttributeByProject.js/getTheAI_TagAttribute', 3, 'projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagattribute/project/' + projectID)
                if (!data.ok) {
                    throw Error('Error during the get AI_TagAttribute by project')
                }
                tagattribute.value = await data.json()
                consoleLog('getAI_TagAttributeByProject.js/getTheAI_TagAttribute', 3, '--- gettagattributeByProject ---' + url + 'aitagattribute/project/' + projectID, trace)
                consoleLog('getAI_TagAttributeByProject.js/getTheAI_TagAttribute', 3, '--- Message: ' + tagattribute.value.message, trace)
                consoleLog('getAI_TagAttributeByProject.js/getTheAI_TagAttribute', 3, tagattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getAI_TagAttributeByProject.js/getTheAI_TagAttribute', 3, error.value, trace)
        }
    }

    return { error, getTheAI_TagAttribute }
}

export default getAI_TagAttributeByProject