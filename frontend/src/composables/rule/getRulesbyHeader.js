/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-08
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get all rules by rule header
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getRulesByHeader = (ruleheaderID) => {

  const error = ref(null)

  const loadRule = async (rules, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getRulesByHeader.js/loadRule', 3, 'LOCAL Database get all rules by header not implemented', trace)
      } else {
        consoleLog('getRulesByHeader.js/loadRule', 3, 'ruleheaderID: '  + ruleheaderID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'rule/header/' + ruleheaderID)
        if (!data.ok) {
          throw Error('no rule available')
        }
        rules.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getRulesByHeader.js/loadRule', 3, error.value, trace)
    }
  }

  return { error, loadRule }
}

export default getRulesByHeader