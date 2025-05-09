/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-12-09
 * @Last Modified by: 
 * @Last Modified time: 2024-12-10 07:44:47
 * @Description: Get max sequence of a performance by scenario/space/topic
 */

import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const getMaxPerformance = (projectID, scenarioID, space, topic) => {

    const error = ref(null)

    const loadPerformance = async (performance, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getMaxPerformance.js/loadPerformance', 3, 'LOCAL Database get max performance not implemented', trace)
            } else {
                consoleLog('getMaxPerformance.js/loadPerformance', 3, 'scenarioID:' + scenarioID + ', space:' + space + ', topic: ' + topic , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'performance/max', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'scenarioID': scenarioID, 'space': space, 'topic': topic })
                })
                if (!data.ok) {
                    consoleLog('getMaxPerformance.js/loadPerformance - NO DATA!', 3, '', trace)
                    throw Error('no performance available')
                }
                performance.value = await data.json()
                consoleLog('getMaxPerformance.js/loadPerformance - Result: ', 3, performance.value, trace)
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getMaxPerformance.js/loadPerformance', 3, error.value, trace)
        }
    }

    return { error, loadPerformance }
}

export default getMaxPerformance