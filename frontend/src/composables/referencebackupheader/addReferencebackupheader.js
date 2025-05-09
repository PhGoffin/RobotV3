/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-04
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-04 16:44:53
 * @Description: Delete a reference backeup header
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addReferencebackupheader = (projectID, userID, slotID, comment) => {
    const error = ref(null)

    const addTheReferenceheader = async (reference, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addReferencebackupheader.js/addTheReference', 3, 'LOCAL Database delete reference backup header not implemented', trace)
            } else {
                consoleLog('addReferencebackupheader.js/addTheReference', 3, 'projectID: ' + projectID + ', userID: ' + userID + ', slotID: ' + slotID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'referencebackupheader/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'userID': userID, 'slotID': slotID, 'comment': comment })
                })
                if (!data.ok) {
                    throw Error('Error during the add of the reference backup header')
                }
                reference.value = await data.json()
                consoleLog('addReferencebackupheader.js/addTheReference', 3, '--- addReferencebackupheader ---' + url + 'referencebackupheader/create', trace)
                consoleLog('addReferencebackupheader.js/addTheReference', 3, '--- Message: ' + reference.value.message, trace)
                consoleLog('addReferencebackupheader.js/addTheReference', 3, reference.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addReferencebackupheader.js/addTheReference', 3, error.value, trace)
        }
    }

    return { error, addTheReferenceheader }
}

export default addReferencebackupheader