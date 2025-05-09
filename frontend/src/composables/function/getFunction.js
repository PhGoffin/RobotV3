/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-30
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get detail of a function
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getFunction = (functionID) => {

  const error = ref(null)

  const loadFunction = async (testfunction, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getFunction.js/loadFunction', 3, 'LOCAL Database get a function not implemented', trace)
      } else {
        consoleLog('getFunction.js/loadFunction', 3, 'functionID:' + functionID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'function/' + functionID)
        if (!data.ok) {
          throw Error('no function available')
        }
        testfunction.value = await data.json()
        consoleLog('getFunction.js/loadFunction', 3,  testfunction.value, trace)
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getFunction.js/loadFunction', 3, error.value, trace)
    }
  }

  return { error, loadFunction }
}

export default getFunction