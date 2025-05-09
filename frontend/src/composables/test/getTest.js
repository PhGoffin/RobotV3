/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-28
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Load detail of a test
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getTest = (testID) => {

    const error = ref(null)

    const loadTest = async (test, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getTest.js/loadTest', 3, 'LOCAL Database get Test is not implemented', trace)
            } else {
                consoleLog('getTest.js/loadTest', 3,' testID: ' + testID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'test/' + testID)
                if (!data.ok) {
                    throw Error('No test available')
                }
                test.value = await data.json()
                consoleLog('getTest.js/loadTest', 3, test, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getTest.js/loadTest', 3, err)
        }
    }

    return { error, loadTest }
}

export default getTest