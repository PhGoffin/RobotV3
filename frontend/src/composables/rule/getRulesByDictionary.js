/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-06
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-06 15:06:20
 * @Description: Get all rules that includes a word dictionary in the ruleResult 
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getRulesByDictionary = (projectID, word) => {

  const error = ref(null)

  const loadRule = async (rules, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getRulesByDictionary.js/loadRule', 3, 'LOCAL Database get all rules by dictionary not implemented', trace)
      } else {
        consoleLog('getRulesByDictionary.js/loadRule', 3, 'projectID: ' + projectID + ', word: ' + word, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'rule/dictionary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'projectID': projectID, 'word': word  })
        })

        if (!data.ok) {
          throw Error('no rule available')
        }
        rules.value = await data.json()
        //console.log ('Rules: ', rules)
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getRulesByDictionary.js/loadRule', 3, error.value, trace)
    }
  }

  return { error, loadRule }
}

export default getRulesByDictionary