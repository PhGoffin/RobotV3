/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-12-09
 * @Last Modified by: 
 * @Last Modified time: 2024-12-10 07:46:30
 * @Description: Update a performance
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updatePerformance = (projectID, scenarioID, space, topic, sequenceID, measure) => {

    const error = ref(null)
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
    const year = currentDate.getFullYear();
    let today = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year


    const updateThePerformance = async (performance, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePerformance.js/updateThePerformance', 3, 'LOCAL Database Update performance not implemented', trace)
            } else {
                consoleLog('updatePerformance.js/updateThePerformance', 3, 'space: ' + space + ', topic: ' + topic + ', sequenceID: ' + sequenceID + ', measure: ' + measure, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'performance/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'measure': measure, 'created': today, 'projectID': projectID, 'scenarioID': scenarioID, 'space': space, 'topic': topic, 'sequenceID': sequenceID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a performance')
                }
                performance.value = await data.json()
                consoleLog('updatePerformance.js/updateThePerformance', 3, '--- updatePerformance ---' + url + 'refernce/update', trace)
                consoleLog('updatePerformance.js/updateThePerformance', 3, '--- Message: ' + performance.value.message, trace)
                consoleLog('updatePerformance.js/updateThePerformance', 3, performance.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePerformance.js/updateThePerformance', 3, error.value, trace)
        }
    }

    return { error, updateThePerformance }
}

export default updatePerformance