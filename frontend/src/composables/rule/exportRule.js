/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-06-01
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-06-01 13:16:12
 * @Description: Export rules into a json file
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const exportRule = ( ruleheaderID, filename) => {

    const error = ref(null)

    const exportTheRule = async (rule, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('exportRule.js/exportTheRule', 3, 'LOCAL Database Export Rules not implemented', trace)
            } else {
                consoleLog('exportRule.js/exportTheRule', 3, 'ruleheaderID: ' + ruleheaderID + ', filename: ' + filename, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'rule/export', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'ruleheaderID': ruleheaderID, 'filename': filename  })
                })
                if (!data.ok) {
                    throw Error('Error during the export of the rules')
                }
                rule.value = await data.json()
                consoleLog('exportRule.js/exportTheRule', 3, '--- exportRule ---' + url + 'rule/export', trace)
                consoleLog('exportRule.js/exportTheRule', 3, '--- Message: ' + rule.value.message, trace)
                consoleLog('exportRule.js/exportTheRule', 3, rule.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('exportRule.js/exportTheRule', 3, error.value, trace)
        }
    }

    return { error, exportTheRule }
}

export default exportRule