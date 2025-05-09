/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Dictionary position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionDictionary = (dictionaryID, position) => {

    const error = ref(null)

    const updateThePosition = async (dictionary, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionDictionary.js/updateThePosition', 3, 'LOCAL Database Update Dictionary position not implemented', trace)
            } else {
                consoleLog('updatePositionDictionary.js/updateThePosition', 3,'dictionaryID: ' + dictionaryID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dictionary/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'dictionaryID': dictionaryID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the dictionary position')
                }
                dictionary.value = await data.json()
                consoleLog('updatePositionDictionary.js/updateThePosition', 3, '--- updatePositionDictionary ---' + url + 'dictionary/position', trace)
                consoleLog('updatePositionDictionary.js/updateThePosition', 3, '--- Message: ' + dictionary.value.message, trace)
                consoleLog('updatePositionDictionary.js/updateThePosition', 3, dictionary.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionDictionary.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionDictionary