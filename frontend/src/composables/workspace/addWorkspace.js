/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-16
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 15:11
 * @Description: Add a new workspace
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addWorkspace = (workspaceName, licenseID, comment, active, userName, today) => {

    const error = ref(null)

    const addNewWorkspace = async (workspace, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addWorkspace.js/addNewWorkspace', 3, 'LOCAL Database Add Workspace not implemented', trace)
            } else {
                consoleLog('addWorkspace.js/addNewWorkspace', 3,'workspace: ' + workspace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'workspace/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'licenseID': licenseID, 'workspace': workspaceName, 'comment': comment, 'active': active, 'user': userName, 'today': today })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a workspace')
                }
                workspace.value = await data.json()
                consoleLog('addWorkspace.js/addNewWorkspace', 3, '--- createWorkspace ---' + url + 'workspace/create', trace)
                consoleLog('addWorkspace.js/addNewWorkspace', 3, '--- Message: ' + workspace.value.message, trace)
                consoleLog('addWorkspace.js/addNewWorkspace', 3, workspace.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addWorkspace.js/addNewWorkspace', 3, error.value, trace)
        }
    }

    return { error, addNewWorkspace }
}

export default addWorkspace