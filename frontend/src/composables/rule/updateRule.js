/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: 
 * @Last Modified time: 2024-11-21 10:16:45
 * @Description: Update a rule
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updateRule = (ruleContinue, ruleCondition, ruleResult, ruleMessage, comment, commentType, active, ruleID) => {

    const error = ref(null)

    const updateTheRule = async (rule, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateRule.js/updateTheRule', 3, 'LOCAL Database Update rule not implemented', trace)
            } else {
                consoleLog('updateRule.js/updateTheRule', 3, 'ruleID: ' + ruleID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'rule/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'continue': ruleContinue, 'condition': ruleCondition, 'result': ruleResult, 
                    'message': ruleMessage, 'comment':comment, 'commentType':commentType, 'active': active, 'ruleID': ruleID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a rule')
                }
                rule.value = await data.json()
                consoleLog('updateRule.js/updateTheRule', 3, '--- updateRule ---' + url + 'rule/update', trace)
                consoleLog('updateRule.js/updateTheRule', 3, '--- Message: ' + rule.value.message, trace)
                consoleLog('updateRule.js/updateTheRule', 3, rule.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateRule.js/updateTheRule', 3, error.value, trace)
        }
    }

    return { error, updateTheRule }
}

export default updateRule