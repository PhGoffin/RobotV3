/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 08:51:54
 * @Description: Delete a naturalheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteNaturalheader = (naturalheaderID) => {

    const error = ref(null)

    const deleteTheNaturalheader = async (naturalheader, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteNaturalheader.js/deleteTheNaturalheader', 3, 'LOCAL Database delete naturalheader not implemented', trace)
            } else {
                consoleLog('deleteNaturalheader.js/deleteTheNaturalheader', 3, 'naturalheaderID: ' + naturalheaderID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'naturalheader/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'naturalheaderID': naturalheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the naturalheader')
                }
                naturalheader.value = await data.json()
                consoleLog('deleteNaturalheader.js/deleteTheNaturalheader', 3, '--- deleteNaturalheader ---' + url + 'naturalheader/delete', trace)
                consoleLog('deleteNaturalheader.js/deleteTheNaturalheader', 3, '--- Message: ' + naturalheader.value.message, trace)
                consoleLog('deleteNaturalheader.js/deleteTheNaturalheader', 3, naturalheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteNaturalheader.js/deleteTheNaturalheader', 3, error.value, trace)
        }
    }

    return { error, deleteTheNaturalheader }
}

export default deleteNaturalheader