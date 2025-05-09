
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: 
 * @Last Modified time: 2024-04-15 13:39:05
 * @Description: Add a new AI_Attribute
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addAI_Attribute = (projectID, name, first, intermediate, last, comment, position, active) => {

    const error = ref(null)

    const addNewAI_Attribute = async (aiattribute, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addAI_Attribute.js/addNewAI_Attribute', 3, 'LOCAL Database Add Path not implemented', trace)
            } else {
                consoleLog('addAI_Attribute.js/addNewAI_Attribute', 3, 'name: ' + name + ', comment: ' + comment + ', position: ' + position, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aiattribute/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'name': name, 'first': first, 'intermediate': intermediate, 'last': last, 'comment': comment, 'position': position, 'active': active })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new AI_Attribute')
                }
                aiattribute.value = await data.json()
                consoleLog('addAI_Attribute.js/addNewAI_Attribute', 3, '--- AttributeFunction ---' + url + 'aiattribute/create', trace)
                consoleLog('addAI_Attribute.js/addNewAI_Attribute', 3, '--- Message: ' + aiattribute.value.message, trace)
                consoleLog('addAI_Attribute.js/addNewAI_Attribute', 3, aiattribute.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addAI_Attribute.js/addNewAI_Attribute', 3, error.value, trace)
        }
    }

    return { error, addNewAI_Attribute }
}

export default addAI_Attribute