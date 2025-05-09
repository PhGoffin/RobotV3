/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:17:23
 * @Description: Get all the suites by a subproject
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAllSuitesBySubproject = (subprojectID) => {

    const error = ref(null)

    const loadSuites = async (suites, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAllSuitesBySubproject.js/loadSuites', 3, 'LOCAL Database suite by subproject not implemented', trace)
            } else {
                consoleLog('getAllSuitesBySubproject.js/loadSuites', 3, 'subprojectID: ' + subprojectID ,trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'suite/subproject/' + subprojectID)
                if (!data.ok) {
                    throw Error('no suite available')
                }
                suites.value = await data.json()
                consoleLog('getAllSuitesBySubproject.js/loadSuites', 3, '--- getAllSuitesBySubproject ---' + url + 'suite/subproject/' + subprojectID, trace)
                consoleLog('getAllSuitesBySubproject.js/loadSuites', 3,'--- Message: ' + suites.value.message, trace)
                consoleLog('getAllSuitesBySubproject.js/loadSuites', 3, suites.value, trace)

            }

        } catch (err) {
            error.value = err.message
            consoleLog('getAllSuitesBySubproject.js/loadSuites', 3, err, trace)
        }
    }

    return { error, loadSuites }
}

export default getAllSuitesBySubproject