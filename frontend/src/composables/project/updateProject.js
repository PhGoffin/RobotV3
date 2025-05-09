/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-10
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 16:22
 * @Description: Update a project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updateProject = (projectID, workspaceID, projectName, libraryID, comment, userName, today) => {

    // const project = ref(null)
    const error = ref(null)

    const updateTheProject = async (project, trace) => {
        try {

            // simulate delay
            // await new Promise(resolve => {
            //   setTimeout(resolve, 2000)
            // })

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateProject.js/updateTheProject', 3, 'LOCAL Database Update project not implemented', trace)
            } else {
                consoleLog('updateProject.js/updateTheProject', 3, 'workspaceID: ' + workspaceID + ', project: ' + projectName + ', libraryID: ' + libraryID + ', comment: ' + comment + ', projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'project/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'workspaceID': workspaceID, 'project': projectName, 'libraryID': libraryID, 'comment': comment, 'user': userName, 'today': today, 'projectID': projectID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a project')
                }
                project.value = await data.json()
                consoleLog('updateProject.js/updateTheProject', 3, '--- updateProject ---' + url + 'project/update', trace)
                consoleLog('updateProject.js/updateTheProject', 3, '--- Message: ' + project.value.message, trace)
                consoleLog('updateProject.js/updateTheProject', 3, project.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateProject.js/updateTheProject', 3, error.value, trace)
        }
    }

    return { error, updateTheProject }
}

export default updateProject