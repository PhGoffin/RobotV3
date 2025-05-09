/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Copy a Story
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyStory = (storyID, position) => {

    const error = ref(null)

    const copyTheStory = async (story, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyStory.js/copyTheStory', 3, 'LOCAL Database Copy Story not implemented', trace)
            } else {
                consoleLog('copyStory.js/copyTheStory', 3,'storyID: ' + storyID + ', Position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'story/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'storyID': storyID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a story')
                }
                story.value = await data.json()
                consoleLog('copyStory.js/copyTheStory', 3, '--- copyStory ---' + url + 'story/copy', trace)
                consoleLog('copyStory.js/copyTheStory', 3, '--- Message: ' + story.value.message, trace)
                consoleLog('copyStory.js/copyTheStory', 3, story.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyStory.js/copyTheStory', 3, error.value, trace)
        }
    }

    return { error, copyTheStory }
}

export default copyStory