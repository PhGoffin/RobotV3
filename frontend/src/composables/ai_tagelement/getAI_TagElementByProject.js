
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-20
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-20 17:07:58
 * @Description: Get AI_TagElements by project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAI_TagElementByProject = (projectID) => {

    const error = ref(null)

    const getTheAI_TagElement = async (tagelement, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAI_TagElementByProject.js/getTheAI_TagElement', 3, 'LOCAL Database get AI_TagElements by project not implemented', trace)
            } else {
                consoleLog('getAI_TagElementByProject.js/getTheAI_TagElement', 3, 'projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagelement/project/' + projectID)
                if (!data.ok) {
                    throw Error('Error during the get AI_TagElement by project')
                }
                tagelement.value = await data.json()
                consoleLog('getAI_TagElementByProject.js/getTheAI_TagElement', 3, '--- gettagelementByProject ---' + url + 'aitagelement/project/' + projectID, trace)
                consoleLog('getAI_TagElementByProject.js/getTheAI_TagElement', 3, '--- Message: ' + tagelement.value.message, trace)
                consoleLog('getAI_TagElementByProject.js/getTheAI_TagElement', 3, tagelement.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getAI_TagElementByProject.js/getTheAI_TagElement', 3, error.value, trace)
        }
    }

    return { error, getTheAI_TagElement }
}

export default getAI_TagElementByProject