
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-13
 * @Last Modified by: 
 * @Last Modified time: 2024-07-30 08:56:48
 * @Description: Add a new subproject
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addSubproject = (projectID, subprojectName, comment, userName, today, position) => {

    // const project = ref(null)
    const error = ref(null)

    const addNewSubproject = async (subproject, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addSubproject.js/addNewSubproject', 3, 'LOCAL Database Add subproject not implemented', trace)
            } else {
                consoleLog('addSubproject.js/addNewSubproject', 3, 'projectID: ' + projectID + ', subproject: ' + subprojectName  + ', comment: ' + comment, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'subproject/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'subproject': subprojectName, 'comment': comment, 'user': userName, 'today': today, 'position': position })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new subproject')
                }
                subproject.value = await data.json()
                consoleLog('addSubproject.js/addNewSubproject', 3, '--- createSubproject ---' + url + 'subproject/create', trace)
                consoleLog('addSubproject.js/addNewSubproject', 3, '--- Message: ' + subproject.value.message, trace)
                consoleLog('addSubproject.js/addNewSubproject', 3, subproject.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addSubproject.js/addNewSubproject', 3, error.value, trace)
        }
    }

    return { error, addNewSubproject }
}

export default addSubproject