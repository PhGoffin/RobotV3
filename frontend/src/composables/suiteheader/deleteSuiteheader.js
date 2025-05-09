/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete a suiteheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteSuiteheader = (subprojectID, suiteheaderID) => {

    const error = ref(null)

    const deleteTheSuiteheader = async (suiteheader, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('DeleteSuiteheader.js/DeleteTheSuiteheader', 3, 'LOCAL Database delete suiteheader not implemented', trace)
            } else {
                consoleLog('DeleteSuiteheader.js/DeleteTheSuiteheader', 3, 'subprojectID: ' + subprojectID + ', suiteheaderID: ' + suiteheaderID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'suiteheader/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subprojectID': subprojectID, 'suiteheaderID': suiteheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the suiteheader')
                }
                suiteheader.value = await data.json()
                consoleLog('DeleteSuiteheader.js/DeleteTheSuiteheader', 3, '--- DeleteSuiteheader ---' + url + 'suiteheader/delete', trace)
                consoleLog('DeleteSuiteheader.js/DeleteTheSuiteheader', 3, '--- Message: ' + suiteheader.value.message, trace)
                consoleLog('DeleteSuiteheader.js/DeleteTheSuiteheader', 3, suiteheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('DeleteSuiteheader.js/DeleteTheSuiteheader', 3, error.value, trace)
        }
    }

    return { error, deleteTheSuiteheader }
}

export default deleteSuiteheader