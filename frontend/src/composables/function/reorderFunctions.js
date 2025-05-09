/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-30
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Reorder all the Functions
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderFunctions = () => {

    const error = ref(null)

    const reorderTheFunctions = async (testfunction, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderFunctions.js/reorderTheFunctions', 3, 'LOCAL Database reorder functions is not implemented', trace)
            } else {
                consoleLog('reorderFunctions.js/reorderTheFunctions', 3,'', trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'function/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ })
                })


                if (!data.ok) {
                    throw Error('No function available')
                }
                testfunction.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderFunctions.js/reorderTheFunctions', 3, err)
        }
    }

    return { error, reorderTheFunctions }
}

export default reorderFunctions