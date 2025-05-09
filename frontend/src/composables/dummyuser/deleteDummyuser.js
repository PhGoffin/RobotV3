/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-07
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete a dummyuser
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteDummyuser = (projectID, dummyuserID) => {

    const error = ref(null)

    const deleteTheDummyuser = async (dummyuser, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteDummyuser.js/deleteTheDummyuser', 3, 'LOCAL Database delete dummyuser not implemented', trace)
            } else {
                consoleLog('deleteDummyuser.js/deleteTheDummyuser', 3, 'projectID: ' + projectID + ', dummyuserID: ' + dummyuserID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dummyuser/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'dummyuserID': dummyuserID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the dummyuser')
                }
                dummyuser.value = await data.json()
                consoleLog('deleteDummyuser.js/deleteTheDummyuser', 3, '--- deleteDummyuser ---' + url + 'dummyuser/delete', trace)
                consoleLog('deleteDummyuser.js/deleteTheDummyuser', 3, '--- Message: ' + dummyuser.value.message, trace)
                consoleLog('deleteDummyuser.js/deleteTheDummyuser', 3, dummyuser.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteDummyuser.js/deleteTheDummyuser', 3, error.value, trace)
        }
    }

    return { error, deleteTheDummyuser }
}

export default deleteDummyuser