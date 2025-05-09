/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-31
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-09 11:55:55
 * @Description: Delete a story
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteStory = (storyID) => {

    const error = ref(null)

    const deleteTheStory = async (story, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('DeleteStory.js/DeleteTheStory', 3, 'LOCAL Database delete story not implemented', trace)
            } else {
                consoleLog('DeleteStory.js/DeleteTheStory', 3, 'storyID: ' + storyID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'story/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'storyID': storyID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the story')
                }
                story.value = await data.json()
                consoleLog('DeleteStory.js/DeleteTheStory', 3, '--- DeleteStory ---' + url + 'story/delete', trace)
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

export default deleteStory