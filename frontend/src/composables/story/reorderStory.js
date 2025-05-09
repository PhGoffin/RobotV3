/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Reorder all the Story
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderStory = (storyheaderID) => {

    const error = ref(null)

    const reorderTheStory = async (story, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderStory.js/reorderTheStory', 3, 'LOCAL Database reorder Story is not implemented', trace)
            } else {
                consoleLog('reorderStory.js/reorderTheStory', 3,'storyheaderID: ' + storyheaderID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'story/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'storyheaderID': storyheaderID })
                })

                if (!data.ok) {
                    throw Error('No story available')
                }
                story.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderStory.js/reorderTheStory', 3, err)
        }
    }

    return { error, reorderTheStory }
}

export default reorderStory