/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-31
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete a dictionary
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteAllDictionary = (dictionaryheaderID) => {

    const error = ref(null)

    const deleteTheDictionary = async (dictionary, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteAllDictionary.js/deleteTheDictionary', 3, 'LOCAL Database delete dictionary not implemented', trace)
            } else {
                consoleLog('deleteAllDictionary.js/deleteTheDictionary', 3, 'dictionaryheaderID: ' + dictionaryheaderID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dictionary/fulldelete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'dictionaryheaderID': dictionaryheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the dictionary')
                }
                dictionary.value = await data.json()
                consoleLog('deleteAllDictionary.js/deleteTheDictionary', 3, '--- deleteAllDictionary ---' + url + 'dictionary/fulldelete', trace)
                consoleLog('deleteAllDictionary.js/deleteTheDictionary', 3, '--- Message: ' + dictionary.value.message, trace)
                consoleLog('deleteAllDictionary.js/deleteTheDictionary', 3, dictionary.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteAllDictionary.js/deleteTheDictionary', 3, error.value, trace)
        }
    }

    return { error, deleteTheDictionary }
}

export default deleteAllDictionary