/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-29
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-29 12:10:37
 * @Description: Import Rule header from another project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const importRuleheader = (ruleName, currentProjectID, projectID, ruleheaderID) => {

    const error = ref(null)

    const importTheRule = async (rule, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('importRuleheader.js/importTheRule', 3, 'LOCAL Database Import Rule header not implemented', trace)
            } else {
                consoleLog('importRuleheader.js/importTheRule', 3,'currentProjectID: ' + currentProjectID + ', projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'ruleheader/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'ruleName': ruleName, 'currentProjectID': currentProjectID, 'projectID': projectID, 'ruleheaderID': ruleheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the import of rule header')
                }
                rule.value = await data.json()
                consoleLog('importRuleheader.js/importTheRule', 3, '--- importRuleheader ---' + url + 'ruleheader/import', trace)
                consoleLog('importRuleheader.js/importTheRule', 3, '--- Message: ' + rule.value.message, trace)
                consoleLog('importRuleheader.js/importTheRule', 3, rule.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('importRuleheader.js/importTheRule', 3, error.value, trace)
        }
    }

    return { error, importTheRule }
}

export default importRuleheader