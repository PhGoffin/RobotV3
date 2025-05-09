/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-08
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 14:58
 * @Description: Update a rule
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updateRuleheader = (ruleName, comment, active, ruleheaderID, userName, today) => {

    const error = ref(null)

    const updateTheRuleheader = async (ruleheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateRuleheader.js/updateTheRuleheader', 3, 'LOCAL Database Update rule not implemented', trace)
            } else {
                consoleLog('updateRuleheader.js/updateTheRuleheader', 3, 'ruleheaderID: ' + ruleheaderID  + ', rule: ' + ruleName, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'ruleheader/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'rule': ruleName, 'comment':comment, 'active': active, 'user': userName, 'today': today, 'ruleheaderID': ruleheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a rule header')
                }
                ruleheader.value = await data.json()
                consoleLog('updateRuleheader.js/updateTheRuleheader', 3, '--- updateRuleheader ---' + url + 'ruleheader/update', trace)
                consoleLog('updateRuleheader.js/updateTheRuleheader', 3, '--- Message: ' + ruleheader.value.message, trace)
                consoleLog('updateRuleheader.js/updateTheRuleheader', 3, ruleheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateRuleheader.js/updateTheRuleheader', 3, error.value, trace)
        }
    }

    return { error, updateTheRuleheader }
}

export default updateRuleheader