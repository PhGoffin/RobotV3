/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Storyheaders position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionStoryheaders = (storyheaderID, position) => {

    const error = ref(null)

    const updateThePosition = async (storyheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionStoryheaders.js/updateThePosition', 3, 'LOCAL Database Update Storyheaders position not implemented', trace)
            } else {
                consoleLog('updatePositionStoryheaders.js/updateThePosition', 3,'storyheaderID: ' + storyheaderID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'storyheader/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'storyheaderID': storyheaderID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the storyheader position')
                }
                storyheader.value = await data.json()
                consoleLog('updatePositionStoryheaders.js/updateThePosition', 3, '--- updatePositionStoryheaders ---' + url + 'storyheader/position', trace)
                consoleLog('updatePositionStoryheaders.js/updateThePosition', 3, '--- Message: ' + storyheader.value.message, trace)
                consoleLog('updatePositionStoryheaders.js/updateThePosition', 3, storyheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionStoryheaders.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionStoryheaders