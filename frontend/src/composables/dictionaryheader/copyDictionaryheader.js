/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-09
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Copy a Dictionaryheader
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyDictionaryheader = (dictionaryheaderID, position) => {

    const error = ref(null)

    const copyTheDictionaryheader = async (dictionaryheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyDictionaryheader.js/copyTheDictionaryheader', 3, 'LOCAL Database Copy Dictionaryheader not implemented', trace)
            } else {
                consoleLog('copyDictionaryheader.js/copyTheDictionaryheader', 3,'dictionaryheaderID: ' + dictionaryheaderID + ', Position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dictionaryheader/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'dictionaryheaderID': dictionaryheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a dictionaryheader')
                }
                dictionaryheader.value = await data.json()
                consoleLog('copyDictionaryheader.js/copyTheDictionaryheader', 3, '--- copyDictionaryheader ---' + url + 'dictionaryheader/copy', trace)
                consoleLog('copyDictionaryheader.js/copyTheDictionaryheader', 3, '--- Message: ' + dictionaryheader.value.message, trace)
                consoleLog('copyDictionaryheader.js/copyTheDictionaryheader', 3, dictionaryheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyDictionaryheader.js/copyTheDictionaryheader', 3, error.value, trace)
        }
    }

    return { error, copyTheDictionaryheader }
}

export default copyDictionaryheader