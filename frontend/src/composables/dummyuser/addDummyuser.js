
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-07
 * @Last Modified by: 
 * @Last Modified time: 2024-04-08 09:31:51
 * @Description: Add a new dummyuser
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const addDummyuser = (projectID, dummy, user, password, crypted, extraInfo, position, active, userName, today) => {

    const error = ref(null)

    const addNewDummyuser = async (dummyuser, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addDummyuser.js/addNewDummyuser', 3, 'LOCAL Database Add dummyuser not implemented', trace)
            } else {
                consoleLog('addDummyuser.js/addNewDummyuser', 3, 'projectID: ' + projectID + ', dummy: ' + dummy + ', user: ' + user, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dummyuser/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'dummy': dummy, 'user': user, 'password': password, 'crypted': crypted, 'extraInfo': extraInfo, 'position': position, 'active': active, 'user': userName, 'today': today })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new dummyuser')
                }
                dummyuser.value = await data.json()
                consoleLog('addDummyuser.js/addNewDummyuser', 3, '--- createDummyuser ---' + url + 'dummyuser/create', trace)
                consoleLog('addDummyuser.js/addNewDummyuser', 3, '--- Message: ' + dummyuser.value.message, trace)
                consoleLog('addDummyuser.js/addNewDummyuser', 3, dummyuser.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addDummyuser.js/addNewDummyuser', 3, error.value, trace)
        }
    }

    return { error, addNewDummyuser }
}

export default addDummyuser