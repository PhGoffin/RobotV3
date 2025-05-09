
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-16
 * @Last Modified by: 
 * @Last Modified time: 2024-04-16 09:10:50
 * @Description: API functions to import the selector
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const importAI_Selector = (projectID) => {

    const error = ref(null)
    let fileName = "selector.json"

    const importData = async (selector, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('importAI_Selector.js', 3, 'LOCAL Database importAI_Selector not implemented', trace)
            } else {
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aiselector/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'fileName': fileName })
                })
                if (!data.ok) {
                    throw Error('no selector available')
                }
                selector.value = await data.json()
                console.log(selector.value, trace)
            }


        } catch (err) {
            error.value = err.message
            consoleLog('importAI_Selector.js', 3, err, trace)
        }
    }

    return { error, importData }
}

export default importAI_Selector