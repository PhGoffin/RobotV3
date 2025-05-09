/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 13:46
 * @Description: Copy a Storyheader
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyStoryheader = (storyheaderID, position, userName, today) => {

    const error = ref(null)

    const copyTheStoryheader = async (storyheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyStoryheader.js/copyTheStoryheader', 3, 'LOCAL Database Copy Storyheader not implemented', trace)
            } else {
                consoleLog('copyStoryheader.js/copyTheStoryheader', 3,'storyheaderID: ' + storyheaderID + ', Position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'storyheader/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'user': userName, 'today': today, 'storyheaderID': storyheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a storyheader')
                }
                storyheader.value = await data.json()
                consoleLog('copyStoryheader.js/copyTheStoryheader', 3, '--- copyStoryheader ---' + url + 'storyheader/copy', trace)
                consoleLog('copyStoryheader.js/copyTheStoryheader', 3, '--- Message: ' + storyheader.value.message, trace)
                consoleLog('copyStoryheader.js/copyTheStoryheader', 3, storyheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyStoryheader.js/copyTheStoryheader', 3, error.value, trace)
        }
    }

    return { error, copyTheStoryheader }
}

export default copyStoryheader