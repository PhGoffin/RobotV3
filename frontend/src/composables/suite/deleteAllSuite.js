/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-2
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete all the suite of a suiteheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteAllSuite = (suiteheaderID) => {

    const error = ref(null)

    const deleteTheSuite = async (suite, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('DeleteSuite.js/DeleteTheSuite', 3, 'LOCAL Database delete all suite not implemented', trace)
            } else {
                consoleLog('DeleteSuite.js/DeleteTheSuite', 3, 'suiteheaderID: ' + suiteheaderID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'suite/fulldelete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'suiteheaderID': suiteheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the full suite')
                }
                suite.value = await data.json()
                consoleLog('DeleteSuite.js/DeleteTheSuite', 3, '--- DeleteSuite ---' + url + 'suite/fulldelete', trace)
                consoleLog('DeleteSuite.js/DeleteTheSuite', 3, '--- Message: ' + suite.value.message, trace)
                consoleLog('DeleteSuite.js/DeleteTheSuite', 3, suite.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('DeleteSuite.js/DeleteTheSuite', 3, error.value, trace)
        }
    }

    return { error, deleteTheSuite }
}

export default deleteAllSuite