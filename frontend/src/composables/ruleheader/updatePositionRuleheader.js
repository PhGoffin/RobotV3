/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-08
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Rule header position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionRuleheader = (ruleheaderID, position) => {

    const error = ref(null)

    const updateThePosition = async (ruleheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionRuleheader.js/updateThePosition', 3, 'LOCAL Database Update Rule position not implemented', trace)
            } else {
                consoleLog('updatePositionRuleheader.js/updateThePosition', 3,'ruleheaderID: ' + ruleheaderID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'ruleheader/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'ruleheaderID': ruleheaderID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the rule header position')
                }
                ruleheader.value = await data.json()
                consoleLog('updatePositionRuleheader.js/updateThePosition', 3, '--- updatePositionRuleheader ---' + url + 'ruleheader/position', trace)
                consoleLog('updatePositionRuleheader.js/updateThePosition', 3, '--- Message: ' + ruleheader.value.message, trace)
                consoleLog('updatePositionRuleheader.js/updateThePosition', 3, ruleheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionRuleheader.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionRuleheader