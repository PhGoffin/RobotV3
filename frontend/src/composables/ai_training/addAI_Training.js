
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-18
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-18 13:25:02
 * @Description: Add a new AI_Training
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addAI_Training = (projectID, selectorID, criteria, position, active, userName, today) => {

    const error = ref(null)

    const addNewAI_Training = async (aitraining, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addAI_Training.js/addNewAI_Training', 3, 'LOCAL Database Add Training not implemented', trace)
            } else {
                consoleLog('addAI_Training.js/addNewAI_Training', 3, 'userName: ' + userName + ', position: ' + position, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitraining/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'selectorID': selectorID, 'criteria': criteria, 'position': position, 'active': active, 'createdby': userName, 'created': today })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new AI_Training')
                }
                aitraining.value = await data.json()
                consoleLog('addAI_Training.js/addNewAI_Training', 3, '--- AI_Training ---' + url + 'aitraining/create', trace)
                consoleLog('addAI_Training.js/addNewAI_Training', 3, '--- Message: ' + aitraining.value.message, trace)
                consoleLog('addAI_Training.js/addNewAI_Training', 3, aitraining.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addAI_Training.js/addNewAI_Training', 3, error.value, trace)
        }
    }

    return { error, addNewAI_Training }
}

export default addAI_Training