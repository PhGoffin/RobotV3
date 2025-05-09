/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-11-21
 * @Last Modified by: 
 * @Last Modified time: 2024-11-21 09:46:25
 * @Description: Update a Rule comment type
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updateCommentType = (ruleID, commentType) => {

    const error = ref(null)

    const updateTheCommentType = async (rule, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateCommentType.js/updateTheCommentType', 3, 'LOCAL Database Update rule commentType not implemented', trace)
            } else {
                consoleLog('updateCommentType.js/updateTheCommentType', 3,'ruleID: ' + ruleID + ', commentType: ' + commentType, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'rule/commentType', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'commentType': commentType, 'ruleID': ruleID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the rule commentType status')
                }
                rule.value = await data.json()
                consoleLog('updateCommentType.js/updateTheCommentType', 3, '--- updateCommentType ---' + url + 'rule/commentType', trace)
                consoleLog('updateCommentType.js/updateTheCommentType', 3, '--- Message: ' + rule.value.message, trace)
                consoleLog('updateCommentType.js/updateTheCommentType', 3, rule.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateCommentType.js/updateTheCommentType', 3, error.value, trace)
        }
    }

    return { error, updateTheCommentType }
}

export default updateCommentType