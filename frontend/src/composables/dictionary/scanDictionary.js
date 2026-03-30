
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2026-01-28
 * @Last Modified by: Someone
 * @Last Modified time: 2026-03-30 09:01:55
 * @Description: Scan a web page
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const scanDictionary = (projectID, dictionaryheaderID, myurl, mydelay, myDevice) => {

    const error = ref(null)

    const scanForTheDictionary = async (dictionary, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('scanDictionary.js/scanForTheDictionary', 3, 'LOCAL Database Scan dictionary not implemented', trace)
            } else {
                consoleLog('scanDictionary.js/scanForTheDictionary', 3, 'projectID: ' + projectID + ', dictionaryheaderID: ' + dictionaryheaderID + ', url: ' + myurl , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dictionary/scan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'dictionaryheaderID': dictionaryheaderID, 'myUrl': myurl, 'myDelay': mydelay, 'myDevice': myDevice })
                })
                if (!data.ok) {
                    throw Error('Error during the scan for the dictionary')
                }
                dictionary.value = await data.json()
                consoleLog('scanDictionary.js/scanForTheDictionary', 3, '--- scanDictionary ---' + url + 'dictionary/scan', trace)
                consoleLog('scanDictionary.js/scanForTheDictionary', 3, '--- Message: ' + dictionary.value.message, trace)
                consoleLog('scanDictionary.js/scanForTheDictionary', 3, dictionary.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('scanDictionary.js/scanForTheDictionary', 3, error.value, trace)
        }
    }

    return { error, scanForTheDictionary }
}

export default scanDictionary