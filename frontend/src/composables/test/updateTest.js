/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-28
 * @Last Modified by: 
 * @Last Modified time: 2024-11-19 10:59:10
 * @Description: Update a test
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updateTest = ( action, comment, commentType, transpose, testCondition, functionID, parameter1, parameter2, parameter3, parameter4, active, testID) => {

    const error = ref(null)

    const updateTheTest = async (test, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateTest.js/updateTheTest', 3, 'LOCAL Database Update Test not implemented', trace)
            } else {
                consoleLog('updateTest.js/updateTheTest', 3,'testID: ' + testID  + ', action:' + action, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'test/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'action': action, 'comment': comment, 'commentType': commentType, 'transpose': transpose, 'testCondition': testCondition, 'functionID': functionID,
                     'parameter1': parameter1, 'parameter2': parameter2, 'parameter3': parameter3 , 'parameter4': parameter4, 'active': active, 'testID': testID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a test')
                }
                test.value = await data.json()
                consoleLog('updateTest.js/updateTheTest', 3, '--- updateTest ---' + url + 'test/update', trace)
                consoleLog('updateTest.js/updateTheTest', 3, '--- Message: ' + test.value.message, trace)
                consoleLog('updateTest.js/updateTheTest', 3, test.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateTest.js/updateTheTest', 3, error.value, trace)
        }
    }

    return { error, updateTheTest }
}

export default updateTest