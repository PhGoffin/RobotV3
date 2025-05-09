/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-31
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Reorder all the Datasetheaders
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderDatasetheaders = (subprojectID) => {

    const error = ref(null)

    const reorderTheDatasetheaders = async (datasetheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderDatasetheaders.js/reorderTheDatasetheaders', 3, 'LOCAL Database reorder Datasetheaders is not implemented', trace)
            } else {
                consoleLog('reorderDatasetheaders.js/reorderTheDatasetheaders', 3,'subprojectID: ' + subprojectID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'datasetheader/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subprojectID': subprojectID })
                })

                if (!data.ok) {
                    throw Error('No datasetheader available')
                }
                datasetheader.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderDatasetheaders.js/reorderTheDatasetheaders', 3, err)
        }
    }

    return { error, reorderTheDatasetheaders }
}

export default reorderDatasetheaders