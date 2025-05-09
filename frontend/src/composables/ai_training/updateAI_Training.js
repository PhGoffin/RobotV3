
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-18
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-18 13:26:02
 * @Description: Update AI_Training
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updateAI_Training = (trainingID, selectorID, criteria, active, userName, today) => {

    const error = ref(null)

    const updateTheAI_Training = async (aitraining, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateAI_Training.js/updateTheAI_Training', 3, 'LOCAL Database update AI_Training not implemented', trace)
            } else {
                consoleLog('updateAI_Training.js/updateTheAI_Training', 3, 'trainingID: ' + trainingID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitraining/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'selectorID': selectorID, 'criteria': criteria, 'active': active, 'createdby': userName, 'created': today, 'trainingID': trainingID })
                })
                if (!data.ok) {
                    throw Error('Error during the update AI_Training')
                }
                aitraining.value = await data.json()
                consoleLog('updateAI_Training.js/updateTheAI_Training', 3, '--- updateaitraining ---' + url + 'aitraining/update', trace)
                consoleLog('updateAI_Training.js/updateTheAI_Training', 3, '--- Message: ' + aitraining.value.message, trace)
                consoleLog('updateAI_Training.js/updateTheAI_Training', 3, aitraining.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateAI_Training.js/updateTheAI_Training', 3, error.value, trace)
        }
    }

    return { error, updateTheAI_Training }
}

export default updateAI_Training