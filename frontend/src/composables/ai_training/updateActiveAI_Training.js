
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-25
 * @Last Modified by: 
 * @Last Modified time: 2024-04-25 08:40:07
 * @Description: Update AI_Training position
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updateActiveAI_Training = (trainingID, active) => {

    const error = ref(null)

    const updateTheAI_Training = async (aitraining, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateActiveAI_Training.js/updateTheAI_Training', 3, 'LOCAL Database update AI_Training active not implemented', trace)
            } else {
                consoleLog('updateActiveAI_Training.js/updateTheAI_Training', 3, 'trainingID: ' + trainingID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitraining/active', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'active': active, 'trainingID': trainingID })
                })
                if (!data.ok) {
                    throw Error('Error during the update AI_Training active')
                }
                aitraining.value = await data.json()
                consoleLog('updateActiveAI_Training.js/updateTheAI_Training', 3, '--- updateActiveAITraining ---' + url + 'aitraining/active', trace)
                consoleLog('updateActiveAI_Training.js/updateTheAI_Training', 3, '--- Message: ' + aitraining.value.message, trace)
                consoleLog('updateActiveAI_Training.js/updateTheAI_Training', 3, aitraining.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateActiveAI_Training.js/updateTheAI_Training', 3, error.value, trace)
        }
    }

    return { error, updateTheAI_Training }
}

export default updateActiveAI_Training