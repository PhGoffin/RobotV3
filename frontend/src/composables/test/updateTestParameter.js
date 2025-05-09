/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-06
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-06 11:48:19
 * @Description: Update Test parameters
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updateTestParameter = (testID, parameter1, parameter2, parameter3, parameter4) => {

    const error = ref(null)

    const updateTheParameter = async (test, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateTestParameter.js/updateTheParameter', 3, 'LOCAL Database Update Test parameter not implemented', trace)
            } else {
                consoleLog('updateTestParameter.js/updateTheParameter', 3,'testID: ' + testID + ', parameter1: ' + parameter1 + ', parameter2: ' + parameter2 + ', parameter3: ' + parameter3 + ', parameter4: ' + parameter4, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'test/parameter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'parameter1': parameter1, 'parameter2': parameter2,'parameter3': parameter3,'parameter4': parameter4, 'testID': testID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the test parameters')
                }
                test.value = await data.json()
                consoleLog('updateTestParameter.js/updateTheParameter', 3, '--- updateTestParameter ---' + url + 'test/parameter', trace)
                consoleLog('updateTestParameter.js/updateTheParameter', 3, '--- Message: ' + test.value.message, trace)
                consoleLog('updateTestParameter.js/updateTheParameter', 3, test.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateTestParameter.js/updateTheParameter', 3, error.value, trace)
        }
    }

    return { error, updateTheParameter }
}

export default updateTestParameter