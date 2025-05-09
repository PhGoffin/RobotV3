/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-05
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get suiteheaders by subproject
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getSuiteheadersBySubproject = (subprojectID) => {

  const error = ref(null)

  const loadSuiteheader = async (suiteheaders, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getSuiteheadersBySubproject.js/loadSuiteheader', 3, 'LOCAL Database get suiteheader by subproject not implemented', trace)
      } else {
        consoleLog('getSuiteheadersBySubproject.js/loadSuiteheader', 3, 'subprojectID:' + subprojectID , trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'suiteheader/subproject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'subprojectID': subprojectID })
        })
        if (!data.ok) {
          throw Error('no suiteheader available')
        }
        suiteheaders.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getSuiteheadersBySubproject.js/loadSuiteheader', 3, error.value, trace)
    }
  }

  return { error, loadSuiteheader }
}

export default getSuiteheadersBySubproject