/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-10
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 15:36
 * @Description: Edit a link a user to a project
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updateUserProject = (workspaceID, projectID, userprojectID, roleID, preference, userName, today) => {


    const error = ref(null)
    const updateTheUserProject = async (linkedUser, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addUserProject.js/updateUserProject', 3, 'LOCAL Database Add Linked User not implemented', trace)
            } else {
                consoleLog('addUserProject.js/updateUserProject', 3,'workspaceID: ' + workspaceID + ', projectID: ' + projectID + ', userprojectID: ' + userprojectID + ', roleID: ' + roleID + ', preference: ' + preference, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'user/freeUser/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'roleID': roleID,  'preference': preference, 'user': userName, 'today': today, 'workspaceID': workspaceID, 'projectID': projectID, 'userprojectID': userprojectID })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new linked user on a project')
                }
                linkedUser.value = await data.json()
                consoleLog('addUserProject.js/updateUserProject', 3,'--- linkProject ---' + url + 'user/freeUser/update', trace)
                consoleLog('addUserProject.js/updateUserProject', 3,'--- Message: ' + linkedUser.value.message, trace)
                consoleLog('addUserProject.js/updateUserProject', 3,linkedUser.value, trace)
            }

        } catch (err) {
            error.value = err.message
            //console.log(error.value)
        }
    }

    return { error, updateTheUserProject }
}

export default updateUserProject