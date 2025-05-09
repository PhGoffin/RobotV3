/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get detail of a rule
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getRule = (ruleID) => {

  const error = ref(null)

  const loadRule = async (rule, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getRule.js/loadRule', 3, 'LOCAL Database get a rule not implemented', trace)
      } else {
        consoleLog('getRule.js/loadRule', 3, 'ruleID:' + ruleID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'rule/' + ruleID)
        if (!data.ok) {
          throw Error('no rule available')
        }
        rule.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getRule.js/loadRule', 3, error.value, trace)
    }
  }

  return { error, loadRule }
}

export default getRule