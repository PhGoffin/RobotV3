
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: 
 * @Last Modified time: 2024-07-29 09:37:42
 * @Description: Add a new AI_Path
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addAI_Path = (projectID, fullPath, pathCondition, weight, comment, position, active) => {

    const error = ref(null)

    const addNewAI_Path = async (aipath, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addAI_Path.js/addNewAI_Path', 3, 'LOCAL Database Add Path not implemented', trace)
            } else {
                consoleLog('addAI_Path.js/addNewAI_Path', 3, 'fullPath: ' + fullPath + ', comment: ' + comment + ', position: ' + position, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aipath/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'fullPath': fullPath, 'pathCondition': pathCondition, 'weight': weight, 'comment': comment, 'position': position, 'active': active })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new AI_Path')
                }
                aipath.value = await data.json()
                consoleLog('addAI_Path.js/addNewAI_Path', 3, '--- createFunction ---' + url + 'aipath/create', trace)
                consoleLog('addAI_Path.js/addNewAI_Path', 3, '--- Message: ' + aipath.value.message, trace)
                consoleLog('addAI_Path.js/addNewAI_Path', 3, aipath.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addAI_Path.js/addNewAI_Path', 3, error.value, trace)
        }
    }

    return { error, addNewAI_Path }
}

export default addAI_Path