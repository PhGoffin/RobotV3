/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-08
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Copy all Rules from the same ruleheader
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteAllRules = (ruleheaderID) => {

    const error = ref(null)

    const deleteTheRule = async (rule, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteAllRules.js/deleteTheRule', 3, 'LOCAL Database Delete All Rules not implemented', trace)
            } else {
                consoleLog('deleteAllRules.js/deleteTheRule', 3,'ruleheaderID: ' + ruleheaderID, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'rule/fulldelete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'ruleheaderID': ruleheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the full delete of rules')
                }
                rule.value = await data.json()
                consoleLog('deleteAllRules.js/deleteTheRule', 3, '--- deleteAllRules ---' + url + 'rule/fulldelete', trace)
                consoleLog('deleteAllRules.js/deleteTheRule', 3, '--- Message: ' + rule.value.message, trace)
                consoleLog('deleteAllRules.js/deleteTheRule', 3, rule.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteAllRules.js/deleteTheRule', 3, error.value, trace)
        }
    }

    return { error, deleteTheRule }
}

export default deleteAllRules