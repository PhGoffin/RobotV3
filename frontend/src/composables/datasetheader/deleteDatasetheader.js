/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-05
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete a datasetheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteDatasetheader = (subprojectID, datasetheaderID) => {

    const error = ref(null)

    const deleteTheDatasetheader = async (datasetheader, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('DeleteDatasetheader.js/DeleteTheDatasetheader', 3, 'LOCAL Database delete datasetheader not implemented', trace)
            } else {
                consoleLog('DeleteDatasetheader.js/DeleteTheDatasetheader', 3, 'subprojectID: ' + subprojectID + ', datasetheaderID: ' + datasetheaderID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'datasetheader/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subprojectID': subprojectID, 'datasetheaderID': datasetheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the datasetheader')
                }
                datasetheader.value = await data.json()
                consoleLog('DeleteDatasetheader.js/DeleteTheDatasetheader', 3, '--- DeleteDatasetheader ---' + url + 'datasetheader/delete', trace)
                consoleLog('DeleteDatasetheader.js/DeleteTheDatasetheader', 3, '--- Message: ' + datasetheader.value.message, trace)
                consoleLog('DeleteDatasetheader.js/DeleteTheDatasetheader', 3, datasetheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('DeleteDatasetheader.js/DeleteTheDatasetheader', 3, error.value, trace)
        }
    }

    return { error, deleteTheDatasetheader }
}

export default deleteDatasetheader