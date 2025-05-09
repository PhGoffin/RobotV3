/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-15
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Copy all the tests from a Scenario
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyAllTests = (scenarioIDCopy, scenarioIDOrigin) => {

    const error = ref(null)

    const copyTheTest = async (test, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyAllTests.js/copyTheTest', 3, 'LOCAL Database Copy All Dataset not implemented', trace)
            } else {
                consoleLog('copyAllTests.js/copyTheTest', 3,'scenarioID Origin: ' + scenarioIDCopy + ' to Copy: ' + scenarioIDOrigin  )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'test/fullcopy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'scenarioIDCopy': scenarioIDCopy, 'scenarioIDOrigin': scenarioIDOrigin })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a scenario')
                }
                test.value = await data.json()
                consoleLog('copyAllTests.js/copyTheTest', 3, '--- copyAllTests ---' + url + 'test/fullcopy', trace)
                consoleLog('copyAllTests.js/copyTheTest', 3, '--- Message: ' + test.value.message, trace)
                consoleLog('copyAllTests.js/copyTheTest', 3, test.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyAllTests.js/copyTheTest', 3, error.value, trace)
        }
    }

    return { error, copyTheTest }
}

export default copyAllTests