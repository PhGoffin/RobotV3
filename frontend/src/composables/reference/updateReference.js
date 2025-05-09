/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-23
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:25:16
 * @Description: Update a reference
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updateReference = (code, label, comment, active, projectID, userID, referenceID) => {

    const error = ref(null)

    const updateTheReference = async (reference, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateReference.js/updateTheReference', 3, 'LOCAL Database Update reference not implemented', trace)
            } else {
                consoleLog('updateReference.js/updateTheReference', 3, 'projectID: ' + projectID + ', userID: ' + userID + ', referenceID: ' + referenceID + ', code: ' + code + ', label: ' + label, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'reference/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'code': code, 'label': label, 'comment': comment, 'active': active, 'projectID': projectID, 'userID': userID, 'referenceID': referenceID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a reference')
                }
                reference.value = await data.json()
                consoleLog('updateReference.js/updateTheReference', 3, '--- updateReference ---' + url + 'refernce/update', trace)
                consoleLog('updateReference.js/updateTheReference', 3, '--- Message: ' + reference.value.message, trace)
                consoleLog('updateReference.js/updateTheReference', 3, reference.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateReference.js/updateTheReference', 3, error.value, trace)
        }
    }

    return { error, updateTheReference }
}

export default updateReference