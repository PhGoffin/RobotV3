/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-10
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 15:34
 * @Description: Link a user to a project
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addUserProject = (workspaceID, userID, projectID, roleID, preference, userName, today) => {


    const error = ref(null)

    const addNewUserProject = async (linkedUser, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addUserProject.js/addNewUserProject', 3, 'LOCAL Database Add Linked User not implemented', trace)
            } else {
                consoleLog('addUserProject.js/addNewUserProject', 3,'workspaceID: ' + workspaceID + ', userID: ' + userID + ', projectID: ' + projectID + ', roleID: ' + roleID + ', preference: ' + preference, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'user/linkproject', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'workspaceID': workspaceID, 'userID': userID, 'projectID': projectID, 'roleID': roleID, 'preference': preference, 'user': userName, 'today': today  })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new linked user on a project')
                }
                linkedUser.value = await data.json()
                consoleLog('addUserProject.js/addNewUserProject', 3,'--- linkProject ---' + url + 'user/linkproject', trace)
                consoleLog('addUserProject.js/addNewUserProject', 3,'--- Message: ' + linkedUser.value.message, trace)
                consoleLog('addUserProject.js/addNewUserProject', 3,linkedUser.value)
            }

        } catch (err) {
            error.value = err.message
            //(error.value)
        }
    }

    return { error, addNewUserProject }
}

export default addUserProject