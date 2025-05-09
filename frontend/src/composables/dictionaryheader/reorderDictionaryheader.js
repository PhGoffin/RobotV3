/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-09
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Reorder all the Dictionaryheader
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderDictionaryheader = (projectID) => {

    const error = ref(null)

    const reorderTheDictionaryheader = async (dictionaryheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderDictionaryheaders.js/reorderTheDictionaryheaders', 3, 'LOCAL Database reorder Dictionaryheader is not implemented', trace)
            } else {
                consoleLog('reorderDictionaryheaders.js/reorderTheDictionaryheaders', 3,'projectID: ' + projectID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dictionaryheader/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID })
                })

                if (!data.ok) {
                    throw Error('No dictionaryheader available')
                }
                dictionaryheader.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderDictionaryheaders.js/reorderTheDictionaryheaders', 3, err)
        }
    }

    return { error, reorderTheDictionaryheader }
}

export default reorderDictionaryheader