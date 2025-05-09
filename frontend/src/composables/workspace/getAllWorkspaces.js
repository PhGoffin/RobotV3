/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-10
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:30:52
 * @Description: Get all the workspaces
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAllWorkspaces = () => {

    const error = ref(null)

    const loadWorkspaces = async (workspaces, trace) => {
        try {

            // simulate delay
            // await new Promise(resolve => {
            //   setTimeout(resolve, 2000)
            // })

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAllWorkspaces.js/loadWorkspaces', 3, 'LOCAL Database workspace not implemented!', trace)
            } else {
                //console.log('MySQL workspace')
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'workspace' )
                if (!data.ok) {
                    throw Error('no workspace available')
                }
                workspaces.value = await data.json()
                //workspaces.value = workspaces.value.data
                consoleLog('getAllWorkspaces.js/loadWorkspaces', 3, workspaces.value, trace)

            }


        } catch (err) {
            error.value = err.message
            consoleLog('getAllWorkspaces.js/loadWorkspaces', 3, error.value, trace)
        }
    }

    return { error, loadWorkspaces }
}

export default getAllWorkspaces