
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:12:31
 * @Description: Add a new story
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const addStory = (storyheaderID, scenarioID, suiteID, storyName, graphlabel, position, active) => {

    const error = ref(null)

    const addNewStory = async (story, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addStory.js/addNewStory', 3, 'LOCAL Database Add story not implemented', trace)
            } else {
                consoleLog('addStory.js/addNewStory', 3, 'storyheaderID: ' + storyheaderID + ', story: ' + storyName + ', graphlabel: ' + graphlabel + ', active: ' + active, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'story/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'storyheaderID': storyheaderID, 'scenarioID': scenarioID, 'suiteID': suiteID, 'story': storyName, 'graphlabel': graphlabel, 'position': position, 'active': active })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new story')
                }
                story.value = await data.json()
                consoleLog('addStory.js/addNewStory', 3, '--- createStory ---' + url + 'story/create', trace)
                consoleLog('addStory.js/addNewStory', 3, '--- Message: ' + story.value.message, trace)
                consoleLog('addStory.js/addNewStory', 3, story.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addStory.js/addNewStory', 3, error.value, trace)
        }
    }

    return { error, addNewStory }
}

export default addStory