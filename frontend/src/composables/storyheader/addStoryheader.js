/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 13:45
 * @Description: Add a new storyheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const addStoryheader = (subprojectID, label, comment, position, active, userName, today) => {

    const error = ref(null)

    const addNewStoryheader = async (storyheader, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addStoryheader.js/addNewStoryheader', 3, 'LOCAL Database Add storyheader not implemented', trace)
            } else {
                consoleLog('addStoryheader.js/addNewStoryheader', 3, 'subprojecTID: ' + subprojectID + ', label: ' + label + ', active: ' + active, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'storyheader/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subprojectID': subprojectID, 'label': label, 'comment': comment, 'position': position, 'active': active, 'user': userName, 'today': today })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new storyheader')
                }
                storyheader.value = await data.json()
                consoleLog('addStoryheader.js/addNewStoryheader', 3, '--- createStoryheader ---' + url + 'storyheader/create', trace)
                consoleLog('addStoryheader.js/addNewStoryheader', 3, '--- Message: ' + storyheader.value.message, trace)
                consoleLog('addStoryheader.js/addNewStoryheader', 3, storyheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addStoryheader.js/addNewStoryheader', 3, error.value, trace)
        }
    }

    return { error, addNewStoryheader }
}

export default addStoryheader