/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-06-01
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-06-01 11:28:42
 * @Description: Export tests into a json file
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const exportTest = ( scenarioID, filename) => {

    const error = ref(null)

    const exportTheTest = async (test, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('exportTest.js/exportTheTest', 3, 'LOCAL Database Export Test not implemented', trace)
            } else {
                consoleLog('exportTest.js/exportTheTest', 3, 'scenarioID: ' + scenarioID + ', filename: ' + filename, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'test/export', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'scenarioID': scenarioID, 'filename': filename  })
                })
                if (!data.ok) {
                    throw Error('Error during the export of the tests')
                }
                test.value = await data.json()
                consoleLog('exportTest.js/exportTheTest', 3, '--- exportTest ---' + url + 'test/export', trace)
                consoleLog('exportTest.js/exportTheTest', 3, '--- Message: ' + test.value.message, trace)
                consoleLog('exportTest.js/exportTheTest', 3, test.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('exportTest.js/exportTheTest', 3, error.value, trace)
        }
    }

    return { error, exportTheTest }
}

export default exportTest