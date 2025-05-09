/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Copy a Suite
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copySuite = (suiteID, position) => {

    const error = ref(null)

    const copyTheSuite = async (suite, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copySuite.js/copyTheSuite', 3, 'LOCAL Database Copy Suite not implemented', trace)
            } else {
                consoleLog('copySuite.js/copyTheSuite', 3,'suiteID: ' + suiteID + ', Position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'suite/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'suiteID': suiteID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a suite')
                }
                suite.value = await data.json()
                consoleLog('copySuite.js/copyTheSuite', 3, '--- copySuite ---' + url + 'suite/copy', trace)
                consoleLog('copySuite.js/copyTheSuite', 3, '--- Message: ' + suite.value.message, trace)
                consoleLog('copySuite.js/copyTheSuite', 3, suite.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copySuite.js/copyTheSuite', 3, error.value, trace)
        }
    }

    return { error, copyTheSuite }
}

export default copySuite