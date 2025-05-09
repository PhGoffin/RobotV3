/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-12-09
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get detail of a performance
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getPerformance = (performanceID) => {

  const error = ref(null)

  const loadPerformance = async (performance, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getPerformance.js/loadPerformance', 3, 'LOCAL Database get a performance not implemented', trace)
      } else {
        consoleLog('getPerformance.js/loadPerformance', 3, 'performanceID:' + performanceID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'performance/' + performanceID)
        if (!data.ok) {
          throw Error('no performance available')
        }
        performance.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getPerformance.js/loadPerformance', 3, error.value, trace)
    }
  }

  return { error, loadPerformance }
}

export default getPerformance