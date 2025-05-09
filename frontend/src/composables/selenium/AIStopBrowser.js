/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-16
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-30 09:33:32
 * @Description: Analyse: Stop (quit) the browser
 */


import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const AIStopBrowser = () => {

    const error = ref(null)

    const StopBrowser = async (selenium, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('AIStopBrowser.js/StopBrowser', 3, 'LOCAL Database Analysis Scenario not implemented', trace)
            } else {
                consoleLog('AIStopBrowser.js/StopBrowser', 3, 'AIStopBrowser', trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'Selenium/robot/stopbrowser')
                if (!data.ok) {
                    throw Error('Error during the execution of the stop browser')
                }
                selenium.value = await data.json()
                consoleLog('AIStopBrowser.js/StopBrowser', 3, '--- seleniumAIStopBrowser ---' + url + 'Selenium/robot/stopbrowser', trace)
                consoleLog('AIStopBrowser.js/StopBrowser', 3, selenium.value, trace)

            }

        } catch (err) {
            error.value = err.message
            consoleLog('AIStopBrowser.js/StopBrowser', 3, error.value, trace)
        }
    }

    return { error, StopBrowser }
}

export default AIStopBrowser