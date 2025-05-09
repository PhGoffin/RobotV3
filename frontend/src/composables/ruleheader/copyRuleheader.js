/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-08
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 14:57
 * @Description: Copy a Rule header
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyRuleheaderheader = (ruleheaderID, position, userName, today) => {

    const error = ref(null)

    const copyTheRuleheader = async (ruleheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyRuleheader.js/copyTheRule', 3, 'LOCAL Database Copy Rule header not implemented', trace)
            } else {
                consoleLog('copyRuleheader.js/copyTheRule', 3,'ruleheaderID: ' + ruleheaderID + ', Position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'ruleheader/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'user': userName, 'today': today, 'ruleheaderID': ruleheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a rule header')
                }
                ruleheader.value = await data.json()
                consoleLog('copyRuleheader.js/copyTheRule', 3, '--- copyRuleheader ---' + url + 'ruleheader/copy', trace)
                consoleLog('copyRuleheader.js/copyTheRule', 3, '--- Message: ' + ruleheader.value.message, trace)
                consoleLog('copyRuleheader.js/copyTheRule', 3, ruleheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyRuleheader.js/copyTheRule', 3, error.value, trace)
        }
    }

    return { error, copyTheRuleheader }
}

export default copyRuleheaderheader