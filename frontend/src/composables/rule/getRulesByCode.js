/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-29 10:56:10
 * @Description: Get rule by project
 */

import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const getRulesByCode = (projectID, ruleName) => {

  const error = ref(null)

  const loadRule = async (rule, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getRulesByCode.js/loadRule', 3, 'LOCAL Database get rule by code not implemented', trace)
      } else {
        consoleLog('getRulesByCode.js/getRulesByCode', 3, 'rule:' + ruleName, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'rule/code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 'projectID': projectID, 'ruleName': ruleName })
        })

        console.log ('Data: ', data)
        if (!data.ok) {
          throw Error('no rule available')
        }
        rule.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getRulesByCode.js/loadRule', 3, error.value, trace)
    }
  }

  return { error, loadRule }
}

export default getRulesByCode