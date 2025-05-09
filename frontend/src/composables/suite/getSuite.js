/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:17:23
 * @Description: Get the suite by ID
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getSuite = (suiteID) => {

    const error = ref(null)

    const loadSuite = async (suite, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getSuite.js/loadSuite', 3, 'LOCAL Database suite by ID not implemented', trace)
            } else {
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'suite/' + suiteID)
                if (!data.ok) {
                    throw Error('no suite available')
                }
                suite.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getSuite.js/loadSuite', 3, err, trace)
        }
    }

    return { error, loadSuite }
}

export default getSuite