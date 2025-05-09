/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-04
 * @Last Modified by: 
 * @Last Modified time: 2024-03-04 10:14:43
 * @Description: get a reference backup header by slot
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const getReferencebackupheaderBySlot = (projectID, userID, slotID) => {
    const error = ref(null)

    const loadTheReference = async (reference, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getReferencebackupheaderBySlot.js/loadTheReference', 3, 'LOCAL Database load reference backup header by user not implemented', trace)
            } else {
                consoleLog('getReferencebackupheaderBySlot.js/loadTheReference', 3, 'projectID: ' + projectID + ', userID: ' + userID + ', slotID: ' + slotID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'referencebackupheader/slot', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'userID': userID, 'slotID': slotID })
                })
                if (!data.ok) {
                    throw Error('Error during the load of the reference backup header by User')
                }
                reference.value = await data.json()
                consoleLog('getReferencebackupheaderBySlot.js/loadTheReference', 3, '--- getReferencebackupheaderBySlot ---' + url + 'referencebackupheader/slot', trace)
                consoleLog('getReferencebackupheaderBySlot.js/loadTheReference', 3, '--- Message: ' + reference.value.message, trace)
                consoleLog('getReferencebackupheaderBySlot.js/loadTheReference', 3, reference.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getReferencebackupheaderBySlot.js/loadTheReference', 3, error.value, trace)
        }
    }

    return { error, loadTheReference }
}

export default getReferencebackupheaderBySlot