/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-28
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Test position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionTest = (testID, position) => {

    const error = ref(null)

    const updateThePosition = async (test, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionTest.js/updateThePosition', 3, 'LOCAL Database Update Test position not implemented', trace)
            } else {
                consoleLog('updatePositionTest.js/updateThePosition', 3,'testID: ' + testID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'test/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'testID': testID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the test position')
                }
                test.value = await data.json()
                consoleLog('updatePositionTest.js/updateThePosition', 3, '--- updatePositionTest ---' + url + 'test/position', trace)
                consoleLog('updatePositionTest.js/updateThePosition', 3, '--- Message: ' + test.value.message, trace)
                consoleLog('updatePositionTest.js/updateThePosition', 3, test.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionTest.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionTest