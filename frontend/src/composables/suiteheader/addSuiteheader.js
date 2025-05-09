
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 14:56
 * @Description: Add a new suiteheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addSuiteheader = (subprojectID, label, comment, position, active, userName, today) => {

    const error = ref(null)

    const addNewSuiteheader = async (suiteheader, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addSuiteheader.js/addNewSuiteheader', 3, 'LOCAL Database Add suiteheader not implemented', trace)
            } else {
                consoleLog('addSuiteheader.js/addNewSuiteheader', 3, 'subprojecTID: ' + subprojectID + ', label: ' + label + ', active: ' + active, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'suiteheader/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subprojectID': subprojectID, 'label': label, 'comment': comment, 'position': position, 'active': active, 'user': userName, 'today': today })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new Suite Set')
                }
                suiteheader.value = await data.json()
                consoleLog('addSuiteheader.js/addNewSuiteheader', 3, '--- createSuiteheader ---' + url + 'suiteheader/create', trace)
                consoleLog('addSuiteheader.js/addNewSuiteheader', 3, '--- Message: ' + suiteheader.value.message, trace)
                consoleLog('addSuiteheader.js/addNewSuiteheader', 3, suiteheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addSuiteheader.js/addNewSuiteheader', 3, error.value, trace)
        }
    }

    return { error, addNewSuiteheader }
}

export default addSuiteheader