/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-05
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-05 16:52
 * @Description: Delete all the references of a user
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteAllReference = (projectID, userID) => {

    const error = ref(null)

    const deleteTheReference = async (reference, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteAllReference.js/deleteTheReference', 3, 'LOCAL Database full delete reference not implemented', trace)
            } else {
                consoleLog('deleteAllReference.js/deleteTheReference', 3, 'projectID: ' + projectID + ', userID: ' + userID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'reference/fulldelete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'userID': userID})
                })
                if (!data.ok) {
                    throw Error('Error during the full delete of the reference')
                }
                reference.value = await data.json()
                consoleLog('deleteAllReference.js/deleteTheReference', 3, '--- deleteAllReference ---' + url + 'reference/fulldelete', trace)
                consoleLog('deleteAllReference.js/deleteTheReference', 3, reference.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteAllReference.js/deleteTheReference', 3, error.value, trace)
        }
    }

    return { error, deleteTheReference }
}

export default deleteAllReference