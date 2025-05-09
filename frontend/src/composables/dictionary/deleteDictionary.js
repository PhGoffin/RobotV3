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


const deleteDictionary = (dictionaryheaderID, dictionaryID) => {

    const error = ref(null)

    const deleteTheDictionary = async (dictionary, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteDictionary.js/deleteTheDictionary', 3, 'LOCAL Database delete dictionary not implemented', trace)
            } else {
                consoleLog('deleteDictionary.js/deleteTheDictionary', 3, 'dictionaryheaderID: ' + dictionaryheaderID + ', dictionaryID: ' + dictionaryID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dictionary/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'dictionaryheaderID': dictionaryheaderID, 'dictionaryID': dictionaryID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the dictionary')
                }
                dictionary.value = await data.json()
                consoleLog('deleteDictionary.js/deleteTheDictionary', 3, '--- deleteDictionary ---' + url + 'dictionary/delete', trace)
                consoleLog('deleteDictionary.js/deleteTheDictionary', 3, '--- Message: ' + dictionary.value.message, trace)
                consoleLog('deleteDictionary.js/deleteTheDictionary', 3, dictionary.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteDictionary.js/deleteTheDictionary', 3, error.value, trace)
        }
    }

    return { error, deleteTheDictionary }
}

export default deleteDictionary