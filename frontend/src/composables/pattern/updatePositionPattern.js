
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: 
 * @Last Modified time: 2024-04-12 14:19:44
 * @Description: Update Pattern position
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionPattern = (patternID, position) => {

    const error = ref(null)

    const updateThePattern = async (pattern, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionPattern.js/updateThePattern', 3, 'LOCAL Database update Pattern position not implemented', trace)
            } else {
                consoleLog('updatePositionPattern.js/updateThePattern', 3, 'patternID: ' + patternID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'pattern/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'patternID': patternID })
                })
                if (!data.ok) {
                    throw Error('Error during the update Pattern position')
                }
                pattern.value = await data.json()
                consoleLog('updatePositionPattern.js/updateThePattern', 3, '--- updatePositionpattern ---' + url + 'pattern/position', trace)
                consoleLog('updatePositionPattern.js/updateThePattern', 3, '--- Message: ' + pattern.value.message, trace)
                consoleLog('updatePositionPattern.js/updateThePattern', 3, pattern.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionPattern.js/updateThePattern', 3, error.value, trace)
        }
    }

    return { error, updateThePattern }
}

export default updatePositionPattern