/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 14:29
 * @Description: Update a dictionary
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updateDictionary = (code, label, comment, language, active, projectID, dictionaryID, userName, today) => {

    const error = ref(null)

    const updateTheDictionary = async (dictionary, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateDictionary.js/updateTheDictionary', 3, 'LOCAL Database Update dictionary not implemented', trace)
            } else {
                consoleLog('updateDictionary.js/updateTheDictionary', 3, 'projectID: ' + projectID  + ', dictionaryID: ' + dictionaryID + ', code: ' + code + ', label: ' + label, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dictionary/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'code': code, 'label': label, 'comment': comment, 'language': language, 'active': active, 'user': userName, 'today': today, 'projectID': projectID, 'dictionaryID': dictionaryID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a dictionary')
                }
                dictionary.value = await data.json()
                consoleLog('updateDictionary.js/updateTheDictionary', 3, '--- updateDictionary ---' + url + 'dictionary/update', trace)
                consoleLog('updateDictionary.js/updateTheDictionary', 3, '--- Message: ' + dictionary.value.message, trace)
                consoleLog('updateDictionary.js/updateTheDictionary', 3, dictionary.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateDictionary.js/updateTheDictionary', 3, error.value, trace)
        }
    }

    return { error, updateTheDictionary }
}

export default updateDictionary