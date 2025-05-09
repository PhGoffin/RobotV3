/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 14:56
 * @Description: Copy a Suiteheader
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copySuiteheader = (suiteheaderID, position, userName, today) => {

    const error = ref(null)

    const copyTheSuiteheader = async (suiteheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copySuiteheader.js/copyTheSuiteheader', 3, 'LOCAL Database Copy Suiteheader not implemented', trace)
            } else {
                consoleLog('copySuiteheader.js/copyTheSuiteheader', 3,'suiteheaderID: ' + suiteheaderID + ', Position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'suiteheader/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'user': userName, 'today': today, 'suiteheaderID': suiteheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a suiteheader')
                }
                suiteheader.value = await data.json()
                consoleLog('copySuiteheader.js/copyTheSuiteheader', 3, '--- copySuiteheader ---' + url + 'suiteheader/copy', trace)
                consoleLog('copySuiteheader.js/copyTheSuiteheader', 3, '--- Message: ' + suiteheader.value.message, trace)
                consoleLog('copySuiteheader.js/copyTheSuiteheader', 3, suiteheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copySuiteheader.js/copyTheSuiteheader', 3, error.value, trace)
        }
    }

    return { error, copyTheSuiteheader }
}

export default copySuiteheader