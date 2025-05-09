/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-09
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Copy all Dictionary
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyAllDictionary = (dictionaryheaderIDCopy, dictionaryheaderIDOrigin) => {

    const error = ref(null)

    const copyTheDictionary = async (dictionary, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyAllDictionary.js/copyTheDictionary', 3, 'LOCAL Database Copy Dictionary not implemented', trace)
            } else {
                consoleLog('copyAllDictionary.js/copyTheDictionary', 3,'dictionaryheaderIDCopy: ' + dictionaryheaderIDCopy + ', dictionaryheaderIDOrigin: ' + dictionaryheaderIDOrigin )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dictionary/fullcopy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'dictionaryheaderIDCopy': dictionaryheaderIDCopy, 'dictionaryheaderIDOrigin': dictionaryheaderIDOrigin })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a dictionary')
                }
                dictionary.value = await data.json()
                consoleLog('copyAllDictionary.js/copyTheDictionary', 3, '--- copyAllDictionary ---' + url + 'dictionary/fullcopy', trace)
                consoleLog('copyAllDictionary.js/copyTheDictionary', 3, '--- Message: ' + dictionary.value.message, trace)
                consoleLog('copyAllDictionary.js/copyTheDictionary', 3, dictionary.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyAllDictionary.js/copyTheDictionary', 3, error.value, trace)
        }
    }

    return { error, copyTheDictionary }
}

export default copyAllDictionary