/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-16 
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Load detail of a workspace
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getWorkspace = (workspaceID) => {

    const error = ref(null)

    const loadWorkspace = async (workspace, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getWorkspace.js/loadWorkspace', 3, 'LOCAL Database getWorkspace is not implemented', trace)
            } else {
                consoleLog('getWorkspace.js/loadWorkspace', 3,' workspaceID ' + workspaceID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'workspace/' + workspaceID)
                if (!data.ok) {
                    throw Error('No workspace available')
                }
                workspace.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getWorkspace.js/loadWorkspace', 3, err)
        }
    }

    return { error, loadWorkspace }
}

export default getWorkspace