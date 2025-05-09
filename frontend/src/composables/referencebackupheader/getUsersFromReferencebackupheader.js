
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-05
 * @Last Modified time: 2024-03-05 08:40:49
 * @Description: get a reference backup header by slot
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const getUsersFromReferencebackupheader = (projectID) => {
    const error = ref(null)

    const loadTheUser = async (users, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getUsersFromReferencebackupheader.js/loadTheUser', 3, 'LOCAL Database load users linked with a reference backup header not implemented', trace)
            } else {
                consoleLog('getUsersFromReferencebackupheader.js/loadTheUser', 3, 'projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'referencebackupheader/who', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID })
                })
                if (!data.ok) {
                    throw Error('Error during the load of the users linked with a reference backup header')
                }
                users.value = await data.json()
                consoleLog('getUsersFromReferencebackupheader.js/loadTheUser', 3, '--- getUsersFromReferencebackupheader ---' + url + 'referencebackupheader/who', trace)
                consoleLog('getUsersFromReferencebackupheader.js/loadTheUser', 3, users.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getUsersFromReferencebackupheader.js/loadTheUser', 3, error.value, trace)
        }
    }

    return { error, loadTheUser }
}

export default getUsersFromReferencebackupheader