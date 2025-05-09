
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-20
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-20 17:03:40
 * @Description: Add a new AI_TagElement
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addAI_TagElement = (projectID, trainingID, pathID, selectorID, position, active) => {

    const error = ref(null)

    const addNewAI_TagElement = async (tagelement, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addAI_TagElement.js/addNewAI_TagElement', 3, 'LOCAL Database Add tag element not implemented', trace)
            } else {
                consoleLog('addAI_TagElement.js/addNewAI_TagElement', 3, 'trainingID: ' + trainingID + ', position: ' + position, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagelement/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'trainingID': trainingID, 'pathID': pathID, 'selectorID': selectorID, 'position': position, 'active': active })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new AI_TagElement')
                }
                tagelement.value = await data.json()
                consoleLog('addAI_TagElement.js/addNewAI_TagElement', 3, '--- AttributeTagElement ---' + url + 'aitagelement/create', trace)
                consoleLog('addAI_TagElement.js/addNewAI_TagElement', 3, '--- Message: ' + tagelement.value.message, trace)
                consoleLog('addAI_TagElement.js/addNewAI_TagElement', 3, tagelement.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addAI_TagElement.js/addNewAI_TagElement', 3, error.value, trace)
        }
    }

    return { error, addNewAI_TagElement }
}

export default addAI_TagElement