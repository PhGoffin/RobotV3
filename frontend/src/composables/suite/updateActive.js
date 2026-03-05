/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2026-03-05
 * @Last Modified by: Someone
 * @Last Modified time: 2026-03-05 11:05:40
 * @Description: Update a Suite active status
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updateActive = (suiteID, active) => {

    const error = ref(null)

    const updateTheActive = async (suite, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateActive.js/updateTheActive', 3, 'LOCAL Database Update suite active not implemented', trace)
            } else {
                consoleLog('updateActive.js/updateTheActive', 3,'suiteID: ' + suiteID + ', active: ' + active, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'suite/active', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'active': active, 'suiteID': suiteID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the suite active status')
                }
                suite.value = await data.json()
                consoleLog('updateActive.js/updateTheActive', 3, '--- updateActive ---' + url + 'suite/active', trace)
                consoleLog('updateActive.js/updateTheActive', 3, '--- Message: ' + suite.value.message, trace)
                consoleLog('updateActive.js/updateTheActive', 3, suite.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateActive.js/updateTheActive', 3, error.value, trace)
        }
    }

    return { error, updateTheActive }
}

export default updateActive