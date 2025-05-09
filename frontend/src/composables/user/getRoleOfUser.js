/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-10
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:29:42
 * @Description: Get the role of a user
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getRoleOfUser = (workspaceID, projectID, userID) => {

    const projectRole = ref(null)
    const error = ref(null)

    const loadRole = async (trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getRoleOfUser.js/loadRole', 3,'LOCAL Database user role not implemented', trace)
            } else {
                consoleLog('getRoleOfUser.js/loadRole', 3,'get user role - workspaceID: ' + workspaceID + ', projectID: ' + projectID + ', userID: ' + userID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'user/role', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'workspaceID': workspaceID, 'projectID': projectID, 'userID': userID })
                })
                if (!data.ok) {
                    throw Error('no role available')
                }
                projectRole.value = await data.json()


            }


        } catch (err) {
            error.value = err.message
            consoleLog('getRoleOfUser.js/loadRole', 3, error.value)
        }
    }

    return { projectRole, error, loadRole }
}

export default getRoleOfUser