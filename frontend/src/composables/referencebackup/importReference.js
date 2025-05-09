/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-04
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-05 16:38
 * @Description: Delete a reference
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const importReference = (projectID, userID, backupheaderID) => {

    const error = ref(null)

    const importData = async (reference, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('importReference.js/importData', 3, 'LOCAL Database import reference backup not implemented', trace)
            } else {
                consoleLog('importReference.js/importData', 3, 'backupheaderID: ' + backupheaderID + ', projectID: ' + projectID + ', userID: ' + userID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'referencebackup/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'userID': userID, 'backupheaderID': backupheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the reference backup')
                }
                reference.value = await data.json()
                consoleLog('importReference.js/importData', 3, '--- importReference ---' + url + 'referencebackup/import', trace)
                consoleLog('importReference.js/importData', 3, '--- Message: ' + reference.value.message, trace)
                consoleLog('importReference.js/importData', 3, reference.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('importReference.js/importData', 3, error.value, trace)
        }
    }

    return { error, importData }
}

export default importReference