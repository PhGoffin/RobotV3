
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-21 11:35:07
 * @Description: Get AI_Selectors by project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAI_SelectorByProject = (projectID) => {

    const error = ref(null)

    const getTheAI_Selector = async (aiselector, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAI_SelectorByProject.js/getTheAI_Selector', 3, 'LOCAL Database get AI_Selectors by project not implemented', trace)
            } else {
                consoleLog('getAI_SelectorByProject.js/getTheAI_Selector', 3, 'projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aiselector/project', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID })
                })                

                if (!data.ok) {
                    throw Error('Error during the get AI_Selector by project')
                }
                aiselector.value = await data.json()
                consoleLog('getAI_SelectorByProject.js/getTheAI_Selector', 3, '--- getAISelectorByProject ---' + url + 'aiselector/project', trace)
                consoleLog('getAI_SelectorByProject.js/getTheAI_Selector', 3, '--- Message: ' + aiselector.value.message, trace)
                consoleLog('getAI_SelectorByProject.js/getTheAI_Selector', 3, aiselector.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getAI_SelectorByProject.js/getTheAI_Selector', 3, error.value, trace)
        }
    }

    return { error, getTheAI_Selector }
}

export default getAI_SelectorByProject