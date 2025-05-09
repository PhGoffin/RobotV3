/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-23
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-05 16:49
 * @Description: Delete a reference
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteReference = (projectID, userID, referenceID) => {

    const error = ref(null)

    const deleteTheReference = async (reference, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteReference.js/deleteTheReference', 3, 'LOCAL Database delete reference not implemented', trace)
            } else {
                consoleLog('deleteReference.js/deleteTheReference', 3, 'projectID: ' + projectID + ', userID: ' + userID + ', referenceID: ' + referenceID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'reference/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'userID': userID, 'referenceID': referenceID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the reference')
                }
                reference.value = await data.json()
                consoleLog('deleteReference.js/deleteTheReference', 3, '--- deleteReference ---' + url + 'reference/delete', trace)
                consoleLog('deleteReference.js/deleteTheReference', 3, '--- Message: ' + reference.value.message, trace)
                consoleLog('deleteReference.js/deleteTheReference', 3, reference.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteReference.js/deleteTheReference', 3, error.value, trace)
        }
    }

    return { error, deleteTheReference }
}

export default deleteReference