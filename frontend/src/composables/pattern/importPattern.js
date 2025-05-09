
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-16
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:08:38
 * @Description: API functions for the pattern
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const importPattern = (projectID) => {

    const error = ref(null)
    let fileName = 'P' + projectID + "/Pattern.json"

    const importData = async (pattern, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('importPattern.js/loadLibraries', 3, 'LOCAL Database importPattern not implemented', trace)
            } else {
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'pattern/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'fileName': fileName })
                })
                if (!data.ok) {
                    throw Error('no pattern available')
                }
                pattern.value = await data.json()
                console.log(pattern.value, trace)
            }


        } catch (err) {
            error.value = err.message
            consoleLog('importPattern.js/loadLibraries', 3, err, trace)
        }
    }

    return { error, importData }
}

export default importPattern