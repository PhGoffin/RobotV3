
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-20
 * @Last Modified by: Someone
 * @Last Modified time: 2025-05-28 14:25:34
 * @Description: Get AI_TagElements by training
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAI_TagElementByTraining = (projectID, trainingID) => {

    const error = ref(null)

    const getTheAI_TagElement = async (tagelement, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAI_TagElementByTraining.js/getTheAI_TagElement', 3, 'LOCAL Database get AI_TagElements by training not implemented', trace)
            } else {
                consoleLog('getAI_TagElementByTraining.js/getTheAI_TagElement', 3, 'projectID: ' + projectID + ', trainingID: ' + trainingID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagelement/training', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'trainingID': trainingID })
                })
                if (!data.ok) {
                    throw Error('Error during the get AI_TagElement by training')
                }
                tagelement.value = await data.json()
                consoleLog('getAI_TagElementByTraining.js/getTheAI_TagElement', 3, '--- gettagelementByTraining ---' + url + 'aitagelement/training', trace)
                consoleLog('getAI_TagElementByTraining.js/getTheAI_TagElement', 3, '--- Message: ' + tagelement.value.message, trace)
                consoleLog('getAI_TagElementByTraining.js/getTheAI_TagElement', 3, tagelement.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getAI_TagElementByTraining.js/getTheAI_TagElement', 3, error.value, trace)
        }
    }

    return { error, getTheAI_TagElement }
}

export default getAI_TagElementByTraining