/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-04
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete a reference
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteReferencebackup = (backupheaderID) => {

    const error = ref(null)

    const deleteTheReference = async (reference, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteReferencebackup.js/deleteTheReference', 3, 'LOCAL Database delete reference backup not implemented', trace)
            } else {
                consoleLog('deleteReferencebackup.js/deleteTheReference', 3, 'backupheaderID: ' + backupheaderID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'referencebackup/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'backupheaderID': backupheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the reference backup')
                }
                reference.value = await data.json()
                consoleLog('deleteReferencebackup.js/deleteTheReference', 3, '--- deleteReferencebackup ---' + url + 'referencebackup/delete', trace)
                consoleLog('deleteReferencebackup.js/deleteTheReference', 3, '--- Message: ' + reference.value.message, trace)
                consoleLog('deleteReferencebackup.js/deleteTheReference', 3, reference.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteReferencebackup.js/deleteTheReference', 3, error.value, trace)
        }
    }

    return { error, deleteTheReference }
}

export default deleteReferencebackup