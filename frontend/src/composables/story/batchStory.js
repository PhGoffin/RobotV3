/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-30
 * @Last Modified by: Someone
 * @Last Modified time: 2026-04-30 13:22:38
 * @Description: Export batch file to execute a curl file
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const batchStory = ( userName, jsonFile, filename) => {

    const error = ref(null)

    const batchTheStory = async (story, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('batchStory.js/batchTheStory', 3, 'LOCAL Database Export story not implemented', trace)
            } else {
                consoleLog('batchStory.js/batchTheStory', 3, 'filename: ' + filename, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'story/batch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'userName': userName, 'url': url, 'jsonFile': jsonFile, 'filename': filename  })
                })
                if (!data.ok) {
                    throw Error('Error during the export of the batch story')
                }
                story.value = await data.json()
                consoleLog('batchStory.js/batchTheStory', 3, '--- batchStory ---' + url + 'story/export', trace)
                consoleLog('batchStory.js/batchTheStory', 3, '--- Message: ' + story.value.message, trace)
                consoleLog('batchStory.js/batchTheStory', 3, story.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('batchStory.js/batchTheStory', 3, error.value, trace)
        }
    }

    return { error, batchTheStory }
}

export default batchStory