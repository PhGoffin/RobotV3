/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-09
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-09 17:22:37
 * @Description: Update the counter of the story exec
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const counterExecutedStory = (count, storyheaderID, storyID, userID) => {

    const error = ref(null)

    const updateTheCounter = async (story, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('counterExecutedStory.js/updateTheCounter', 3, 'LOCAL Database update the story exec counter not implemented', trace)
            } else {
                consoleLog('counterExecutedStory.js/updateTheCounter', 3, 'storyheaderID: ' + storyheaderID + ', storyID: ' + storyID + ', userID: ' + userID + ', Count: ' + count, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'storyexec/counter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'count': count, 'storyheaderID': storyheaderID, 'storyID': storyID, 'userID': userID })
                })
                if (!data.ok) {
                    throw Error('Error during the upadte of the story exec counter')
                }
                story.value = await data.json()
                consoleLog('counterExecutedStory.js/updateTheCounter', 3, '--- counterExecutedStory ---' + url + 'storyexec/counter', trace)
                consoleLog('counterExecutedStory.js/updateTheCounter', 3, story.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('counterExecutedStory.js/updateTheCounter', 3, error.value, trace)
        }
    }

    return { error, updateTheCounter }
}

export default counterExecutedStory