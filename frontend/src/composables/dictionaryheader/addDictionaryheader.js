
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-09
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:12:31
 * @Description: Add a new dictionaryheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addDictionaryheader = (projectID, code, comment, position, active) => {

    const error = ref(null)

    const addNewDictionaryheader = async (dictionaryheader, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addDictionaryheader.js/addNewDictionaryheader', 3, 'LOCAL Database Add dictionaryheader not implemented', trace)
            } else {
                consoleLog('addDictionaryheader.js/addNewDictionaryheader', 3, 'projectID: ' + projectID + ', code: ' + code + ', active: ' + active, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dictionaryheader/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'code': code, 'comment': comment, 'position': position, 'active': active })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new dictionaryheader')
                }
                dictionaryheader.value = await data.json()
                consoleLog('addDictionaryheader.js/addNewDictionaryheader', 3, '--- createDictionaryheader ---' + url + 'dictionaryheader/create', trace)
                consoleLog('addDictionaryheader.js/addNewDictionaryheader', 3, '--- Message: ' + dictionaryheader.value.message, trace)
                consoleLog('addDictionaryheader.js/addNewDictionaryheader', 3, dictionaryheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addDictionaryheader.js/addNewDictionaryheader', 3, error.value, trace)
        }
    }

    return { error, addNewDictionaryheader }
}

export default addDictionaryheader