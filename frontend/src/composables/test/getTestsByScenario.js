/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-28
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:19:17
 * @Description: Get all the tests by the scenarioID
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getTestsByScenario = (scenarioID) => {

    const error = ref(null)

    const loadTest = async (tests, trace) => {
        try {


            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getTestsByScenario.js/loadTest', 3, 'LOCAL Database tests by scenario not implemented', trace)
            } else {
                consoleLog('getTestsByScenario.js/loadTest', 3, 'scenarioID: ' + scenarioID  ,trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'test/scenario/' + scenarioID)
                if (!data.ok) {
                    throw Error('no test available')
                }
                tests.value = await data.json()
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getTestsByScenario.js/loadTest', 3, err, trace)
        }
    }

    return { error, loadTest }
}

export default getTestsByScenario