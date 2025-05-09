/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-28
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Reorder all the Tests
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderTests = (scenarioID) => {

    const error = ref(null)

    const reorderTheTest = async (test, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderTests.js/reorderTheTest', 3, 'LOCAL Database reorder Tests is not implemented', trace)
            } else {
                consoleLog('reorderTests.js/reorderTheTest', 3,'scenarioID: ' + scenarioID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'test/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'scenarioID': scenarioID })
                })

                if (!data.ok) {
                    throw Error('No test available')
                }
                test.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderTests.js/reorderTheTest', 3, err)
        }
    }

    return { error, reorderTheTest }
}

export default reorderTests