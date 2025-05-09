
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:12:31
 * @Description: Add a new suite
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const addSuite = (SuiteheaderID, scenarioID, comment, position, active) => {

    const error = ref(null)

    const addNewSuite = async (suite, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addSuite.js/addNewSuite', 3, 'LOCAL Database Add suite not implemented', trace)
            } else {
                consoleLog('addSuite.js/addNewSuite', 3, 'SuiteheaderID: ' + SuiteheaderID + ', scenarioID: ' + scenarioID + ', active: ' + active, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'suite/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'SuiteheaderID': SuiteheaderID, 'scenarioID': scenarioID, 'comment': comment, 'position': position, 'active': active })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new scenario')
                }
                suite.value = await data.json()
                consoleLog('addSuite.js/addNewSuite', 3, '--- createSuite ---' + url + 'suite/create', trace)
                consoleLog('addSuite.js/addNewSuite', 3, '--- Message: ' + suite.value.message, trace)
                consoleLog('addSuite.js/addNewSuite', 3, suite.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addSuite.js/addNewSuite', 3, error.value, trace)
        }
    }

    return { error, addNewSuite }
}

export default addSuite