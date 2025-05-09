/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-14
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Delete a user
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteUser = (workspaceID, userID) => {

    const error = ref(null)

    const deleteTheUser = async (user, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteUser.js/deleteTheUser', 3, 'LOCAL Database Delete User not implemented', trace)
            } else {
                consoleLog('deleteUser.js/deleteTheUser', 3,'workspaceID: ' + workspaceID + ', userID: ' + userID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'user/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'workspaceID': workspaceID, 'userID': userID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of a user')
                }
                user.value = await data.json()
                consoleLog('deleteUser.js/deleteTheUser', 3,'--- deleteUser ---' + url + 'user/delete', trace)
                consoleLog('deleteUser.js/deleteTheUser', 3,'--- Message: ' + user.value.message, trace)
                consoleLog('deleteUser.js/deleteTheUser', 3,user.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteUser.js/deleteTheUser', 3, error.value, trace)
        }
    }

    return { error, deleteTheUser }
}

export default deleteUser