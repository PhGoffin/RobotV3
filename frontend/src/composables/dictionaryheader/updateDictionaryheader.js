/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-09
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:25:16
 * @Description: Update a dictionaryheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updateDictionaryheader = (code, comment, active, projectID, dictionaryheaderID) => {

    const error = ref(null)

    const updateTheDictionaryheader = async (dictionaryheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateDictionaryheader.js/updateTheDictionaryheader', 3, 'LOCAL Database Update dictionaryheader not implemented', trace)
            } else {
                consoleLog('updateDictionaryheader.js/updateTheDictionaryheader', 3, 'projectID: ' + projectID  + ', dictionaryheaderID: ' + dictionaryheaderID + ', code: ' + code, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dictionaryheader/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'code': code, 'comment': comment, 'active': active, 'projectID': projectID, 'dictionaryheaderID': dictionaryheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a dictionaryheader')
                }
                dictionaryheader.value = await data.json()
                consoleLog('updateDictionaryheader.js/updateTheDictionaryheader', 3, '--- updateDictionaryheader ---' + url + 'dictionaryheader/update', trace)
                consoleLog('updateDictionaryheader.js/updateTheDictionaryheader', 3, '--- Message: ' + dictionaryheader.value.message, trace)
                consoleLog('updateDictionaryheader.js/updateTheDictionaryheader', 3, dictionaryheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateDictionaryheader.js/updateTheDictionaryheader', 3, error.value, trace)
        }
    }

    return { error, updateTheDictionaryheader }
}

export default updateDictionaryheader