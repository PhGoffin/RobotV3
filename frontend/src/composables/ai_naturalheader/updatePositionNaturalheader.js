/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-09
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 08:57:52
 * @Description: Update a Naturalheader position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionNaturalheader = (naturalheaderID, position) => {

    const error = ref(null)

    const updateThePosition = async (naturalheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionNaturalheader.js/updateThePosition', 3, 'LOCAL Database Update Naturalheader position not implemented', trace)
            } else {
                consoleLog('updatePositionNaturalheader.js/updateThePosition', 3,'naturalheaderID: ' + naturalheaderID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'naturalheader/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'naturalheaderID': naturalheaderID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the naturalheader position')
                }
                naturalheader.value = await data.json()
                consoleLog('updatePositionNaturalheader.js/updateThePosition', 3, '--- updatePositionNaturalheader ---' + url + 'naturalheader/position', trace)
                consoleLog('updatePositionNaturalheader.js/updateThePosition', 3, '--- Message: ' + naturalheader.value.message, trace)
                consoleLog('updatePositionNaturalheader.js/updateThePosition', 3, naturalheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionNaturalheader.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionNaturalheader