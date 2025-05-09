/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-14
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 15:36
 * @Description: Update a user
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updateUser = (workspaceID, userID, login, firstName, lastName, email, superuser, active, userName, today) => {

    const error = ref(null)

    const updateTheUser = async (user, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateUser.js/updateTheUser', 3, 'LOCAL Database Add User not implemented', trace)
            } else {
                consoleLog('updateUser.js/updateTheUser', 3,'workspaceID: ' + workspaceID + ', userID: ' + userID + ', firstName: ' + firstName + ', lastName: ' + lastName + ', superuser: ' + superuser + ', active: ' + active, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'user/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'login': login, 'firstName': firstName, 'lastName': lastName, 'email': email, 'superuser': superuser, 'active': active, 'user': userName, 'today': today, 'workspaceID': workspaceID, 'userID': userID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a user')
                }
                user.value = await data.json()
                consoleLog('updateUser.js/updateTheUser', 3,'--- updateUser ---' + url + 'user/update', trace)
                consoleLog('updateUser.js/updateTheUser', 3,'--- Message: ' + user.value.message, trace)
                consoleLog('updateUser.js/updateTheUser', 3,user.value, trace)
            }

        } catch (err) {
            error.value = err.message
            //console.log(error.value)
        }
    }

    return { error, updateTheUser }
}

export default updateUser