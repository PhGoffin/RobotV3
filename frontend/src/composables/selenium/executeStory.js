/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-07
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-22 12:12:24
 * @Description: Execute a selenium story
 */


import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const executeStory = (storyName, storyheaderID, storyID, projectID, subprojectID, userID, userName, resetLog) => {

    const error = ref(null)

    const execStory = async (selenium, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('executeStory.js/execStory', 3, 'LOCAL Database Execute Story not implemented', trace)
            } else {
                consoleLog('executeStory.js/execStory', 3, 'storyID: ' + storyID + " - " + storyName, trace)

                    const url = process.env.VUE_APP_MYSQL_API
                    let data = await fetch(url + 'Selenium/robot/story', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({  'storyName': storyName, 'storyheaderID': storyheaderID, 'storyID': storyID, 'projectID': projectID, 'subprojectID': subprojectID, 'userID': userID, 'userName': userName, 'resetLog': resetLog })
                    })
                    if (!data.ok) {
                        throw Error('Error during the execution of the story')
                    }
                    selenium.value = await data.json()
                    consoleLog('executeStory.js/execStory', 3, '--- seleniumstory ---' + url + 'Selenium/robot/story', trace)
                    consoleLog('executeStory.js/execStory', 3, selenium.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('executeStory.js/execStory', 3, error.value, trace)
        }
    }

    return { error, execStory }
}

export default executeStory