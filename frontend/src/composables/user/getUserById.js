
import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAllUsersById = (workspaceID, userID) => {

    const error = ref(null)
    const projectstatus = 0

    const loadUser = async (user, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAllUsersById.js/loadUser', 3, 'LOCAL Database getAllUserByID is not implemented', trace)
            } else {
                consoleLog('getAllUsersById.js/loadUser', 3, 'workspaceID: ' + workspaceID + ', userID: ' + userID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'user/userid', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'workspaceID': workspaceID, 'userID': userID })
                })
                if (!data.ok) {
                    throw Error('Error during the select of the users by ID')
                }
                user.value = await data.json()
                consoleLog('getAllUsersById.js/loadUser', 3, '--- getAllUserByID ---' + url + 'user/userid', trace)
                consoleLog('getAllUsersById.js/loadUser', 3,'--- Success: ' + user.value.success + ' Message: ' + user.value.message, trace)
                consoleLog('getAllUsersById.js/loadUser', 3, user.value, trace)
            }


        } catch (err) { 
            error.value = err.message
            consoleLog('getAllUsersById.js/loadUser', 3,err, trace)
        }
    }

    return { error, loadUser }
}

export default getAllUsersById