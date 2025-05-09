/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-05-14
 * @Last Modified by: 
 * @Last Modified time: 2024-05-14 08:16:45
 * @Description: Update a Subproject position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionSubproject = (subprojectID, position) => {

    const error = ref(null)

    const updateThePosition = async (subproject, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionSubproject.js/updateThePosition', 3, 'LOCAL Database Update subproject position not implemented', trace)
            } else {
                consoleLog('updatePositionSubproject.js/updateThePosition', 3,'subprojectID: ' + subprojectID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'subproject/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'subprojectID': subprojectID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the subproject position')
                }
                subproject.value = await data.json()
                consoleLog('updatePositionSubproject.js/updateThePosition', 3, '--- updatePositionSubproject ---' + url + 'subproject/position', trace)
                consoleLog('updatePositionSubproject.js/updateThePosition', 3, '--- Message: ' + subproject.value.message, trace)
                consoleLog('updatePositionSubproject.js/updateThePosition', 3, subproject.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionSubproject.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionSubproject