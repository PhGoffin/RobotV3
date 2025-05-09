/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-29 09:31:51
 * @Description: Get all rules 
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getRulesByProject = (projectID) => {

  const error = ref(null)

  const loadRule = async (rules, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getRulesByProject.js/loadRule', 3, 'LOCAL Database get all rules not implemented', trace)
      } else {
        consoleLog('getRulesByProject.js/loadRule', 3, 'projectID: ' + projectID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'rule/project/' + projectID)
        if (!data.ok) {
          throw Error('no rule available')
        }
        rules.value = await data.json()
        console.log ('Rules: ', rules)
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getRulesByProject.js/loadRule', 3, error.value, trace)
    }
  }

  return { error, loadRule }
}

export default getRulesByProject