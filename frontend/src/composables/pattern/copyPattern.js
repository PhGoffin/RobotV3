
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: 
 * @Last Modified time: 2024-04-12 13:58:25
 * @Description: Copy an Pattern
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyPattern = (patternID, position) => {

    const error = ref(null)

    const copyThePattern = async (pattern, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyPattern.js/copyThePattern', 3, 'LOCAL Database copy Pattern not implemented', trace)
            } else {
                consoleLog('copyPattern.js/copyThePattern', 3, 'position: ' + position + ', patternID: ' + patternID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'pattern/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'patternID': patternID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of an Pattern')
                }
                pattern.value = await data.json()
                consoleLog('copyPattern.js/copyThePattern', 3, '--- copyPattern ---' + url + 'pattern/copy', trace)
                consoleLog('copyPattern.js/copyThePattern', 3, '--- Message: ' + pattern.value.message, trace)
                consoleLog('copyPattern.js/copyThePattern', 3, pattern.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyPattern.js/copyThePattern', 3, error.value, trace)
        }
    }

    return { error, copyThePattern }
}

export default copyPattern