/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-12
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete a linked user
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteUserProject = (workspaceID, userprojectID) => {

    const error = ref(null)

    const deleteTheUserProject = async (linkedUser, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteUserProject.js/deleteTheUserProject', 3, 'LOCAL Database delete project not implemented', trace)
            } else {
                consoleLog('deleteUserProject.js/deleteTheUserProject', 3, 'workspaceID: ' + workspaceID + ', userprojectID: ' + userprojectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'user/freeUser/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'workspaceID': workspaceID, 'userprojectID': userprojectID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the linked user')
                }
                linkedUser.value = await data.json()
                consoleLog('deleteUserProject.js/deleteTheUserProject', 3, '--- deleteUserProject ---' + url + 'user/freeUser/delete', trace)
                consoleLog('deleteUserProject.js/deleteTheUserProject', 3, '--- Message: ' + linkedUser.value.message, trace)
                consoleLog('deleteUserProject.js/deleteTheUserProject', 3, linkedUser.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteUserProject.js/deleteTheUserProject', 3, error.value, trace)
        }
    }

    return { error, deleteTheUserProject }
}

export default deleteUserProject