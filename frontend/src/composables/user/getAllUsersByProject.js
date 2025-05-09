
import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAllUsersByProject = (workspaceID, projectID) => {

    const error = ref(null)
    const projectstatus = 0

    const loadUsersProject = async (usersproject, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAllUsersByProject/loadUsersProject', 3, 'LOCAL Database getAllUserByProject is not implemented', trace)
            } else {
                consoleLog('getAllUsersByProject/loadUsersProject', 3, 'workspaceID: ' + workspaceID + ', projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'user/project', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'workspaceID': workspaceID, 'projectID': projectID })
                })
                if (!data.ok) {
                    throw Error('Error during the select of the linked users of a project')
                }
                usersproject.value = await data.json()
                consoleLog('getAllUsersByProject/loadUsersProject', 3, '--- getAllUserByProject ---' + url + 'user/project', trace)
                consoleLog('getAllUsersByProject/loadUsersProject', 3,'--- Message: ' + usersproject.value.message, trace)
                consoleLog('getAllUsersByProject/loadUsersProject', 3, usersproject.value, trace)
            }


        } catch (err) { 
            error.value = err.message
            consoleLog('getAllUsersByProject/loadUsersProject', 3,err, trace)
        }
    }

    return { error, loadUsersProject }
}

export default getAllUsersByProject