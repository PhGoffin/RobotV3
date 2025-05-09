
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: 
 * @Last Modified time: 2024-04-15 12:55:54
 * @Description: Get an AI_Attribute
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAI_Attribute = (attributeID) => {

    const error = ref(null)

    const getTheAI_Attribute = async (aiattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAI_Attribute.js/getTheAI_Attribute', 3, 'LOCAL Database get AI_Attribute not implemented', trace)
            } else {
                consoleLog('getAI_Attribute.js/getTheAI_Attribute', 3, 'attributeID: ' + attributeID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aiattribute/' + attributeID)
                if (!data.ok) {
                    throw Error('Error during the get AI_Attribute')
                }
                aiattribute.value = await data.json()
                consoleLog('getAI_Attribute.js/getTheAI_Attribute', 3, '--- get aiattribute ---' + url + 'aiattribute/' + attributeID, trace)
                consoleLog('getAI_Attribute.js/getTheAI_Attribute', 3, '--- Message: ' + aiattribute.value.message, trace)
                consoleLog('getAI_Attribute.js/getTheAI_Attribute', 3, aiattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getAI_Attribute.js/getTheAI_Attribute', 3, error.value, trace)
        }
    }

    return { error, getTheAI_Attribute }
}

export default getAI_Attribute