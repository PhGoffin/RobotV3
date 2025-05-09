/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-12-11
 * @Last Modified by: 
 * @Last Modified time: 2024-12-11 08:40:42
 * @Description: Get details of a performance by story/step/space
 */

import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const getPerformanceByStep = (projectID, storyheaderID, storyID, space) => {

    const error = ref(null)

    const loadPerformance = async (performance, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getPerformanceByStep.js/loadPerformance', 3, 'LOCAL Database get performance by story not implemented', trace)
            } else {
                consoleLog('getPerformanceByStep.js/loadPerformance', 3, 'storyID:' + storyID + ', space:' + space , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'performance/step', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'storyheaderID': storyheaderID, 'storyID': storyID, 'space': space })
                })
                if (!data.ok) {
                    consoleLog('getPerformanceByStep.js/loadPerformance - NO DATA!', 3, '', trace)
                    throw Error('no performance available')
                }
                performance.value = await data.json()
                consoleLog('getPerformanceByStep.js/loadPerformance - Result: ', 3, performance.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getPerformanceByStep.js/loadPerformance', 3, error.value, trace)
        }
    }

    return { error, loadPerformance }
}

export default getPerformanceByStep