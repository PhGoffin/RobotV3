
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: 
 * @Last Modified time: 2024-04-15 14:43:13
 * @Description: API functions to import the attributes
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const importAI_Attribute = (projectID) => {

    const error = ref(null)
    let fileName = "attribute.json"

    const importData = async (attribute, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('importAI_Attribute.js', 3, 'LOCAL Database importAI_Attribute not implemented', trace)
            } else {
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aiattribute/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'fileName': fileName })
                })
                if (!data.ok) {
                    throw Error('no attribute available')
                }
                attribute.value = await data.json()
                console.log(attribute.value, trace)
            }


        } catch (err) {
            error.value = err.message
            consoleLog('importAI_Attribute.js', 3, err, trace)
        }
    }

    return { error, importData }
}

export default importAI_Attribute