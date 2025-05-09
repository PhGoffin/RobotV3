
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-09
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 08:47:51
 * @Description: Add a new naturalheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addNaturalheader = (code, comment, position, active) => {

    const error = ref(null)

    const addNewNaturalheader = async (naturalheader, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addNaturalheader.js/addNewNaturalheader', 3, 'LOCAL Database Add naturalheader not implemented', trace)
            } else {
                consoleLog('addNaturalheader.js/addNewNaturalheader', 3, 'code: ' + code + ', active: ' + active, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'naturalheader/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'code': code, 'comment': comment, 'position': position, 'active': active })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new naturalheader')
                }
                naturalheader.value = await data.json()
                consoleLog('addNaturalheader.js/addNewNaturalheader', 3, '--- createNaturalheader ---' + url + 'naturalheader/create', trace)
                consoleLog('addNaturalheader.js/addNewNaturalheader', 3, '--- Message: ' + naturalheader.value.message, trace)
                consoleLog('addNaturalheader.js/addNewNaturalheader', 3, naturalheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addNaturalheader.js/addNewNaturalheader', 3, error.value, trace)
        }
    }

    return { error, addNewNaturalheader }
}

export default addNaturalheader