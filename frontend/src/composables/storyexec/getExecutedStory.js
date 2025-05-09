/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-28
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-09 13:42:33
 * @Description: Delete all story exec for a story header and a user
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getExecutedStory = (storyheaderID, userID) => {

    const error = ref(null)

    const loadTheStory = async (story, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getExecutedStory.js/loadTheStory', 3, 'LOCAL Database load story exec not implemented', trace)
            } else {
                consoleLog('getExecutedStory.js/loadTheStory', 3, 'storyheaderID: ' + storyheaderID + ', userID: ' + userID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'storyexec/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'storyheaderID': storyheaderID, 'userID': userID })
                })
                if (!data.ok) {
                    throw Error('Error during the load of the story exec')
                }
                story.value = await data.json()
                consoleLog('getExecutedStory.js/loadTheStory', 3, '--- getExecutedStory ---' + url + 'storyexec/execute', trace)
                consoleLog('getExecutedStory.js/loadTheStory', 3, story.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getExecutedStory.js/loadTheStory', 3, error.value, trace)
        }
    }

    return { error, loadTheStory }
}

export default getExecutedStory