/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-07
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Dummyuser position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionDummyuser = (dummyuserID, position) => {

    const error = ref(null)

    const updateThePosition = async (dummyuser, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionDummyuser.js/updateThePosition', 3, 'LOCAL Database Update Dummyuser position not implemented', trace)
            } else {
                consoleLog('updatePositionDummyuser.js/updateThePosition', 3,'dummyuserID: ' + dummyuserID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dummyuser/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'dummyuserID': dummyuserID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the dummyuser position')
                }
                dummyuser.value = await data.json()
                consoleLog('updatePositionDummyuser.js/updateThePosition', 3, '--- updatePositionDummyuser ---' + url + 'dummyuser/position', trace)
                consoleLog('updatePositionDummyuser.js/updateThePosition', 3, '--- Message: ' + dummyuser.value.message, trace)
                consoleLog('updatePositionDummyuser.js/updateThePosition', 3, dummyuser.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionDummyuser.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionDummyuser