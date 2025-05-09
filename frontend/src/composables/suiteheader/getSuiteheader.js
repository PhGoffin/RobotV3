/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get detail of a suiteheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getSuiteheader = (suiteheaderID) => {

  const error = ref(null)

  const loadSuiteheader = async (suiteheader, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getSuiteheader.js/loadSuiteheader', 3, 'LOCAL Database get a suiteheader not implemented', trace)
      } else {
        consoleLog('getSuiteheader.js/loadSuiteheader', 3, 'suiteheaderID:' + suiteheaderID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'suiteheader/' + suiteheaderID)
        if (!data.ok) {
          throw Error('no suiteheader available')
        }
        suiteheader.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getSuiteheader.js/loadSuiteheader', 3, error.value, trace)
    }
  }

  return { error, loadSuiteheader }
}

export default getSuiteheader