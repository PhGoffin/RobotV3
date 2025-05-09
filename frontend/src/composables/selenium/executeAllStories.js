/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-07
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-22 12:11:20
 * @Description: Execute a selenium story
 */


import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const executeAllStories = (storyName, storyID, projectID, subprojectID, userID, userName) => {

    const error = ref(null)

    const execStory = async (selenium, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('executeAllStories.js/execStory', 3, 'LOCAL Database Execute Story not implemented', trace)
            } else {
                consoleLog('executeAllStories.js/execStory', 3, 'storyID: ' + storyID + " - " + storyName, trace)

                    const url = process.env.VUE_APP_MYSQL_API
                    let data = await fetch(url + 'Selenium/robot/allstory', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({  'storyName': storyName, 'storyID': storyID, 'projectID': projectID, 'subprojectID': subprojectID, 'userID': userID, 'userName': userName })
                    })
                    if (!data.ok) {
                        throw Error('Error during the execution of the story')
                    }
                    selenium.value = await data.json()
                    consoleLog('executeAllStories.js/execStory', 3, '--- seleniumstory ---' + url + 'Selenium/robot/story', trace)
                    consoleLog('executeAllStories.js/execStory', 3, selenium.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('executeAllStories.js/execStory', 3, error.value, trace)
        }
    }

    return { error, execStory }
}

export default executeAllStories