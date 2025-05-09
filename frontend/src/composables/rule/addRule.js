
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:12:31
 * @Description: Add a new rule
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

// rule, continue, condition, result, message, comment, position, active
const addRule = (projectID, ruleheaderID, ruleContinue, condition, result, message, comment, position, active) => {

    const error = ref(null)

    const addNewRule = async (rule, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addRule.js/addNewRule', 3, 'LOCAL Database Add rule not implemented', trace)
            } else {
                consoleLog('addRule.js/addNewRule', 3, 'condition: ' + condition + ', result: ' + result + ', active: ' + active, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'rule/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'ruleheaderID': ruleheaderID, 'continue': ruleContinue, 'condition': condition, 'result': result, 'message': message, 'comment': comment, 'position': position, 'active': active })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new rule')
                }
                rule.value = await data.json()
                consoleLog('addRule.js/addNewRule', 3, '--- createRule ---' + url + 'rule/create', trace)
                consoleLog('addRule.js/addNewRule', 3, '--- Message: ' + rule.value.message, trace)
                consoleLog('addRule.js/addNewRule', 3, rule.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addRule.js/addNewRule', 3, error.value, trace)
        }
    }

    return { error, addNewRule }
}

export default addRule