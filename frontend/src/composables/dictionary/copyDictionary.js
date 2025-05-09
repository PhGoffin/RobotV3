/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 14:28
 * @Description: Copy a Dictionary
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyDictionary = (dictionaryID, position, userName, today) => {

    const error = ref(null)

    const copyTheDictionary = async (dictionary, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyDictionary.js/copyTheDictionary', 3, 'LOCAL Database Copy Dictionary not implemented', trace)
            } else {
                consoleLog('copyDictionary.js/copyTheDictionary', 3,'dictionaryID: ' + dictionaryID + ', Position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dictionary/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'user': userName, 'today': today, 'dictionaryID': dictionaryID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a dictionary')
                }
                dictionary.value = await data.json()
                consoleLog('copyDictionary.js/copyTheDictionary', 3, '--- copyDictionary ---' + url + 'dictionary/copy', trace)
                consoleLog('copyDictionary.js/copyTheDictionary', 3, '--- Message: ' + dictionary.value.message, trace)
                consoleLog('copyDictionary.js/copyTheDictionary', 3, dictionary.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyDictionary.js/copyTheDictionary', 3, error.value, trace)
        }
    }

    return { error, copyTheDictionary }
}

export default copyDictionary