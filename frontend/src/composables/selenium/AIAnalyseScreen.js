/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-16
 * @Last Modified by: 
 * @Last Modified time: 2024-05-14 11:48:43
 * @Description: Analyse: Goto a webpage
 */


import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const AIAnalyseScreen = (projectID, subprojectID, userID, userName, link, targetlink, selector, criteria, occurence ) => {

    const error = ref(null)

    const analysePage = async (selenium, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('AIAnalyseScreen.js/analysePage', 3, 'LOCAL Database Analysis Scenario not implemented', trace)
            } else {
                consoleLog('AIAnalyseScreen.js/analysePage', 3, 'targetlink: ' + targetlink + " - " + criteria, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'Selenium/robot/analysescreen', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'subprojectID': subprojectID, 'userID': userID, 'userName': userName, 'link': link, 'targetlink': targetlink, 'selector': selector, 'criteria': criteria, 'occurence': occurence })
                })
                if (!data.ok) {
                    throw Error('Error during the execution of the AI Analyse')
                }
                selenium.value = await data.json()
                consoleLog('AIAnalyseScreen.js/analysePage', 3, '--- seleniumAIAnalyseScreen ---' + url + 'Selenium/robot/analysescreen', trace)
                consoleLog('AIAnalyseScreen.js/analysePage', 3, selenium.value, trace)

            }

        } catch (err) {
            error.value = err.message
            consoleLog('AIAnalyseScreen.js/analysePage', 3, error.value, trace)
        }
    }

    return { error, analysePage }
}

export default AIAnalyseScreen