/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-04
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete a reference backup header by User
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const getReferencebackupheaderByUser = (projectID, userID) => {
    const error = ref(null)

    const loadTheReference = async (reference, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getReferencebackupheaderByUser.js/loadTheReference', 3, 'LOCAL Database load reference backup header by user not implemented', trace)
            } else {
                consoleLog('getReferencebackupheaderByUser.js/loadTheReference', 3, 'projectID: ' + projectID + ', userID: ' + userID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'referencebackupheader/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'userID': userID })
                })
                if (!data.ok) {
                    throw Error('Error during the load of the reference backup header by User')
                }
                reference.value = await data.json()
                consoleLog('getReferencebackupheaderByUser.js/loadTheReference', 3, '--- getReferencebackupheaderByUser ---' + url + 'referencebackupheader/user', trace)
                consoleLog('getReferencebackupheaderByUser.js/loadTheReference', 3, '--- Message: ' + reference.value.message, trace)
                consoleLog('getReferencebackupheaderByUser.js/loadTheReference', 3, reference.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getReferencebackupheaderByUser.js/loadTheReference', 3, error.value, trace)
        }
    }

    return { error, loadTheReference }
}

export default getReferencebackupheaderByUser