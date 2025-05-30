
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: 
 * @Last Modified time: 2024-04-12 14:07:44
 * @Description: Get a pattern
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getPattern = (patternID) => {

    const error = ref(null)

    const getThePattern = async (pattern, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getPattern.js/getThePattern', 3, 'LOCAL Database get Pattern not implemented', trace)
            } else {
                consoleLog('getPattern.js/getThePattern', 3, 'patternID: ' + patternID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'pattern/' + patternID)
                if (!data.ok) {
                    throw Error('Error during the get Pattern')
                }
                pattern.value = await data.json()
                consoleLog('getPattern.js/getThePattern', 3, '--- get pattern ---' + url + 'pattern/' + patternID, trace)
                consoleLog('getPattern.js/getThePattern', 3, '--- Message: ' + pattern.value.message, trace)
                consoleLog('getPattern.js/getThePattern', 3, pattern.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getPattern.js/getThePattern', 3, error.value, trace)
        }
    }

    return { error, getThePattern }
}

export default getPattern