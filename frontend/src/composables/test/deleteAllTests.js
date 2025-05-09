/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-15
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete all the test of a scenario
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteAllTest = (scenarioID) => {

    const error = ref(null)

    const deleteTheTest = async (test, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('DeleteTest.js/DeleteTheTest', 3, 'LOCAL Database delete all test not implemented', trace)
            } else {
                consoleLog('DeleteTest.js/DeleteTheTest', 3, 'scenarioID: ' + scenarioID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'test/fulldelete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'scenarioID': scenarioID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the full test')
                }
                test.value = await data.json()
                consoleLog('DeleteTest.js/DeleteTheTest', 3, '--- DeleteTest ---' + url + 'test/fulldelete', trace)
                consoleLog('DeleteTest.js/DeleteTheTest', 3, '--- Message: ' + test.value.message, trace)
                consoleLog('DeleteTest.js/DeleteTheTest', 3, test.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('DeleteTest.js/DeleteTheTest', 3, error.value, trace)
        }
    }

    return { error, deleteTheTest }
}

export default deleteAllTest