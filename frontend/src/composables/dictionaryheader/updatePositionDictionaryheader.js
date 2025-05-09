/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-09
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Dictionaryheader position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionDictionaryheader = (dictionaryheaderID, position) => {

    const error = ref(null)

    const updateThePosition = async (dictionaryheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionDictionaryheader.js/updateThePosition', 3, 'LOCAL Database Update Dictionaryheader position not implemented', trace)
            } else {
                consoleLog('updatePositionDictionaryheader.js/updateThePosition', 3,'dictionaryheaderID: ' + dictionaryheaderID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dictionaryheader/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'dictionaryheaderID': dictionaryheaderID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the dictionaryheader position')
                }
                dictionaryheader.value = await data.json()
                consoleLog('updatePositionDictionaryheader.js/updateThePosition', 3, '--- updatePositionDictionaryheader ---' + url + 'dictionaryheader/position', trace)
                consoleLog('updatePositionDictionaryheader.js/updateThePosition', 3, '--- Message: ' + dictionaryheader.value.message, trace)
                consoleLog('updatePositionDictionaryheader.js/updateThePosition', 3, dictionaryheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionDictionaryheader.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionDictionaryheader