/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-31
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Reorder all the Suiteheaders
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderSuiteheaders = (subprojectID) => {

    const error = ref(null)

    const reorderTheSuiteheaders = async (suiteheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderSuiteheaders.js/reorderTheSuiteheaders', 3, 'LOCAL Database reorder Suiteheaders is not implemented', trace)
            } else {
                consoleLog('reorderSuiteheaders.js/reorderTheSuiteheaders', 3,'subprojectID: ' + subprojectID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'suiteheader/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subprojectID': subprojectID })
                })

                if (!data.ok) {
                    throw Error('No suiteheader available')
                }
                suiteheader.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderSuiteheaders.js/reorderTheSuiteheaders', 3, err)
        }
    }

    return { error, reorderTheSuiteheaders }
}

export default reorderSuiteheaders