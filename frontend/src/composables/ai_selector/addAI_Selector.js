
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: 
 * @Last Modified time: 2024-04-12 09:40:40
 * @Description: Add a new AI_Selector
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addAI_Selector = (projectID, name, endTag, comment, position, active) => {

    const error = ref(null)

    const addNewAI_Selector = async (aiselector, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addAI_Selector.js/addNewAI_Selector', 3, 'LOCAL Database Add Function not implemented', trace)
            } else {
                consoleLog('addAI_Selector.js/addNewAI_Selector', 3, 'name: ' + name + ', comment: ' + comment + ', position: ' + position, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aiselector/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'name':name, 'endTag': endTag, 'comment': comment, 'position': position, 'active': active })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new AI_Selector')
                }
                aiselector.value = await data.json()
                consoleLog('addAI_Selector.js/addNewAI_Selector', 3, '--- createFunction ---' + url + 'aiselector/create', trace)
                consoleLog('addAI_Selector.js/addNewAI_Selector', 3, '--- Message: ' + aiselector.value.message, trace)
                consoleLog('addAI_Selector.js/addNewAI_Selector', 3, aiselector.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addAI_Selector.js/addNewAI_Selector', 3, error.value, trace)
        }
    }

    return { error, addNewAI_Selector }
}

export default addAI_Selector