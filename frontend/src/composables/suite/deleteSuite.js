/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete a suite
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteSuite = (suiteID) => {

    const error = ref(null)

    const deleteTheSuite = async (suite, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteSuite.js/deleteTheSuite', 3, 'LOCAL Database delete suite not implemented', trace)
            } else {
                consoleLog('deleteSuite.js/deleteTheSuite', 3, 'suiteID: ' + suiteID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'suite/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'suiteID': suiteID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the suite')
                }
                suite.value = await data.json()
                consoleLog('deleteSuite.js/deleteTheSuite', 3, '--- deleteSuite ---' + url + 'suite/delete', trace)
                consoleLog('deleteSuite.js/deleteTheSuite', 3, '--- Message: ' + suite.value.message, trace)
                consoleLog('deleteSuite.js/deleteTheSuite', 3, suite.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteSuite.js/deleteTheSuite', 3, error.value, trace)
        }
    }

    return { error, deleteTheSuite }
}

export default deleteSuite