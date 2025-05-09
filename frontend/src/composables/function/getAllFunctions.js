/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-30
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get all the functions
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAllFunctions = () => {

  const error = ref(null)

  const loadFunction = async (testfunctions, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getAllFunctions.js/loadFunction', 3, 'LOCAL Database get all functions not implemented', trace)
      } else {
        consoleLog('getAllFunctions.js/loadFunction', 3, '', trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'function')
        if (!data.ok) {
          throw Error('no function available')
        }
        testfunctions.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getAllFunctions.js/loadFunction', 3, error.value, trace)
    }
  }

  return { error, loadFunction }
}

export default getAllFunctions