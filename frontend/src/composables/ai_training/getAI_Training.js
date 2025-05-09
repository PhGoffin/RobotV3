
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-18
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-18 13:07:32
 * @Description: Get an AI_Training
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAI_Training = (trainingID) => {

    const error = ref(null)

    const getTheAI_Training = async (aitraining, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAI_Training.js/getTheAI_Training', 3, 'LOCAL Database get AI_Training not implemented', trace)
            } else {
                consoleLog('getAI_Training.js/getTheAI_Training', 3, 'trainingID: ' + trainingID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitraining/' + trainingID)
                if (!data.ok) {
                    throw Error('Error during the get AI_Training')
                }
                aitraining.value = await data.json()
                consoleLog('getAI_Training.js/getTheAI_Training', 3, '--- get training ---' + url + 'aitraining/' + trainingID, trace)
                consoleLog('getAI_Training.js/getTheAI_Training', 3, '--- Message: ' + aitraining.value.message, trace)
                consoleLog('getAI_Training.js/getTheAI_Training', 3, aitraining.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getAI_Training.js/getTheAI_Training', 3, error.value, trace)
        }
    }

    return { error, getTheAI_Training }
}

export default getAI_Training