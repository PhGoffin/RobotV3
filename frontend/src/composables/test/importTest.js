/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-31
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-31 14:44:37
 * @Description: Import a test from another scenario
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const importTest = ( currentScenarioID, position, testID) => {

    const error = ref(null)

    const importTheTest = async (test, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('importTest.js/importTheTest', 3, 'LOCAL Database Import Test not implemented', trace)
            } else {
                consoleLog('importTest.js/importTheTest', 3,'testID: ' + testID  + ', position:' + position + ', currentScenarioID: ' + currentScenarioID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'test/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'currentScenarioID': currentScenarioID, 'position': position, 'testID': testID  })
                })
                if (!data.ok) {
                    throw Error('Error during the import of a test')
                }
                test.value = await data.json()
                consoleLog('importTest.js/importTheTest', 3, '--- importTest ---' + url + 'test/import', trace)
                consoleLog('importTest.js/importTheTest', 3, '--- Message: ' + test.value.message, trace)
                consoleLog('importTest.js/importTheTest', 3, test.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('importTest.js/importTheTest', 3, error.value, trace)
        }
    }

    return { error, importTheTest }
}

export default importTest