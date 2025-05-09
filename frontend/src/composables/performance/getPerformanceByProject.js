/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-12-13
 * @Last Modified by: 
 * @Last Modified time: 2024-12-13 10:00:32
 * @Description: Get performances by project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getPerformanceByProject = (performanceID) => {

  const error = ref(null)

  const loadPerformance = async (performance, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getPerformanceByProject.js/loadPerformance', 3, 'LOCAL Database get performance by project not implemented', trace)
      } else {
        consoleLog('getPerformanceByProject.js/loadPerformance', 3, 'performanceID:' + performanceID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'performance/project/' + performanceID)
        if (!data.ok) {
          throw Error('no performance available')
        }
        performance.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getPerformanceByProject.js/loadPerformance', 3, error.value, trace)
    }
  }

  return { error, loadPerformance }
}

export default getPerformanceByProject