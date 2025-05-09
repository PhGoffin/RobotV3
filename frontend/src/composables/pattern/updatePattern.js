
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: 
 * @Last Modified time: 2024-04-24 07:15:55
 * @Description: Update Pattern
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updatePattern = (patternID, selectorName, path, tag, attribute, result, weight, comment, active) => {

    const error = ref(null)

    const updateThePattern = async (pattern, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePattern.js/updateThePattern', 3, 'LOCAL Database update Pattern not implemented', trace)
            } else {
                consoleLog('updatePattern.js/updateThePattern', 3, 'patternID: ' + patternID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'pattern/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'selector': selectorName, 'path': path, 'tag': tag, 'attribute': attribute, 'result': result, 'weight': weight, 'comment': comment, 'active': active, 'patternID': patternID })
                })
                if (!data.ok) {
                    throw Error('Error during the update Pattern')
                }
                pattern.value = await data.json()
                consoleLog('updatePattern.js/updateThePattern', 3, '--- updatepattern ---' + url + 'pattern/update', trace)
                consoleLog('updatePattern.js/updateThePattern', 3, '--- Message: ' + pattern.value.message, trace)
                consoleLog('updatePattern.js/updateThePattern', 3, pattern.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePattern.js/updateThePattern', 3, error.value, trace)
        }
    }

    return { error, updateThePattern }
}

export default updatePattern