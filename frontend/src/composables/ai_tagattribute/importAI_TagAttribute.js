
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: 
 * @Last Modified time: 2024-04-17 15:47:20
 * @Description: API functions to import the tagattributes
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const importAI_Tagtagattribute = (projectID) => {

    const error = ref(null)
    let fileName = "tagtagattribute.json"

    const importData = async (tagattribute, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('importAI_Tagtagattribute.js', 3, 'LOCAL Database importAI_Tagtagattribute not implemented', trace)
            } else {
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagattribute/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'fileName': fileName })
                })
                if (!data.ok) {
                    throw Error('no tagattribute available')
                }
                tagattribute.value = await data.json()
                console.log(tagattribute.value, trace)
            }


        } catch (err) {
            error.value = err.message
            consoleLog('importAI_Tagtagattribute.js', 3, err, trace)
        }
    }

    return { error, importData }
}

export default importAI_Tagtagattribute