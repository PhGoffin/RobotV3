/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-31
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Datasetheaders position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionDatasetheaders = (datasetheaderID, position) => {

    const error = ref(null)

    const updateThePosition = async (datasetheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionDatasetheaders.js/updateThePosition', 3, 'LOCAL Database Update Datasetheaders position not implemented', trace)
            } else {
                consoleLog('updatePositionDatasetheaders.js/updateThePosition', 3,'datasetheaderID: ' + datasetheaderID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'datasetheader/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'datasetheaderID': datasetheaderID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the datasetheader position')
                }
                datasetheader.value = await data.json()
                consoleLog('updatePositionDatasetheaders.js/updateThePosition', 3, '--- updatePositionDatasetheaders ---' + url + 'datasetheader/position', trace)
                consoleLog('updatePositionDatasetheaders.js/updateThePosition', 3, '--- Message: ' + datasetheader.value.message, trace)
                consoleLog('updatePositionDatasetheaders.js/updateThePosition', 3, datasetheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionDatasetheaders.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionDatasetheaders