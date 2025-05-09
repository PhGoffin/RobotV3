/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 11:52:45
 * @Description: Reorder all the natural
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderNatural = (naturalheaderID) => {

    const error = ref(null)

    const reorderTheNatural = async (natural, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderNaturals.js/reorderTheNaturals', 3, 'LOCAL Database reorder natural is not implemented', trace)
            } else {
                consoleLog('reorderNaturals.js/reorderTheNaturals', 3,'naturalheaderID: ' + naturalheaderID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'natural/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'naturalheaderID': naturalheaderID })
                })

                if (!data.ok) {
                    throw Error('No natural available')
                }
                natural.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderNaturals.js/reorderTheNaturals', 3, err)
        }
    }

    return { error, reorderTheNatural }
}

export default reorderNatural