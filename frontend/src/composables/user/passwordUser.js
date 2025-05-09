/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-14
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Change the password of a user
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const passwordUser = (password, workspaceID, userID) => {

    const error = ref(null)

    const changePassword = async (user, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('passwordUser.js/changePassword', 3, 'LOCAL Database Change password not implemented', trace)
            } else {
                consoleLog('passwordUser.js/changePassword', 3,'workspaceID: ' + workspaceID + ', userID: ' + userID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'user/password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'password': password, 'workspaceID': workspaceID, 'userID': userID })
                })
                if (!data.ok) {
                    throw Error('Error during the change password of a user')
                }
                user.value = await data.json()
                consoleLog('passwordUser.js/changePassword', 3,'--- updatePassword ---' + url + 'user/password', trace)
                consoleLog('passwordUser.js/changePassword', 3,'--- Message: ' + user.value.message, trace)
            }

        } catch (err) {
            error.value = err.message
            //console.log(error.value)
        }
    }

    return { error, changePassword }
}

export default passwordUser