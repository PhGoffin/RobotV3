
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: 
 * @Last Modified time: 2024-04-24 07:15:26
 * @Description: Add a new pattern
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

// projectID, pattern, path, tag, attribute, result, weight, comment, position, active
const addPattern = (projectID, selectorName, path, tag, attribute, result, weight, comment, position, active) => {

    const error = ref(null)

    const addNewPattern = async (pattern, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addPattern.js/addNewPattern', 3, 'LOCAL Database Add Pattern not implemented', trace)
            } else {
                consoleLog('addPattern.js/addNewPattern', 3, 'pattern: ' + pattern + ', path: ' + path + ', position: ' + position, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'pattern/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'selector':selectorName, 'path': path, 'tag': tag, 'attribute': attribute, 
                    'result': result, 'weight':weight, 'comment': comment, 'position': position, 'active': active })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new pattern')
                }
                pattern.value = await data.json()
                consoleLog('addPattern.js/addNewPattern', 3, '--- createPattern ---' + url + 'pattern/create', trace)
                consoleLog('addPattern.js/addNewPattern', 3, '--- Message: ' + pattern.value.message, trace)
                consoleLog('addPattern.js/addNewPattern', 3, pattern.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addPattern.js/addNewPattern', 3, error.value, trace)
        }
    }

    return { error, addNewPattern }
}

export default addPattern