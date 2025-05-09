
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-23
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:12:31
 * @Description: Add a new reference
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addReference = (projectID, userID, code, label, comment, position, active) => {

    // const project = ref(null)
    const error = ref(null)

    const addNewReference = async (reference, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addReference.js/addNewReference', 3, 'LOCAL Database Add reference not implemented', trace)
            } else {
                consoleLog('addReference.js/addNewReference', 3, 'projecTID: ' + projectID + ', userID: ' + userID + ', code: ' + code + ', label: ' + label + ', active: ' + active, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'reference/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'userID': userID, 'code': code, 'label': label, 'comment': comment, 'position': position, 'active': active })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new reference')
                }
                reference.value = await data.json()
                consoleLog('addReference.js/addNewReference', 3, '--- createReference ---' + url + 'reference/create', trace)
                consoleLog('addReference.js/addNewReference', 3, '--- Message: ' + reference.value.message, trace)
                consoleLog('addReference.js/addNewReference', 3, reference.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addReference.js/addNewReference', 3, error.value, trace)
        }
    }

    return { error, addNewReference }
}

export default addReference