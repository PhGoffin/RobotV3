/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-06
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-06 11:51:11
 * @Description: Update a Rule Result
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updateRuleResult = (ruleID, ruleResult) => {

    const error = ref(null)

    const updateTheResult = async (rule, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateRuleResult.js/updateTheResult', 3, 'LOCAL Database Update Rule result not implemented', trace)
            } else {
                consoleLog('updateRuleResult.js/updateTheResult', 3,'ruleID: ' + ruleID + ', ruleResult: ' + ruleResult, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'rule/result', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'ruleResult': ruleResult, 'ruleID': ruleID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the rule position')
                }
                rule.value = await data.json()
                consoleLog('updateRuleResult.js/updateTheResult', 3, '--- updateRuleResult ---' + url + 'rule/result', trace)
                consoleLog('updateRuleResult.js/updateTheResult', 3, '--- Message: ' + rule.value.message, trace)
                consoleLog('updateRuleResult.js/updateTheResult', 3, rule.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateRuleResult.js/updateTheResult', 3, error.value, trace)
        }
    }

    return { error, updateTheResult }
}

export default updateRuleResult