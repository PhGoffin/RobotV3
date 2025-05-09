/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-12-09
 * @Last Modified by: 
 * @Last Modified time: 2024-12-10 07:46:07
 * @Description: Get details of a performance bu a sequence
 */

import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const getPerformanceBySequence = (projectID, scenarioID, space, topic, sequenceID) => {

    const error = ref(null)

    const loadPerformance = async (performance, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getPerformanceBySequence.js/loadPerformance', 3, 'LOCAL Database get performance by code not implemented', trace)
            } else {
                consoleLog('getPerformanceBySequence.js/loadPerformance', 3, 'scenarioID:' + scenarioID + ', space:' + space + ', topic:' + topic + ', sequenceID:' + sequenceID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'performance/code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'scenarioID': scenarioID, 'space': space, 'topic': topic, 'sequenceID': sequenceID })
                })
                if (!data.ok) {
                    consoleLog('getPerformanceBySequence.js/loadPerformance - NO DATA!', 3, '', trace)
                    throw Error('no performance available')
                }
                performance.value = await data.json()
                consoleLog('getPerformanceBySequence.js/loadPerformance - Result: ', 3, performance.value, trace)
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getPerformanceBySequence.js/loadPerformance', 3, error.value, trace)
        }
    }

    return { error, loadPerformance }
}

export default getPerformanceBySequence