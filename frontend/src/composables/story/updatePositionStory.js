/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Story position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionStory = (storyID, position) => {

    const error = ref(null)

    const updateThePosition = async (story, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionStory.js/updateThePosition', 3, 'LOCAL Database Update Story position not implemented', trace)
            } else {
                consoleLog('updatePositionStory.js/updateThePosition', 3,'storyID: ' + storyID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'story/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'storyID': storyID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the story position')
                }
                story.value = await data.json()
                consoleLog('updatePositionStory.js/updateThePosition', 3, '--- updatePositionStory ---' + url + 'story/position', trace)
                consoleLog('updatePositionStory.js/updateThePosition', 3, '--- Message: ' + story.value.message, trace)
                consoleLog('updatePositionStory.js/updateThePosition', 3, story.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionStory.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionStory