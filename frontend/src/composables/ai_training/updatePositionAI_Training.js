
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-18 13:13:30
 * @Description: Update AI_Training position
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionAI_Training = (trainingID, position) => {

    const error = ref(null)

    const updateTheAI_Training = async (aitraining, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionAI_Training.js/updateTheAI_Training', 3, 'LOCAL Database update AI_Training position not implemented', trace)
            } else {
                consoleLog('updatePositionAI_Training.js/updateTheAI_Training', 3, 'trainingID: ' + trainingID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitraining/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'trainingID': trainingID })
                })
                if (!data.ok) {
                    throw Error('Error during the update AI_Training position')
                }
                aitraining.value = await data.json()
                consoleLog('updatePositionAI_Training.js/updateTheAI_Training', 3, '--- updatePositionaitraining ---' + url + 'aitraining/position', trace)
                consoleLog('updatePositionAI_Training.js/updateTheAI_Training', 3, '--- Message: ' + aitraining.value.message, trace)
                consoleLog('updatePositionAI_Training.js/updateTheAI_Training', 3, aitraining.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionAI_Training.js/updateTheAI_Training', 3, error.value, trace)
        }
    }

    return { error, updateTheAI_Training }
}

export default updatePositionAI_Training