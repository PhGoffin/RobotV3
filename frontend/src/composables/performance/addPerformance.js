
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-12-09
 * @Last Modified by: 
 * @Last Modified time: 2024-12-10 07:43:38
 * @Description: Add a new performance
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addPerformance = (projectID, scenarioID, space, topic, sequenceID, created, measure) => {

    // const project = ref(null)
    const error = ref(null)

    const addNewPerformance = async (performance, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addPerformance.js/addNewPerformance', 3, 'LOCAL Database Add performance not implemented', trace)
            } else {
                consoleLog('addPerformance.js/addNewPerformance', 3, 'scenarioID: ' + scenarioID + ', space: ' + space + ', topic: ' + topic + ', measure: ' + measure + ', sequence: ' + sequenceID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'performance/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID':projectID, 'scenarioID': scenarioID, 'space': space, 'topic': topic, 'created': created, 'sequenceID': sequenceID, 'measure': measure })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new performance')
                }
                performance.value = await data.json()
                consoleLog('addPerformance.js/addNewPerformance', 3, '--- createPerformance ---' + url + 'performance/create', trace)
                consoleLog('addPerformance.js/addNewPerformance', 3, '--- Message: ' + performance.value.message, trace)
                consoleLog('addPerformance.js/addNewPerformance', 3, performance.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addPerformance.js/addNewPerformance', 3, error.value, trace)
        }
    }

    return { error, addNewPerformance }
}

export default addPerformance