/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-28
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete all story exec for a story header and a user
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const resetExecutedStory = (storyheaderID, userID) => {

    const error = ref(null)

    const resetTheStory = async (story, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('resetExecutedStory.js/resetTheStory', 3, 'LOCAL Database reset story exec not implemented', trace)
            } else {
                consoleLog('resetExecutedStory.js/resetTheStory', 3, 'storyheaderID: ' + storyheaderID + ', userID: ' + userID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'storyexec/reset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'storyheaderID': storyheaderID, 'userID': userID })
                })
                if (!data.ok) {
                    throw Error('Error during the reset of the story exec')
                }
                story.value = await data.json()
                consoleLog('resetExecutedStory.js/resetTheStory', 3, '--- resetExecutedStory ---' + url + 'storyexec/reset', trace)
                consoleLog('resetExecutedStory.js/resetTheStory', 3, '--- Message: ' + story.value.message, trace)
                consoleLog('resetExecutedStory.js/resetTheStory', 3, story.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('resetExecutedStory.js/resetTheStory', 3, error.value, trace)
        }
    }

    return { error, resetTheStory }
}

export default resetExecutedStory