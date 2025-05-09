/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-05-14
 * @Last Modified by: 
 * @Last Modified time: 2024-05-14 09:59:54
 * @Description: Reorder all the Subprojects
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderSubprojects = (projectID) => {

    const error = ref(null)

    const reorderTheSubprojects = async (subproject, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderSubprojects.js/reorderTheSubprojects', 3, 'LOCAL Database reorderSubprojects is not implemented', trace)
            } else {
                consoleLog('reorderSubprojects.js/reorderTheSubprojects', 3,'projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'subproject/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID  })
                })

                if (!data.ok) {
                    throw Error('No subproject available')
                }
                subproject.value = await data.json()
                console.log ('Subproject: ', subproject.value)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderSubprojects.js/reorderTheSubprojects', 3, err)
        }
    }

    return { error, reorderTheSubprojects }
}

export default reorderSubprojects