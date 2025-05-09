
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-18
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-18 13:09:50
 * @Description: Reorder AI_Trainings
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderAI_Training = (projectID) => {

    const error = ref(null)

    const reorderTheAI_Training = async (aitraining, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderAI_Training.js/reorderTheAI_Training', 3, 'LOCAL Database reorder AI_Trainings not implemented', trace)
            } else {
                consoleLog('reorderAI_Training.js/reorderTheAI_Training', 3, 'projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitraining/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID })
                })
                if (!data.ok) {
                    throw Error('Error during the reorder AI_Training')
                }
                aitraining.value = await data.json()
                consoleLog('reorderAI_Training.js/reorderTheAI_Training', 3, '--- reorderaitraining ---' + url + 'aitraining/reorder', trace)
                consoleLog('reorderAI_Training.js/reorderTheAI_Training', 3, '--- Message: ' + aitraining.value.message, trace)
                consoleLog('reorderAI_Training.js/reorderTheAI_Training', 3, aitraining.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderAI_Training.js/reorderTheAI_Training', 3, error.value, trace)
        }
    }

    return { error, reorderTheAI_Training }
}

export default reorderAI_Training