/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-06
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-06 11:48:14
 * @Description: Get all the tests that used a dictionary word in parameter1, 2, 3 or 4
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getTestsByDictionary = (subprojectID, word) => {

    const error = ref(null)

    const loadTest = async (tests, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getTestsByDictionary.js/loadTest', 3, 'LOCAL Database tests by dictionary not implemented', trace)
            } else {
                consoleLog('getTestsByDictionary.js/loadTest', 3, 'subprojectID: ' + subprojectID + ', word: ' + word ,trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'test/dictionary', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subprojectID': subprojectID, 'word': word  })
                })
                if (!data.ok) {
                    throw Error('no test available')
                }
                tests.value = await data.json()
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getTestsByDictionary.js/loadTest', 3, err, trace)
        }
    }

    return { error, loadTest }
}

export default getTestsByDictionary