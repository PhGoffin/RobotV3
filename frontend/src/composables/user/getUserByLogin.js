/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-10 
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:30:16
 * @Description: Get user data by login
 */

import { ref } from 'vue'
import { displayMsg, consoleLog}  from '../../util/debug';


const getUserByLogin = (workspaceID, login, password) => {

    const user = ref(null)
    const error = ref(null)
    displayMsg ('getUserByLogin')

    const loadLogin = async (trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getUserByLogin.js/loadLogin', 3, 'LOCAL Database user login not implemented', trace)
            } else {
                consoleLog('getUserByLogin.js/loadLogin', 3,'user login: ' + login +  ' - password: ' + password, trace)
                const url = process.env.VUE_APP_MYSQL_API
                //let data = await fetch(url + 'project/' + workspaceID)
                let data = await fetch(url + 'user/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'workspaceID': workspaceID, 'login': login, 'password': password })
                })
                if (!data.ok) {
                    throw Error('no user available')
                }
                user.value = await data.json()
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getUserByLogin.js/loadLogin', 3, error.value)
        }
    }

    return { user, error, loadLogin }
}

export default getUserByLogin