/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 08:57:25
 * @Description: Update a naturalheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updateNaturalheader = (code, comment, active, naturalheaderID) => {

    const error = ref(null)

    const updateTheNaturalheader = async (naturalheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateNaturalheader.js/updateTheNaturalheader', 3, 'LOCAL Database Update naturalheader not implemented', trace)
            } else {
                consoleLog('updateNaturalheader.js/updateTheNaturalheader', 3, 'naturalheaderID: ' + naturalheaderID + ', code: ' + code, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'naturalheader/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'code': code, 'comment': comment, 'active': active, 'naturalheaderID': naturalheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a naturalheader')
                }
                naturalheader.value = await data.json()
                consoleLog('updateNaturalheader.js/updateTheNaturalheader', 3, '--- updateNaturalheader ---' + url + 'naturalheader/update', trace)
                consoleLog('updateNaturalheader.js/updateTheNaturalheader', 3, '--- Message: ' + naturalheader.value.message, trace)
                consoleLog('updateNaturalheader.js/updateTheNaturalheader', 3, naturalheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateNaturalheader.js/updateTheNaturalheader', 3, error.value, trace)
        }
    }

    return { error, updateTheNaturalheader }
}

export default updateNaturalheader