/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-16
 * @Last Modified by: Someone
 * @Last Modified time: 2025-05-27 07:57:07
 * @Description: Analyse a webpage
 */


import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const AIAnalyse = (projectID, subprojectID, userID, userName, link, targetlink, selectorID, criteria, occurence) => {

    const error = ref(null)

    const analysePage = async (selenium, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('AIAnalyse.js/analysePage', 3, 'LOCAL Database Analysis Scenario not implemented', trace)
            } else {
                consoleLog('AIAnalyse.js/analysePage', 3, 'targetlink: ' + targetlink + " - " + criteria, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'playwright/robot/analyse', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        'projectID': projectID, 'subprojectID': subprojectID, 'userID': userID, 'userName': userName, 'link': link,
                        'targetlink': targetlink, 'selectorID': selectorID, 'criteria': criteria, 'occurence': occurence
                    })
                })
                if (!data.ok) {
                    throw Error('Error during the execution of the AI Analyse')
                }
                selenium.value = await data.json()
                consoleLog('AIAnalyse.js/analysePage', 3, '--- seleniumAIAnalyse ---' + url + 'playwright/robot/analyse', trace)
                consoleLog('AIAnalyse.js/analysePage', 3, selenium.value, trace)

            }

        } catch (err) {
            error.value = err.message
            consoleLog('AIAnalyse.js/analysePage', 3, error.value, trace)
        }
    }

    return { error, analysePage }
}

export default AIAnalyse