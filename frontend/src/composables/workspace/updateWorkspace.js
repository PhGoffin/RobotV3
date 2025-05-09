/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-16
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 15:12
 * @Description: Update a workspace
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updateWorkspace = (workspaceID, workspaceName, licenseID, comment, active, userName, today) => {

    const error = ref(null)

    const updateTheWorkspace = async (workspace, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateWorkspace.js/updateTheWorkspace', 3, 'LOCAL Database Update Workspace not implemented', trace)
            } else {
                consoleLog('updateWorkspace.js/updateTheWorkspace', 3,'workspace: ' + workspace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'workspace/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'workspace': workspaceName, 'licenseID': licenseID, 'comment': comment, 'active': active, 'user': userName, 'today': today, 'workspaceID': workspaceID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a workspace')
                }
                workspace.value = await data.json()
                consoleLog('updateWorkspace.js/updateTheWorkspace', 3, '--- updateWorkspace ---' + url + 'workspace/update', trace)
                consoleLog('updateWorkspace.js/updateTheWorkspace', 3, '--- Message: ' + workspace.value.message, trace)
                consoleLog('updateWorkspace.js/updateTheWorkspace', 3, workspace.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateWorkspace.js/updateTheWorkspace', 3, error.value, trace)
        }
    }

    return { error, updateTheWorkspace }
}

export default updateWorkspace