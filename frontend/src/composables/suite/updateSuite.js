
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:12:31
 * @Description: Update a suite
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updateSuite = (scenarioID, comment, active, suiteID) => {

    const error = ref(null)

    const updateTheSuite = async (suite, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateSuite.js/updateTheSuite', 3, 'LOCAL Database Update suite not implemented', trace)
            } else {
                consoleLog('updateSuite.js/updateTheSuite', 3, 'suiteID: ' + suiteID + ', scenarioID: ' + scenarioID + ', active: ' + active, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'suite/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'scenarioID': scenarioID, 'comment': comment, 'active': active, 'suiteID': suiteID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a scenario')
                }
                suite.value = await data.json()
                consoleLog('updateSuite.js/updateTheSuite', 3, '--- updateSuite ---' + url + 'suite/update', trace)
                consoleLog('updateSuite.js/updateTheSuite', 3, '--- Message: ' + suite.value.message, trace)
                consoleLog('updateSuite.js/updateTheSuite', 3, suite.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateSuite.js/updateTheSuite', 3, error.value, trace)
        }
    }

    return { error, updateTheSuite }
}

export default updateSuite