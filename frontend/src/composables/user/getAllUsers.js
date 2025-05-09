/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-15 
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:28:43
 * @Description: Load all the users
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAllUsers = () => {

    const error = ref(null)

    const loadTheUsers = async (users, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAllUsers.js/loadTheUsers', 2, 'LOCAL Database getAllUsers is not implemented', trace)
            } else {
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'user')
                if (!data.ok) {
                    throw Error('no user available')
                }
                users.value = await data.json()
                consoleLog('getAllUsers.js/loadTheUsers', 2, users, trace)
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getAllUsers.js/loadTheUsers', 3, err, trace)
        }
    }

    return { error, loadTheUsers }
}

export default getAllUsers