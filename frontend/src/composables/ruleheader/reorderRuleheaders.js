/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-08
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Reorder all the Rule header
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderRuleheaders = (projectID) => {

    const error = ref(null)

    const reorderTheRuleheaders = async (ruleheaders, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderRuleheaderss.js/reorderTheRuleheaderss', 3, 'LOCAL Database reorder Rule is not implemented', trace)
            } else {
                consoleLog('reorderRuleheaderss.js/reorderTheRuleheaderss', 3,'', trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'ruleheader/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID })
                })

                if (!data.ok) {
                    throw Error('No rule available')
                }
                ruleheaders.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderRuleheaderss.js/reorderTheRuleheaderss', 3, err)
        }
    }

    return { error, reorderTheRuleheaders }
}

export default reorderRuleheaders