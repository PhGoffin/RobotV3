/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Copy all the Suite from a Suiteheader
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyAllSuite = (suiteheaderIDCopy, suiteheaderIDOrigin) => {

    const error = ref(null)

    const copyTheSuite = async (suite, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyAllSuite.js/copyTheSuite', 3, 'LOCAL Database Copy All Suite not implemented', trace)
            } else {
                consoleLog('copyAllSuite.js/copyTheSuite', 3,'suiteheaderID Origin: ' + suiteheaderIDCopy + ' to Copy: ' + suiteheaderIDOrigin  )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'suite/fullcopy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'suiteheaderIDCopy': suiteheaderIDCopy, 'suiteheaderIDOrigin': suiteheaderIDOrigin })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a suite')
                }
                suite.value = await data.json()
                consoleLog('copyAllSuite.js/copyTheSuite', 3, '--- copyAllSuite ---' + url + 'suite/fullcopy', trace)
                consoleLog('copyAllSuite.js/copyTheSuite', 3, '--- Message: ' + suite.value.message, trace)
                consoleLog('copyAllSuite.js/copyTheSuite', 3, suite.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyAllSuite.js/copyTheSuite', 3, error.value, trace)
        }
    }

    return { error, copyTheSuite }
}

export default copyAllSuite