/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-05
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 13:46
 * @Description: Update a storyheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updateStoryheader = (label, comment, active, subprojectID, storyheaderID, userName, today) => {

    const error = ref(null)

    const updateTheStoryheader = async (storyheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateStoryheader.js/updateTheStoryheader', 3, 'LOCAL Database Update storyheader not implemented', trace)
            } else {
                consoleLog('updateStoryheader.js/updateTheStoryheader', 3, 'subprojectID: ' + subprojectID  + ', storyheaderID: ' + storyheaderID + ', label: ' + label, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'storyheader/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'label': label, 'comment': comment, 'active': active, 'user': userName, 'today': today, 'subprojectID': subprojectID, 'storyheaderID': storyheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a storyheader')
                }
                storyheader.value = await data.json()
                consoleLog('updateStoryheader.js/updateTheStoryheader', 3, '--- updateStoryheader ---' + url + 'storyheader/update', trace)
                consoleLog('updateStoryheader.js/updateTheStoryheader', 3, '--- Message: ' + storyheader.value.message, trace)
                consoleLog('updateStoryheader.js/updateTheStoryheader', 3, storyheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateStoryheader.js/updateTheStoryheader', 3, error.value, trace)
        }
    }

    return { error, updateTheStoryheader }
}

export default updateStoryheader