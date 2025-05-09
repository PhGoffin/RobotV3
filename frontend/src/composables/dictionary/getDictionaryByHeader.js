/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: get all the Dictionaries from a header
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getDictionaryByHeader = (dictionaryheaderId) => {

    const error = ref(null)

    const loadDictionary = async (dictionary, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getDictionaryByHeader.js/loadDictionary', 3, 'LOCAL Database load Dictionary by header not implemented', trace)
            } else {
                consoleLog('getDictionaryByHeader.js/loadDictionary', 3,'dictionaryheaderId: ' + dictionaryheaderId, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dictionary/header', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'dictionaryheaderID': dictionaryheaderId })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a dictionary')
                }
                dictionary.value = await data.json()
                consoleLog('getDictionaryByHeader.js/loadDictionary', 3, '--- getDictionaryByHeader ---' + url + 'dictionary/header', trace)
                consoleLog('getDictionaryByHeader.js/loadDictionary', 3, '--- Message: ' + dictionary.value.message, trace)
                consoleLog('getDictionaryByHeader.js/loadDictionary', 3, dictionary.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getDictionaryByHeader.js/loadDictionary', 3, error.value, trace)
        }
    }

    return { error, loadDictionary }
}

export default getDictionaryByHeader