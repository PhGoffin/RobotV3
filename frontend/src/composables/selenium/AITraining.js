/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-19
 * @Last Modified by: Someone
 * @Last Modified time: 2025-05-27 07:57:34
 * @Description: Training analysis of a webpage
 */


import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const AITraining = (projectID, subprojectID, userID, userName, link, targetlink, selector, selectorID, criteria, expected ) => {

    const error = ref(null)

    const analysePage = async (selenium, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('AITraining.js/analysePage', 3, 'LOCAL Database Training Scenario not implemented', trace)
            } else {
                consoleLog('AITraining.js/analysePage', 3, 'targetlink: ' + targetlink + " - " + criteria, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'playwright/robot/training', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'subprojectID': subprojectID, 'userID': userID, 'userName': userName, 'link': link, 'targetlink': targetlink, 'selector': selector, 'selectorID': selectorID, 'criteria': criteria, 'expected': expected })
                })
                if (!data.ok) {
                    throw Error('Error during the execution of the AI Training')
                }
                selenium.value = await data.json()
                consoleLog('AITraining.js/analysePage', 3, '--- seleniumAITraining ---' + url + 'Selenium/robot/training', trace)
                consoleLog('AITraining.js/analysePage', 3, selenium.value, trace)

            }

        } catch (err) {
            error.value = err.message
            consoleLog('AITraining.js/analysePage', 3, error.value, trace)
        }
    }

    return { error, analysePage }
}

export default AITraining