/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-09 
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:28:43
 * @Description: Load all the users of a workspace
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAllUsersByWorkspace = (workspaceID) => {

    const error = ref(null)

    const loadUsersByWorkspace = async (users, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAllUsersByWorkspace.js/loadUsersByWorkspace', 3, 'LOCAL Database getAllUserByWorkspace is not implemented', trace)
            } else {
                consoleLog('getAllUsersByWorkspace.js/loadUsersByWorkspace', 3, 'workspaceID: ' + workspaceID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'user/workspace/' + workspaceID)
                if (!data.ok) {
                    throw Error('no user available')
                }
                users.value = await data.json()
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getAllUsersByWorkspace.js/loadUsersByWorkspace', 3, err, trace)
        }
    }

    return { error, loadUsersByWorkspace }
}

export default getAllUsersByWorkspace