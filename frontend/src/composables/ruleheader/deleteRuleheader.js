/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-08
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete a rule header
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteRuleheader = (ruleheaderID) => {

    const error = ref(null)

    const deleteTheRuleheader = async (ruleheader, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteRuleheader.js/deleteTheRuleheader', 3, 'LOCAL Database delete rule header not implemented', trace)
            } else {
                consoleLog('deleteRuleheader.js/deleteTheRuleheader', 3, 'ruleheaderID: ' + ruleheaderID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'ruleheader/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'ruleheaderID': ruleheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the rule')
                }
                ruleheader.value = await data.json()
                consoleLog('deleteRuleheader.js/deleteTheRuleheader', 3, '--- deleteRuleheader ---' + url + 'ruleheader/delete', trace)
                consoleLog('deleteRuleheader.js/deleteTheRuleheader', 3, '--- Message: ' + ruleheader.value.message, trace)
                consoleLog('deleteRuleheader.js/deleteTheRuleheader', 3, ruleheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteRuleheader.js/deleteTheRuleheader', 3, error.value, trace)
        }
    }

    return { error, deleteTheRuleheader }
}

export default deleteRuleheader