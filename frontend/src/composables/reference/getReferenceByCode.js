/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-23
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-07 10:45:48
 * @Description: Get detail of a project
 */

import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const getReferenceByCode = (projectID, userID, code) => {

    const error = ref(null)

    const loadReference = async (reference, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getReferenceByCode.js/loadReference', 3, 'LOCAL Database get reference by code not implemented', trace)
            } else {
                consoleLog('getReferenceByCode.js/loadReference', 3, 'projectID:' + projectID + ', userID:' + userID + ', code:' + code, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'reference/code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'userID': userID, 'code': code })
                })
                if (!data.ok) {
                    consoleLog('getReferenceByCode.js/loadReference - NO DATA!', 3, '', trace)
                    throw Error('no reference available')
                }
                reference.value = await data.json()
                consoleLog('getReferenceByCode.js/loadReference - Result: ', 3, reference.value, trace)
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getReferenceByCode.js/loadReference', 3, error.value, trace)
        }
    }

    return { error, loadReference }
}

export default getReferenceByCode