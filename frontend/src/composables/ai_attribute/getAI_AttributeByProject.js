
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-21 11:31:36
 * @Description: Get AI_Attributes by project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAI_AttributeByProject = (projectID) => {

    const error = ref(null)

    const getTheAI_Attribute = async (aiattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAI_AttributeByProject.js/getTheAI_Attribute', 3, 'LOCAL Database get AI_Attributes by project not implemented', trace)
            } else {
                consoleLog('getAI_AttributeByProject.js/getTheAI_Attribute', 3, 'projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aiattribute/project', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID })
                })
                if (!data.ok) {
                    throw Error('Error during the get AI_Attribute by project')
                }
                aiattribute.value = await data.json()
                consoleLog('getAI_AttributeByProject.js/getTheAI_Attribute', 3, '--- getaiattributeByProject ---' + url + 'aiattribute/project', trace)
                consoleLog('getAI_AttributeByProject.js/getTheAI_Attribute', 3, '--- Message: ' + aiattribute.value.message, trace)
                consoleLog('getAI_AttributeByProject.js/getTheAI_Attribute', 3, aiattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getAI_AttributeByProject.js/getTheAI_Attribute', 3, error.value, trace)
        }
    }

    return { error, getTheAI_Attribute }
}

export default getAI_AttributeByProject