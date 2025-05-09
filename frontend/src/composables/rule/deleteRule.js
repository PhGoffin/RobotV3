/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-31
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete a rule
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteRule = (ruleID) => {

    const error = ref(null)

    const deleteTheRule = async (rule, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteRule.js/deleteTheRule', 3, 'LOCAL Database delete rule not implemented', trace)
            } else {
                consoleLog('deleteRule.js/deleteTheRule', 3, 'ruleID: ' + ruleID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'rule/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'ruleID': ruleID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the rule')
                }
                rule.value = await data.json()
                consoleLog('deleteRule.js/deleteTheRule', 3, '--- deleteRule ---' + url + 'rule/delete', trace)
                consoleLog('deleteRule.js/deleteTheRule', 3, '--- Message: ' + rule.value.message, trace)
                consoleLog('deleteRule.js/deleteTheRule', 3, rule.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteRule.js/deleteTheRule', 3, error.value, trace)
        }
    }

    return { error, deleteTheRule }
}

export default deleteRule