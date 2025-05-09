/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-13
 * @Last Modified by: PGO
 * @Last Modified time: 2024-01-13 10:14:43
 * @Description: Delete a subproject
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteSubproject = ( projectID, subprojectID) => {

    const error = ref(null)

    const deleteTheSubproject = async (subproject, trace) => {
        try {

            // simulate delay
            // await new Promise(resolve => {
            //   setTimeout(resolve, 2000)
            // })

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteSubproject.js/deleteTheSubproject', 3, 'LOCAL Database delete subproject not implemented', trace)
            } else {
                consoleLog('deleteSubproject.js/deleteTheSubproject', 3, + ' projectID: ' + projectID + ', subprojectID: ' + subprojectID, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'subproject/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'subprojectID': subprojectID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the subproject')
                }
                subproject.value = await data.json()
                consoleLog('deleteSubproject.js/deleteTheSubproject', 3, '--- deleteSubproject ---' + url + 'project/delete', trace)
                consoleLog('deleteSubproject.js/deleteTheSubproject', 3, '--- Message: ' + subproject.value.message, trace)
                consoleLog('deleteSubproject.js/deleteTheSubproject', 3, subproject.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteSubproject.js/deleteTheSubproject', 3, error.value, trace)
        }
    }

    return { error, deleteTheSubproject }
}

export default deleteSubproject