/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-30
 * @Last Modified by: Someone
 * @Last Modified time: 2026-04-30 10:24:50
 * @Description: Export story into a curl file
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const exportStory = ( storyName, storyheaderID, storyID, projectID, subprojectID, userID, userName, filename) => {

    const error = ref(null)

    const exportTheStory = async (story, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('exportStory.js/exportTheStory', 3, 'LOCAL Database Export story not implemented', trace)
            } else {
                consoleLog('exportStory.js/exportTheStory', 3, 'storyID: ' + storyID + ', filename: ' + filename, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'story/export', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'storyName': storyName, 'storyheaderID': storyheaderID, 'storyID': storyID, 'projectID': projectID, 
                                           'subprojectID': subprojectID, 'userID': userID, 'userName': userName, 'resetLog': 1, 'url': url, 'filename': filename  })
                })
                if (!data.ok) {
                    throw Error('Error during the export of the story')
                }
                story.value = await data.json()
                consoleLog('exportStory.js/exportTheStory', 3, '--- exportStory ---' + url + 'story/export', trace)
                consoleLog('exportStory.js/exportTheStory', 3, '--- Message: ' + story.value.message, trace)
                consoleLog('exportStory.js/exportTheStory', 3, story.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('exportStory.js/exportTheStory', 3, error.value, trace)
        }
    }

    return { error, exportTheStory }
}

export default exportStory