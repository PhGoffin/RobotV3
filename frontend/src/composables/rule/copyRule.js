/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Copy a Rule
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyRule = (ruleID, position) => {

    const error = ref(null)

    const copyTheRule = async (rule, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyRule.js/copyTheRule', 3, 'LOCAL Database Copy Rule not implemented', trace)
            } else {
                consoleLog('copyRule.js/copyTheRule', 3,'ruleID: ' + ruleID + ', Position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'rule/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'ruleID': ruleID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a rule')
                }
                rule.value = await data.json()
                consoleLog('copyRule.js/copyTheRule', 3, '--- copyRule ---' + url + 'rule/copy', trace)
                consoleLog('copyRule.js/copyTheRule', 3, '--- Message: ' + rule.value.message, trace)
                consoleLog('copyRule.js/copyTheRule', 3, rule.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyRule.js/copyTheRule', 3, error.value, trace)
        }
    }

    return { error, copyTheRule }
}

export default copyRule