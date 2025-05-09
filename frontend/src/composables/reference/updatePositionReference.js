/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-25
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Reference position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionReference = (referenceID, position) => {

    const error = ref(null)

    const updateThePosition = async (reference, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionReference.js/updateThePosition', 3, 'LOCAL Database Update Reference position not implemented', trace)
            } else {
                consoleLog('updatePositionReference.js/updateThePosition', 3,'referenceID: ' + referenceID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'reference/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'referenceID': referenceID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the reference position')
                }
                reference.value = await data.json()
                consoleLog('updatePositionReference.js/updateThePosition', 3, '--- updatePositionReference ---' + url + 'reference/position', trace)
                consoleLog('updatePositionReference.js/updateThePosition', 3, '--- Message: ' + reference.value.message, trace)
                consoleLog('updatePositionReference.js/updateThePosition', 3, reference.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionReference.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionReference