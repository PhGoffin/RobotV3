/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-10
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete a project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteProject = (workspaceID, projectID) => {

    const error = ref(null)

    const deleteTheProject = async (project, trace) => {
        try {

            // simulate delay
            // await new Promise(resolve => {
            //   setTimeout(resolve, 2000)
            // })

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteProject.js/deleteTheProject', 3, 'LOCAL Database delete project not implemented', trace)
            } else {
                consoleLog('deleteProject.js/deleteTheProject', 3, 'workspaceID: ' + workspaceID + ', projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'project/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'workspaceID': workspaceID, 'projectID': projectID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the project')
                }
                project.value = await data.json()
                consoleLog('deleteProject.js/deleteTheProject', 3, '--- deleteProject ---' + url + 'project/delete', trace)
                consoleLog('deleteProject.js/deleteTheProject', 3, '--- Message: ' + project.value.message, trace)
                consoleLog('deleteProject.js/deleteTheProject', 3, project.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteProject.js/deleteTheProject', 3, error.value, trace)
        }
    }

    return { error, deleteTheProject }
}

export default deleteProject