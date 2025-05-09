/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Suiteheaders position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionSuiteheaders = (suiteheaderID, position) => {

    const error = ref(null)

    const updateThePosition = async (suiteheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionSuiteheaders.js/updateThePosition', 3, 'LOCAL Database Update Suiteheaders position not implemented', trace)
            } else {
                consoleLog('updatePositionSuiteheaders.js/updateThePosition', 3,'suiteheaderID: ' + suiteheaderID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'suiteheader/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'suiteheaderID': suiteheaderID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the suiteheader position')
                }
                suiteheader.value = await data.json()
                consoleLog('updatePositionSuiteheaders.js/updateThePosition', 3, '--- updatePositionSuiteheaders ---' + url + 'suiteheader/position', trace)
                consoleLog('updatePositionSuiteheaders.js/updateThePosition', 3, '--- Message: ' + suiteheader.value.message, trace)
                consoleLog('updatePositionSuiteheaders.js/updateThePosition', 3, suiteheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionSuiteheaders.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionSuiteheaders