/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete a storyheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteStoryheader = (subprojectID, storyheaderID) => {

    const error = ref(null)

    const deleteTheStoryheader = async (storyheader, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('DeleteStoryheader.js/DeleteTheStoryheader', 3, 'LOCAL Database delete storyheader not implemented', trace)
            } else {
                consoleLog('DeleteStoryheader.js/DeleteTheStoryheader', 3, 'subprojectID: ' + subprojectID + ', storyheaderID: ' + storyheaderID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'storyheader/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subprojectID': subprojectID, 'storyheaderID': storyheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the storyheader')
                }
                storyheader.value = await data.json()
                consoleLog('DeleteStoryheader.js/DeleteTheStoryheader', 3, '--- DeleteStoryheader ---' + url + 'storyheader/delete', trace)
                consoleLog('DeleteStoryheader.js/DeleteTheStoryheader', 3, '--- Message: ' + storyheader.value.message, trace)
                consoleLog('DeleteStoryheader.js/DeleteTheStoryheader', 3, storyheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('DeleteStoryheader.js/DeleteTheStoryheader', 3, error.value, trace)
        }
    }

    return { error, deleteTheStoryheader }
}

export default deleteStoryheader