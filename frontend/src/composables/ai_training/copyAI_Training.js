
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-18
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-18 13:05:58
 * @Description: Copy an AI_Training
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyAI_Training = (trainingID, position) => {

    const error = ref(null)

    const copyTheAI_Training = async (aitraining, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyAI_Training.js/copyTheAI_Training', 3, 'LOCAL Database copy AI_Training not implemented', trace)
            } else {
                consoleLog('copyAI_Training.js/copyTheAI_Training', 3, 'position: ' + position + ', trainingID: ' + trainingID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitraining/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'trainingID': trainingID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of an AI_Training')
                }
                aitraining.value = await data.json()
                consoleLog('copyAI_Training.js/copyTheAI_Training', 3, '--- copyTraining ---' + url + 'aitraining/copy', trace)
                consoleLog('copyAI_Training.js/copyTheAI_Training', 3, '--- Message: ' + aitraining.value.message, trace)
                consoleLog('copyAI_Training.js/copyTheAI_Training', 3, aitraining.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyAI_Training.js/copyTheAI_Training', 3, error.value, trace)
        }
    }

    return { error, copyTheAI_Training }
}

export default copyAI_Training