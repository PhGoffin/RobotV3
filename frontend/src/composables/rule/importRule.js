/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-29
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-29 11:48:28
 * @Description: Import all Rules from another project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const importRule = (currentProjectID, currentRuleheaderID, projectID, ruleheaderID) => {

    const error = ref(null)

    const importTheRule = async (rule, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('importRule.js/importTheRule', 3, 'LOCAL Database Import All Rules not implemented', trace)
            } else {
                consoleLog('importRule.js/importTheRule', 3,'currentProjectID: ' + currentProjectID + ', projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'rule/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'currentProjectID': currentProjectID, 'currentRuleheaderID': currentRuleheaderID, 'projectID': projectID, 'ruleheaderID': ruleheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the import of rules')
                }
                rule.value = await data.json()
                consoleLog('importRule.js/importTheRule', 3, '--- importRule ---' + url + 'rule/import', trace)
                consoleLog('importRule.js/importTheRule', 3, '--- Message: ' + rule.value.message, trace)
                consoleLog('importRule.js/importTheRule', 3, rule.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('importRule.js/importTheRule', 3, error.value, trace)
        }
    }

    return { error, importTheRule }
}

export default importRule