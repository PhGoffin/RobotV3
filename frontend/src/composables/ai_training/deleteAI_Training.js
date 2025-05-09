
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-18
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-18 13:06:49
 * @Description: Delete an AI_Training
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteAI_Training = (trainingID) => {

    const error = ref(null)

    const deleteTheAI_Training = async (aitraining, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteAI_Training.js/deleteTheAI_Training', 3, 'LOCAL Database delete AI_Training not implemented', trace)
            } else {
                consoleLog('deleteAI_Training.js/deleteTheAI_Training', 3, 'trainingID: ' + trainingID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitraining/delete/' + trainingID)
                if (!data.ok) {
                    throw Error('Error during the delete of an AI_Training')
                }
                aitraining.value = await data.json()
                consoleLog('deleteAI_Training.js/deleteTheAI_Training', 3, '--- deleteTraining ---' + url + 'aitraining/delete/' + trainingID, trace)
                consoleLog('deleteAI_Training.js/deleteTheAI_Training', 3, '--- Message: ' + aitraining.value.message, trace)
                consoleLog('deleteAI_Training.js/deleteTheAI_Training', 3, aitraining.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteAI_Training.js/deleteTheAI_Training', 3, error.value, trace)
        }
    }

    return { error, deleteTheAI_Training }
}

export default deleteAI_Training