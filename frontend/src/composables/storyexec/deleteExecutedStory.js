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


const deleteExecutedStory = (storyheaderID, userID) => {

    const error = ref(null)

    const deleteTheStory = async (story, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteExecutedStory.js/DeleteTheStory', 3, 'LOCAL Database delete story exec not implemented', trace)
            } else {
                consoleLog('deleteExecutedStory.js/DeleteTheStory', 3, 'storyheaderID: ' + storyheaderID + ', userID: ' + userID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'storyexec/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'storyheaderID': storyheaderID, 'userID': userID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the story exec')
                }
                story.value = await data.json()
                consoleLog('deleteExecutedStory.js/DeleteTheStory', 3, '--- deleteExecutedStory ---' + url + 'storyexec/delete', trace)
                consoleLog('deleteExecutedStory.js/DeleteTheStory', 3, '--- Message: ' + story.value.message, trace)
                consoleLog('deleteExecutedStory.js/DeleteTheStory', 3, story.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteExecutedStory.js/DeleteTheStory', 3, error.value, trace)
        }
    }

    return { error, deleteTheStory }
}

export default deleteExecutedStory