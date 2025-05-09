/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-28
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Copy a Test
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyTest = (testID, position) => {

    const error = ref(null)

    const copyTheTest = async (test, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyTest.js/copyTheTest', 3, 'LOCAL Database Copy Test not implemented', trace)
            } else {
                consoleLog('copyTest.js/copyTheTest', 3,'testID: ' + testID + ', Position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'test/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'testID': testID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a test')
                }
                test.value = await data.json()
                consoleLog('copyTest.js/copyTheTest', 3, '--- copyTest ---' + url + 'test/copy', trace)
                consoleLog('copyTest.js/copyTheTest', 3, '--- Message: ' + test.value.message, trace)
                consoleLog('copyTest.js/copyTheTest', 3, test.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyTest.js/copyTheTest', 3, error.value, trace)
        }
    }

    return { error, copyTheTest }
}

export default copyTest