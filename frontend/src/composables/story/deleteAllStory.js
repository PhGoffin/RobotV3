/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete all the story of a storyheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteAllStory = (storyheaderID) => {

    const error = ref(null)

    const deleteTheStory = async (story, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('DeleteStory.js/DeleteTheStory', 3, 'LOCAL Database delete all story not implemented', trace)
            } else {
                consoleLog('DeleteStory.js/DeleteTheStory', 3, 'storyheaderID: ' + storyheaderID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'story/fulldelete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'storyheaderID': storyheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the full story')
                }
                story.value = await data.json()
                consoleLog('DeleteStory.js/DeleteTheStory', 3, '--- DeleteStory ---' + url + 'story/fulldelete', trace)
                consoleLog('DeleteStory.js/DeleteTheStory', 3, '--- Message: ' + story.value.message, trace)
                consoleLog('DeleteStory.js/DeleteTheStory', 3, story.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('DeleteStory.js/DeleteTheStory', 3, error.value, trace)
        }
    }

    return { error, deleteTheStory }
}

export default deleteAllStory