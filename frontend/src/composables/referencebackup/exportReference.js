/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-04
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-05 07:09:56
 * @Description: Delete a reference
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';
const exportReference = (backupheaderID, projectID, userID) => {

    const error = ref(null)

    const exportData = async (reference, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('exportReference.js/exportData', 3, 'LOCAL Database export reference backup not implemented', trace)
            } else {
                consoleLog('exportReference.js/exportData', 3, 'backupheaderID: ' + backupheaderID + 'projectID: ' + projectID + 'userID: ' + userID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'referencebackup/export', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'backupheaderID': backupheaderID, 'projectID': projectID, 'userID': userID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the reference backup')
                }
                reference.value = await data.json()
                consoleLog('exportReference.js/exportData', 3, '--- exportReference ---' + url + 'referencebackup/export', trace)
                consoleLog('exportReference.js/exportData', 3, '--- Message: ' + reference.value.message, trace)
                consoleLog('exportReference.js/exportData', 3, reference.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('exportReference.js/exportData', 3, error.value, trace)
        }
    }

    return { error, exportData }
}

export default exportReference