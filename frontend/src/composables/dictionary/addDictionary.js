
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 14:26
 * @Description: Add a new dictionary
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addDictionary = (projectID, dictionaryheaderID, code, label, comment, language, position, active, userName, today) => {

    const error = ref(null)

    const addNewDictionary = async (dictionary, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addDictionary.js/addNewDictionary', 3, 'LOCAL Database Add dictionary not implemented', trace)
            } else {
                consoleLog('addDictionary.js/addNewDictionary', 3, 'projectID: ' + projectID + ', dictionaryheaderID: ' + dictionaryheaderID + ', code: ' + code + ', label: ' + label + ', active: ' + active, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dictionary/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'dictionaryheaderID': dictionaryheaderID, 'code': code, 'label': label, 'comment': comment, 'language': language, 'position': position, 'active': active, 'user': userName, 'today': today })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new dictionary')
                }
                dictionary.value = await data.json()
                consoleLog('addDictionary.js/addNewDictionary', 3, '--- createDictionary ---' + url + 'dictionary/create', trace)
                consoleLog('addDictionary.js/addNewDictionary', 3, '--- Message: ' + dictionary.value.message, trace)
                consoleLog('addDictionary.js/addNewDictionary', 3, dictionary.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addDictionary.js/addNewDictionary', 3, error.value, trace)
        }
    }

    return { error, addNewDictionary }
}

export default addDictionary