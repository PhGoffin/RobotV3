/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Reorder all the Suites
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderSuites = (suiteheaderID) => {

    const error = ref(null)

    const reorderTheSuites = async (suite, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderSuites.js/reorderTheSuites', 3, 'LOCAL Database reorder Suites is not implemented', trace)
            } else {
                consoleLog('reorderSuites.js/reorderTheSuites', 3,'suiteheaderID: ' + suiteheaderID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'suite/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'suiteheaderID': suiteheaderID })
                })

                if (!data.ok) {
                    throw Error('No suite available')
                }
                suite.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderSuites.js/reorderTheSuites', 3, err)
        }
    }

    return { error, reorderTheSuites }
}

export default reorderSuites