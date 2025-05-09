
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-18
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-18 13:08:47
 * @Description: Get AI_Trainings by project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAI_TrainingByProject = (projectID) => {

    const error = ref(null)

    const getTheAI_Training = async (aitraining, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAI_TrainingByProject.js/getTheAI_Training', 3, 'LOCAL Database get AI_Trainings by project not implemented', trace)
            } else {
                consoleLog('getAI_TrainingByProject.js/getTheAI_Training', 3, 'projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitraining/project/' + projectID)
                if (!data.ok) {
                    throw Error('Error during the get AI_Training by project')
                }
                aitraining.value = await data.json()
                consoleLog('getAI_TrainingByProject.js/getTheAI_Training', 3, '--- getaitrainingByProject ---' + url + 'aitraining/project/' + projectID, trace)
                consoleLog('getAI_TrainingByProject.js/getTheAI_Training', 3, '--- Message: ' + aitraining.value.message, trace)
                consoleLog('getAI_TrainingByProject.js/getTheAI_Training', 3, aitraining.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getAI_TrainingByProject.js/getTheAI_Training', 3, error.value, trace)
        }
    }

    return { error, getTheAI_Training }
}

export default getAI_TrainingByProject