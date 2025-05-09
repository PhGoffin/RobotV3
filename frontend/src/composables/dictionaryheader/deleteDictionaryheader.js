/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-09
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete a dictionaryheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteDictionaryheader = (projectID, dictionaryheaderID) => {

    const error = ref(null)

    const deleteTheDictionaryheader = async (dictionaryheader, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteDictionaryheader.js/deleteTheDictionaryheader', 3, 'LOCAL Database delete dictionaryheader not implemented', trace)
            } else {
                consoleLog('deleteDictionaryheader.js/deleteTheDictionaryheader', 3, 'projectID: ' + projectID + ', dictionaryheaderID: ' + dictionaryheaderID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dictionaryheader/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'dictionaryheaderID': dictionaryheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the dictionaryheader')
                }
                dictionaryheader.value = await data.json()
                consoleLog('deleteDictionaryheader.js/deleteTheDictionaryheader', 3, '--- deleteDictionaryheader ---' + url + 'dictionaryheader/delete', trace)
                consoleLog('deleteDictionaryheader.js/deleteTheDictionaryheader', 3, '--- Message: ' + dictionaryheader.value.message, trace)
                consoleLog('deleteDictionaryheader.js/deleteTheDictionaryheader', 3, dictionaryheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteDictionaryheader.js/deleteTheDictionaryheader', 3, error.value, trace)
        }
    }

    return { error, deleteTheDictionaryheader }
}

export default deleteDictionaryheader