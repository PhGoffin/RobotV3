/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Suite position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionSuite = (suiteID, position) => {

    const error = ref(null)

    const updateThePosition = async (suite, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionSuite.js/updateThePosition', 3, 'LOCAL Database Update Suite position not implemented', trace)
            } else {
                consoleLog('updatePositionSuite.js/updateThePosition', 3,'suiteID: ' + suiteID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'suite/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'suiteID': suiteID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the suite position')
                }
                suite.value = await data.json()
                consoleLog('updatePositionSuite.js/updateThePosition', 3, '--- updatePositionSuite ---' + url + 'suite/position', trace)
                consoleLog('updatePositionSuite.js/updateThePosition', 3, '--- Message: ' + suite.value.message, trace)
                consoleLog('updatePositionSuite.js/updateThePosition', 3, suite.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionSuite.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionSuite