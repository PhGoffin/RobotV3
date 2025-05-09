/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-23
 * @Last Modified by: 
 * @Last Modified time: 2024-04-23 11:21:12
 * @Description: AI Statistics
 */


import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const AIStatistic = (projectID, subprojectID, userID, userName, selector, selectorID) => {

    const error = ref(null)

    const generateStatistic = async (selenium, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('AIStatistic.js/generateStatistic', 3, 'LOCAL Database Statistics not implemented', trace)
            } else {
                consoleLog('AIStatistic.js/generateStatistic', 3, 'selector: ' + selector, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'Selenium/robot/statistic', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'subprojectID': subprojectID, 'userID': userID, 'userName': userName, 'selector': selector, 'selectorID': selectorID })
                })
                if (!data.ok) {
                    throw Error('Error during the execution of the AI Statistics')
                }
                selenium.value = await data.json()
                consoleLog('AIStatistic.js/generateStatistic', 3, '--- seleniumAIStatistic ---' + url + 'Selenium/robot/statistic', trace)
                consoleLog('AIStatistic.js/generateStatistic', 3, selenium.value, trace)

            }

        } catch (err) {
            error.value = err.message
            consoleLog('AIStatistic.js/generateStatistic', 3, error.value, trace)
        }
    }

    return { error, generateStatistic }
}

export default AIStatistic