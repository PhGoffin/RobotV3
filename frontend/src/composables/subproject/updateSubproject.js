/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-13
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 16:23
 * @Description: Update a project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updateSubproject = (subprojectName, comment, subprojectID, userName, today) => {

    // const project = ref(null)
    const error = ref(null)

    const updateTheSubproject = async (subproject, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateSubproject.js/updateTheSubproject', 3, 'LOCAL Database Update subproject not implemented', trace)
            } else {
                consoleLog('updateSubproject.js/updateTheSubproject', 3, 'subproject: ' + subprojectName + ', comment: ' + comment + ', subprojectID: ' + subprojectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'subproject/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subproject': subprojectName, 'comment': comment, 'user': userName, 'today': today, 'subprojectID': subprojectID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a subproject')
                }
                subproject.value = await data.json()
                consoleLog('updateSubproject.js/updateTheSubproject', 3, '--- updateSubproject ---' + url + 'subproject/update', trace)
                consoleLog('updateSubproject.js/updateTheSubproject', 3, '--- Message: ' + subproject.value.message, trace)
                consoleLog('updateSubproject.js/updateTheSubproject', 3, subproject.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateSubproject.js/updateTheSubproject', 3, error.value, trace)
        }
    }

    return { error, updateTheSubproject }
}

export default updateSubproject