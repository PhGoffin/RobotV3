/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 08:46:38
 * @Description: Update a Natural position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionNatural = (naturalID, position) => {

    const error = ref(null)

    const updateThePosition = async (natural, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionNatural.js/updateThePosition', 3, 'LOCAL Database Update Natural position not implemented', trace)
            } else {
                consoleLog('updatePositionNatural.js/updateThePosition', 3,'naturalID: ' + naturalID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'natural/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'naturalID': naturalID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the natural position')
                }
                natural.value = await data.json()
                consoleLog('updatePositionNatural.js/updateThePosition', 3, '--- updatePositionNatural ---' + url + 'natural/position', trace)
                consoleLog('updatePositionNatural.js/updateThePosition', 3, '--- Message: ' + natural.value.message, trace)
                consoleLog('updatePositionNatural.js/updateThePosition', 3, natural.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionNatural.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionNatural