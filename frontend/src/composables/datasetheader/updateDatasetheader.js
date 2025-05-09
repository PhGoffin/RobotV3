/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-05
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:25:16
 * @Description: Update a datasetheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updateDatasetheader = (code, comment, active, subprojectID, datasetheaderID) => {

    const error = ref(null)

    const updateTheDatasetheader = async (datasetheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateDatasetheader.js/updateTheDatasetheader', 3, 'LOCAL Database Update datasetheader not implemented', trace)
            } else {
                consoleLog('updateDatasetheader.js/updateTheDatasetheader', 3, 'subprojectID: ' + subprojectID  + ', datasetheaderID: ' + datasetheaderID + ', code: ' + code, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'datasetheader/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'code': code, 'comment': comment, 'active': active, 'subprojectID': subprojectID, 'datasetheaderID': datasetheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a datasetheader')
                }
                datasetheader.value = await data.json()
                consoleLog('updateDatasetheader.js/updateTheDatasetheader', 3, '--- updateDatasetheader ---' + url + 'datasetheader/update', trace)
                consoleLog('updateDatasetheader.js/updateTheDatasetheader', 3, '--- Message: ' + datasetheader.value.message, trace)
                consoleLog('updateDatasetheader.js/updateTheDatasetheader', 3, datasetheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateDatasetheader.js/updateTheDatasetheader', 3, error.value, trace)
        }
    }

    return { error, updateTheDatasetheader }
}

export default updateDatasetheader