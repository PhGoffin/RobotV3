/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Rule position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionRules = (ruleID, position) => {

    const error = ref(null)

    const updateThePosition = async (rule, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionRules.js/updateThePosition', 3, 'LOCAL Database Update Rule position not implemented', trace)
            } else {
                consoleLog('updatePositionRules.js/updateThePosition', 3,'ruleID: ' + ruleID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'rule/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'ruleID': ruleID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the rule position')
                }
                rule.value = await data.json()
                consoleLog('updatePositionRules.js/updateThePosition', 3, '--- updatePositionRules ---' + url + 'rule/position', trace)
                consoleLog('updatePositionRules.js/updateThePosition', 3, '--- Message: ' + rule.value.message, trace)
                consoleLog('updatePositionRules.js/updateThePosition', 3, rule.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionRules.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionRules