/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Reorder all the Dictionary
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderDictionary = (dictionaryheaderID) => {

    const error = ref(null)

    const reorderTheDictionary = async (dictionary, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderDictionarys.js/reorderTheDictionarys', 3, 'LOCAL Database reorder Dictionary is not implemented', trace)
            } else {
                consoleLog('reorderDictionarys.js/reorderTheDictionarys', 3,'dictionaryheaderID: ' + dictionaryheaderID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dictionary/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'dictionaryheaderID': dictionaryheaderID })
                })

                if (!data.ok) {
                    throw Error('No dictionary available')
                }
                dictionary.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderDictionarys.js/reorderTheDictionarys', 3, err)
        }
    }

    return { error, reorderTheDictionary }
}

export default reorderDictionary