/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-14
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 15:33
 * @Description: Add a new user
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addUser = (workspaceID, login, password, firstName, lastName, email, superuser, active, userName, today) => {

    const error = ref(null)

    const addNewUser = async (user, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addUser.js/addNewUser', 3, 'LOCAL Database Add User not implemented', trace)
            } else {
                consoleLog('addUser.js/addNewUser', 3,'workspaceID: ' + workspaceID + ', login: ' + login + ', firstName: ' + firstName + ', lastName: ' + lastName + ', superuser: ' + superuser, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'user/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'workspaceID': workspaceID, 'login': login, 'password': password, 'firstName': firstName, 'lastName': lastName, 'email': email, 'superuser': superuser, 'active': active, 'user': userName, 'today': today })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a user')
                }
                user.value = await data.json()
                consoleLog('addUser.js/addNewUser', 3,'--- createUser ---' + url + 'user/create', trace)
                consoleLog('addUser.js/addNewUser', 3,'--- Message: ' + user.value.message, trace)
                consoleLog('addUser.js/addNewUser', 3,user.value, trace)
            }

        } catch (err) {
            error.value = err.message
            //console.log(error.value)
        }
    }

    return { error, addNewUser }
}

export default addUser