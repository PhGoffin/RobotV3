/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-12-11
 * @Last Modified by: 
 * @Last Modified time: 2024-12-11 08:39:17
 * @Description: Get details of a performance by story/space
 */

import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const getPerformanceByStory = (projectID, storyheaderID, space) => {

    const error = ref(null)

    const loadPerformance = async (performance, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getPerformanceByStory.js/loadPerformance', 3, 'LOCAL Database get performance by story not implemented', trace)
            } else {
                consoleLog('getPerformanceByStory.js/loadPerformance', 3, 'storyheaderID:' + storyheaderID + ', space:' + space , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'performance/story', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'storyheaderID': storyheaderID, 'space': space })
                })
                if (!data.ok) {
                    consoleLog('getPerformanceByStory.js/loadPerformance - NO DATA!', 3, '', trace)
                    throw Error('no performance available')
                }
                performance.value = await data.json()
                consoleLog('getPerformanceByStory.js/loadPerformance - Result: ', 3, performance.value, trace)
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getPerformanceByStory.js/loadPerformance', 3, error.value, trace)
        }
    }

    return { error, loadPerformance }
}

export default getPerformanceByStory