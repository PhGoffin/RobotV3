/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-25
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Reorder all the References
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderReferences = (projectID, userID) => {

    const error = ref(null)

    const reorderTheReferences = async (reference, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderReferences.js/reorderTheReferences', 3, 'LOCAL Database reorderReferences is not implemented', trace)
            } else {
                consoleLog('reorderReferences.js/reorderTheReferences', 3,'projectID: ' + projectID + 'userID: ' + userID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'reference/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'userID': userID  })
                })

                if (!data.ok) {
                    throw Error('No reference available')
                }
                reference.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderReferences.js/reorderTheReferences', 3, err)
        }
    }

    return { error, reorderTheReferences }
}

export default reorderReferences