
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-05-28
 * @Last Modified by: 
 * @Last Modified time: 2024-05-28 11:05:12
 * @Description: Import a Datasetheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const importDatasetheader = (currentSubprojectID, datasetheaderName, datasetheaderID) => {

    const error = ref(null)

    const importTheDatasetheader = async (datasetheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('importDatasetheader.js/importTheDatasetheader', 3, 'LOCAL Database import datasetheader not implemented', trace)
            } else {
                consoleLog('importDatasetheader.js/importTheDatasetheader', 3, 'currentSubprojectID: ' + currentSubprojectID + ', Datasetheader: ' + datasetheaderName + ', datasetheaderID: ' + datasetheaderID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'datasetheader/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'currentSubprojectID': currentSubprojectID, 'datasetheaderName': datasetheaderName, 'datasetheaderID': datasetheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the import of a datasetheader')
                }
                datasetheader.value = await data.json()
                consoleLog('importDatasetheader.js/importTheDatasetheader', 3, '--- importDatasetheader ---' + url + 'datasetheader/import', trace)
                consoleLog('importDatasetheader.js/importTheDatasetheader', 3, '--- Message: ' + datasetheader.value.message, trace)
                consoleLog('importDatasetheader.js/importTheDatasetheader', 3, datasetheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('importDatasetheader.js/importTheDatasetheader', 3, error.value, trace)
        }
    }

    return { error, importTheDatasetheader }
}

export default importDatasetheader