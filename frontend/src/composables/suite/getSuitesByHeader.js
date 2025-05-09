/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get suites by subproject
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getSuitesByHeader = (suiteheaderID) => {

  const error = ref(null)

  const loadSuite = async (suites, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getSuitesByHeader.js/loadSuite', 3, 'LOCAL Database get suite by header not implemented', trace)
      } else {
        consoleLog('getSuitesByHeader.js/loadSuite', 3, 'suiteheaderID:' + suiteheaderID , trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'suite/header', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'suiteheaderID': suiteheaderID })
        })
        if (!data.ok) {
          throw Error('no suite available')
        }
        suites.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getSuitesByHeader.js/loadSuite', 3, error.value, trace)
    }
  }

  return { error, loadSuite }
}

export default getSuitesByHeader