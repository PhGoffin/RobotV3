/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-05
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:12:31
 * @Description: Add a new datasetheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addDatasetheader = (subprojectID, code, comment, position, active) => {

    const error = ref(null)

    const addNewDatasetheader = async (datasetheader, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addDatasetheader.js/addNewDatasetheader', 3, 'LOCAL Database Add datasetheader not implemented', trace)
            } else {
                consoleLog('addDatasetheader.js/addNewDatasetheader', 3, 'subprojecTID: ' + subprojectID + ', code: ' + code + ', active: ' + active, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'datasetheader/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subprojectID': subprojectID, 'code': code, 'comment': comment, 'position': position, 'active': active })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new datasetheader')
                }
                datasetheader.value = await data.json()
                consoleLog('addDatasetheader.js/addNewDatasetheader', 3, '--- createDatasetheader ---' + url + 'datasetheader/create', trace)
                consoleLog('addDatasetheader.js/addNewDatasetheader', 3, '--- Message: ' + datasetheader.value.message, trace)
                consoleLog('addDatasetheader.js/addNewDatasetheader', 3, datasetheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addDatasetheader.js/addNewDatasetheader', 3, error.value, trace)
        }
    }

    return { error, addNewDatasetheader }
}

export default addDatasetheader