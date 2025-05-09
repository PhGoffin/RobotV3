/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-20 11:51:23
 * @Description: Update a story
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updateStory = (storyName, graphlabel, scenarioID, suiteID, comment, active, storyID) => {

    const error = ref(null)

    const updateTheStory = async (story, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateStory.js/updateTheStory', 3, 'LOCAL Database Update story not implemented', trace)
            } else {
                consoleLog('updateStory.js/updateTheStory', 3, 'story: ' + storyName  + ', storyID: ' + storyID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'story/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'story': storyName, 'graphlabel': graphlabel, 'scenarioID': scenarioID, 'suiteID': suiteID, 'comment': comment, 'active': active, 'storyID': storyID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a story')
                }
                story.value = await data.json()
                consoleLog('updateStory.js/updateTheStory', 3, '--- updateStory ---' + url + 'story/update', trace)
                consoleLog('updateStory.js/updateTheStory', 3, '--- Message: ' + story.value.message, trace)
                consoleLog('updateStory.js/updateTheStory', 3, story.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateStory.js/updateTheStory', 3, error.value, trace)
        }
    }

    return { error, updateTheStory }
}

export default updateStory