/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-05-31
 * @Last Modified by: 
 * @Last Modified time: 2024-05-31 15:06:45
 * @Description: Update a Rule active status
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updateActive = (ruleID, active) => {

    const error = ref(null)

    const updateTheActive = async (rule, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateActive.js/updateTheActive', 3, 'LOCAL Database Update rule active not implemented', trace)
            } else {
                consoleLog('updateActive.js/updateTheActive', 3,'ruleID: ' + ruleID + ', active: ' + active, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'rule/active', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'active': active, 'ruleID': ruleID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the rule active status')
                }
                rule.value = await data.json()
                consoleLog('updateActive.js/updateTheActive', 3, '--- updateActive ---' + url + 'rule/active', trace)
                consoleLog('updateActive.js/updateTheActive', 3, '--- Message: ' + rule.value.message, trace)
                consoleLog('updateActive.js/updateTheActive', 3, rule.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateActive.js/updateTheActive', 3, error.value, trace)
        }
    }

    return { error, updateTheActive }
}

export default updateActive