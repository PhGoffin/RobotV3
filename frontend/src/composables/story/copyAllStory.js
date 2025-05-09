/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Copy all the Story from a Storyheader
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyAllStory = (storyheaderIDCopy, storyheaderIDOrigin) => {

    const error = ref(null)

    const copyTheStory = async (story, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyAllStory.js/copyTheStory', 3, 'LOCAL Database Copy All Story not implemented', trace)
            } else {
                consoleLog('copyAllStory.js/copyTheStory', 3,'storyheaderID Origin: ' + storyheaderIDCopy + ' to Copy: ' + storyheaderIDOrigin  )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'story/fullcopy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'storyheaderIDCopy': storyheaderIDCopy, 'storyheaderIDOrigin': storyheaderIDOrigin })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a story')
                }
                story.value = await data.json()
                consoleLog('copyAllStory.js/copyTheStory', 3, '--- copyAllStory ---' + url + 'story/fullcopy', trace)
                consoleLog('copyAllStory.js/copyTheStory', 3, '--- Message: ' + story.value.message, trace)
                consoleLog('copyAllStory.js/copyTheStory', 3, story.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyAllStory.js/copyTheStory', 3, error.value, trace)
        }
    }

    return { error, copyTheStory }
}

export default copyAllStory