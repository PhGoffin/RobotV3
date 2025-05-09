
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: 
 * @Last Modified time: 2024-04-15 16:13:21
 * @Description: API functions to import the paths
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const importAI_Path = (projectID) => {

    const error = ref(null)
    let fileName = "path.json"

    const importData = async (path, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('importAI_Path.js', 3, 'LOCAL Database import AI_Path not implemented', trace)
            } else {
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aipath/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'fileName': fileName })
                })
                if (!data.ok) {
                    throw Error('no path available')
                }
                path.value = await data.json()
                console.log(path.value, trace)
            }


        } catch (err) {
            error.value = err.message
            consoleLog('importAI_Path.js', 3, err, trace)
        }
    }

    return { error, importData }
}

export default importAI_Path