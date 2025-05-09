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


const copyAllRules = (ruleheaderIDCopy, ruleheaderIDOrigin) => {

    const error = ref(null)

    const copyTheRule = async (rule, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyAllRules.js/copyTheRule', 3, 'LOCAL Database Copy All Rules not implemented', trace)
            } else {
                consoleLog('copyAllRules.js/copyTheRule', 3,'ruleheaderIDCopy: ' + ruleheaderIDCopy + ', ruleheaderIDOrigin: ' + ruleheaderIDOrigin, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'rule/fullcopy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'ruleheaderIDCopy': ruleheaderIDCopy, 'ruleheaderIDOrigin': ruleheaderIDOrigin })
                })
                if (!data.ok) {
                    throw Error('Error during the full copy of rules')
                }
                rule.value = await data.json()
                consoleLog('copyAllRules.js/copyTheRule', 3, '--- copyAllRules ---' + url + 'rule/fullcopy', trace)
                consoleLog('copyAllRules.js/copyTheRule', 3, '--- Message: ' + rule.value.message, trace)
                consoleLog('copyAllRules.js/copyTheRule', 3, rule.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyAllRules.js/copyTheRule', 3, error.value, trace)
        }
    }

    return { error, copyTheRule }
}

export default copyAllRules