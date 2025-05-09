
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-10
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 16:18
 * @Description: Add a new project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addProject = (workspaceID, projectName, libraryID, comment, userName, today) => {

    // const project = ref(null)
    const error = ref(null)

    const addNewProject = async (project, trace) => {
        try {

            // simulate delay
            // await new Promise(resolve => {
            //   setTimeout(resolve, 2000)
            // })

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addProject.js/addNewProject', 3, 'LOCAL Database Add project not implemented', trace)
            } else {
                consoleLog('addProject.js/addNewProject', 3, 'workspaceID: ' + workspaceID + ', project: ' + projectName + ', libraryID: ' + libraryID + ', comment: ' + comment, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'project/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'workspaceID': workspaceID, 'project': projectName, 'libraryID': libraryID, 'comment': comment, 'user': userName, 'today': today })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new project')
                }
                project.value = await data.json()
                consoleLog('addProject.js/addNewProject', 3, '--- createProject ---' + url + 'project/create', trace)
                consoleLog('addProject.js/addNewProject', 3, '--- Message: ' + project.value.message, trace)
                consoleLog('addProject.js/addNewProject', 3, project.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addProject.js/addNewProject', 3, error.value, trace)
        }
    }

    return { error, addNewProject }
}

export default addProject