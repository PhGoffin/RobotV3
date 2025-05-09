/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Reorder all the Rule
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderRules = (ruleheaderID) => {

    const error = ref(null)

    const reorderTheRule = async (rules, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderRuless.js/reorderTheRules', 3, 'LOCAL Database reorder Rule is not implemented', trace)
            } else {
                consoleLog('reorderRuless.js/reorderTheRules', 3,'', trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'rule/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'ruleheaderID': ruleheaderID })
                })

                if (!data.ok) {
                    throw Error('No rule available')
                }
                rules.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderRuless.js/reorderTheRules', 3, err)
        }
    }

    return { error, reorderTheRule }
}

export default reorderRules