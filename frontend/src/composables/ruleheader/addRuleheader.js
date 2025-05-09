
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-08
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 14:56
 * @Description: Add a new rule header
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const addRuleheader = (projectID, ruleName, comment, position, active, userName, today) => {

    const error = ref(null)

    const addNewRuleheader = async (ruleheader, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addRuleheader.js/addNewRuleheader', 3, 'LOCAL Database Add rule header not implemented', trace)
            } else {
                consoleLog('addRuleheader.js/addNewRuleheader', 3, 'rule: ' + ruleName + ', active: ' + active, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'ruleheader/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'rule': ruleName, 'comment': comment, 'position': position, 'active': active, 'user': userName, 'today': today })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new rule header')
                }
                ruleheader.value = await data.json()
                consoleLog('addRuleheader.js/addNewRuleheader', 3, '--- createRule ---' + url + 'ruleheader/create', trace)
                consoleLog('addRuleheader.js/addNewRuleheader', 3, '--- Message: ' + ruleheader.value.message, trace)
                consoleLog('addRuleheader.js/addNewRuleheader', 3, ruleheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addRuleheader.js/addNewRuleheader', 3, error.value, trace)
        }
    }

    return { error, addNewRuleheader }
}

export default addRuleheader