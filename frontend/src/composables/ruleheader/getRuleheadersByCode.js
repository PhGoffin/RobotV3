/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-08
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get rule header by a rule name
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getRuleheadersByCode = (rule) => {

  const error = ref(null)

  const loadRuleheader = async (ruleheader, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getRuleheadersByCode.js/loadRuleheader', 3, 'LOCAL Database get rule by code not implemented', trace)
      } else {
        consoleLog('getRuleheadersByCode.js/loadRuleheader', 3, 'rule:' + rule , trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'ruleheader/code/' + rule)
        if (!data.ok) {
          throw Error('no rule available')
        }
        ruleheader.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getRuleheadersByCode.js/loadRuleheader', 3, error.value, trace)
    }
  }

  return { error, loadRuleheader }
}

export default getRuleheadersByCode