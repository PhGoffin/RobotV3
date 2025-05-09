/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-28
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Delete a Test
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteTest = (testID) => {

    const error = ref(null)

    const deleteTheTest = async (test, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteTest.js/deleteTheTest', 3, 'LOCAL Database Delete Test not implemented', trace)
            } else {
                consoleLog('deleteTest.js/deleteTheTest', 3,'testID: ' + testID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'test/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'testID': testID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of a test')
                }
                test.value = await data.json()
                consoleLog('deleteTest.js/deleteTheTest', 3,'--- deleteTest ---' + url + 'test/delete', trace)
                consoleLog('deleteTest.js/deleteTheTest', 3,'--- Message: ' + test.value.message, trace)
                consoleLog('deleteTest.js/deleteTheTest', 3,test.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteTest.js/deleteTheTest', 3, error.value, trace)
        }
    }

    return { error, deleteTheTest }
}

export default deleteTest