/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-16
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Delete a workspace
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteWorkspace = (workspaceID) => {

    const error = ref(null)

    const deleteTheWorkspace = async (workspace, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteWorkspace.js/deleteTheWorkspace', 3, 'LOCAL Database Delete Workspace not implemented', trace)
            } else {
                consoleLog('deleteWorkspace.js/deleteTheWorkspace', 3,'workspaceID: ' + workspaceID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'workspace/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'workspaceID': workspaceID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of a workspace')
                }
                workspace.value = await data.json()
                consoleLog('deleteWorkspace.js/deleteTheWorkspace', 3,'--- deleteWorkspace ---' + url + 'workspace/delete', trace)
                consoleLog('deleteWorkspace.js/deleteTheWorkspace', 3,'--- Message: ' + workspace.value.message, trace)
                consoleLog('deleteWorkspace.js/deleteTheWorkspace', 3,workspace.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteWorkspace.js/deleteTheWorkspace', 3, error.value, trace)
        }
    }

    return { error, deleteTheWorkspace }
}

export default deleteWorkspace