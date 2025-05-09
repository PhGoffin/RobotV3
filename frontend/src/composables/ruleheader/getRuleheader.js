/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-08
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get detail of a rule header
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getRuleheader = (ruleheaderID) => {

  const error = ref(null)

  const loadRuleheader = async (ruleheader, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getRuleheader.js/loadRuleheader', 3, 'LOCAL Database get a rule not implemented', trace)
      } else {
        consoleLog('getRuleheader.js/loadRuleheader', 3, 'ruleheaderID:' + ruleheaderID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'ruleheader/' + ruleheaderID)
        if (!data.ok) {
          throw Error('no rule available')
        }
        ruleheader.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getRuleheader.js/loadRuleheader', 3, error.value, trace)
    }
  }

  return { error, loadRuleheader }
}

export default getRuleheader