/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 13:46
 * @Description: Update a suiteheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';



const updateSuiteheader = (label, comment, active, subprojectID, suiteheaderID, userName, today) => {

    const error = ref(null)

    const updateTheSuiteheader = async (suiteheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateSuiteheader.js/updateTheSuiteheader', 3, 'LOCAL Database Update suiteheader not implemented', trace)
            } else {
                consoleLog('updateSuiteheader.js/updateTheSuiteheader', 3, 'subprojectID: ' + subprojectID  + ', suiteheaderID: ' + suiteheaderID + ', label: ' + label, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'suiteheader/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'label': label, 'comment': comment, 'active': active, 'user': userName, 'today': today, 'subprojectID': subprojectID, 'suiteheaderID': suiteheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a suiteheader')
                }
                suiteheader.value = await data.json()
                consoleLog('updateSuiteheader.js/updateTheSuiteheader', 3, '--- updateSuiteheader ---' + url + 'suiteheader/update', trace)
                consoleLog('updateSuiteheader.js/updateTheSuiteheader', 3, '--- Message: ' + suiteheader.value.message, trace)
                consoleLog('updateSuiteheader.js/updateTheSuiteheader', 3, suiteheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateSuiteheader.js/updateTheSuiteheader', 3, error.value, trace)
        }
    }

    return { error, updateTheSuiteheader }
}

export default updateSuiteheader