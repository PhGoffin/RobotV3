/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-08
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get all rules by project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getRuleheadersByProject = (projectID) => {

  const error = ref(null)

  const loadRuleheader = async (ruleheaders, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getRuleheadersByProject.js/loadRuleheader', 3, 'LOCAL Database get all rules not implemented', trace)
      } else {
        consoleLog('getRuleheadersByProject.js/loadRuleheader', 3, '', trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'ruleheader/project/' + projectID)
        if (!data.ok) {
          throw Error('no rule available')
        }
        ruleheaders.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getRuleheadersByProject.js/loadRuleheader', 3, error.value, trace)
    }
  }

  return { error, loadRuleheader }
}

export default getRuleheadersByProject