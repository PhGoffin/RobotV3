/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-17
 * @Last Modified by: 
 * @Last Modified time: 2024-04-17 08:08:57
 * @Description: Update a Test active status
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updateActive = (testID, active) => {

    const error = ref(null)

    const updateTheActive = async (test, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateActive.js/updateTheActive', 3, 'LOCAL Database Update Test active not implemented', trace)
            } else {
                consoleLog('updateActive.js/updateTheActive', 3,'testID: ' + testID + ', active: ' + active, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'test/active', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'active': active, 'testID': testID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the test active status')
                }
                test.value = await data.json()
                consoleLog('updateActive.js/updateTheActive', 3, '--- updateActive ---' + url + 'test/active', trace)
                consoleLog('updateActive.js/updateTheActive', 3, '--- Message: ' + test.value.message, trace)
                consoleLog('updateActive.js/updateTheActive', 3, test.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateActive.js/updateTheActive', 3, error.value, trace)
        }
    }

    return { error, updateTheActive }
}

export default updateActive