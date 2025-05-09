
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: 
 * @Last Modified time: 2024-04-17 15:43:29
 * @Description: Copy an AI_Attribute
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyAI_Attribute = (attributeID, position) => {

    const error = ref(null)

    const copyTheAI_Attribute = async (aiattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyAI_Attribute.js/copyTheAI_Attribute', 3, 'LOCAL Database copy AI_Attribute not implemented', trace)
            } else {
                consoleLog('copyAI_Attribute.js/copyTheAI_Attribute', 3, 'position: ' + position + ', attributeID: ' + attributeID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aiattribute/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'attributeID': attributeID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of an AI_Attribute')
                }
                aiattribute.value = await data.json()
                consoleLog('copyAI_Attribute.js/copyTheAI_Attribute', 3, '--- copyFunction ---' + url + 'aiattribute/copy', trace)
                consoleLog('copyAI_Attribute.js/copyTheAI_Attribute', 3, '--- Message: ' + aiattribute.value.message, trace)
                consoleLog('copyAI_Attribute.js/copyTheAI_Attribute', 3, aiattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyAI_Attribute.js/copyTheAI_Attribute', 3, error.value, trace)
        }
    }

    return { error, copyTheAI_Attribute }
}

export default copyAI_Attribute