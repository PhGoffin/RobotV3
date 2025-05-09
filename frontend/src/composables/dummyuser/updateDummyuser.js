/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-07
 * @Last Modified by: 
 * @Last Modified time: 2024-05-22 10:30:37
 * @Description: Update a dummyuser
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

//       // user, crypted, password, active, dummyuserID, projectId
const updateDummyuser = (dummy, user, crypted, password, extraInfo, active, dummyuserID, projectID, userName, today) => {

    const error = ref(null)

    const updateTheDummyuser = async (dummyuser, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateDummyuser.js/updateTheDummyuser', 3, 'LOCAL Database Update dummyuser not implemented', trace)
            } else {
                consoleLog('updateDummyuser.js/updateTheDummyuser', 3, 'projectID: ' + projectID  + ', dummyuserID: ' + dummyuserID + ', dummy: ' + dummy + ', user: ' + user, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dummyuser/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'dummy': dummy, 'user': user, 'crypted': crypted, 'password': password, 'extraInfo': extraInfo, 'active': active, 'userName': userName, 'today': today, 'dummyuserID': dummyuserID, 'projectID': projectID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a dummyuser')
                }
                dummyuser.value = await data.json()
                consoleLog('updateDummyuser.js/updateTheDummyuser', 3, '--- updateDummyuser ---' + url + 'dummyuser/update', trace)
                consoleLog('updateDummyuser.js/updateTheDummyuser', 3, '--- Message: ' + dummyuser.value.message, trace)
                consoleLog('updateDummyuser.js/updateTheDummyuser', 3, dummyuser.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateDummyuser.js/updateTheDummyuser', 3, error.value, trace)
        }
    }

    return { error, updateTheDummyuser }
}

export default updateDummyuser