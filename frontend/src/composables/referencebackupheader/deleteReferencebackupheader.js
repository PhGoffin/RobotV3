/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-04
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-05 07:14:34
 * @Description: Delete a reference backeup header
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const deleteReferencebackupheader = (projectID, userID, slotID) => {

    const error = ref(null)

    const deleteTheReferenceheader = async (reference, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteReferencebackupheader.js/deleteTheReference', 3, 'LOCAL Database delete reference backup header not implemented', trace)
            } else {
                consoleLog('deleteReferencebackupheader.js/deleteTheReference', 3, 'projectID: ' + projectID + ', userID: ' + userID + ', slotID: ' + slotID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'referencebackupheader/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'userID': userID, 'slotID': slotID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the reference backup header')
                }
                reference.value = await data.json()
                consoleLog('deleteReferencebackupheader.js/deleteTheReference', 3, '--- deleteReferencebackupheader ---' + url + 'referencebackupheader/delete', trace)
                consoleLog('deleteReferencebackupheader.js/deleteTheReference', 3, '--- Message: ' + reference.value.message, trace)
                consoleLog('deleteReferencebackupheader.js/deleteTheReference', 3, reference.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteReferencebackupheader.js/deleteTheReference', 3, error.value, trace)
        }
    }

    return { error, deleteTheReferenceheader }
}

export default deleteReferencebackupheader