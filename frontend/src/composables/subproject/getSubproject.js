/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-10
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:15:13
 * @Description: Get detail of a subproject
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getSubproject = (subprojectID) => {

  const error = ref(null)

  const loadSubproject = async (subproject, trace) => {
    try {

      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getSubproject.js/loadSubproject', 3, 'LOCAL Database subproject not implemented', trace)
      } else {
        consoleLog('getSubproject.js/loadSubproject', 3, 'subprojectID: ' + subprojectID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'subproject/' + subprojectID)
        if (!data.ok) {
          throw Error('no subproject available')
        }
        subproject.value = await data.json()
        consoleLog('getSubproject.js/loadSubproject', 3, subproject.value, trace)
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getSubproject.js/loadSubproject', 3,error.value, trace)
    }
  }

  return { error, loadSubproject }
}

export default getSubproject