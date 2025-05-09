/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-10
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-29 09:00:07
 * @Description: Get all the projects by the workspace
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAllProjectsByWorkspace = (workspaceID) => {

    //const projects = ref([])
    const error = ref(null)
    const projectstatus = 0

    const loadProjects = async (projects, trace) => {
        try {


            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAllProjectsByWorkspace.js/loadProjects', 3, 'LOCAL Database project by workspace not implemented', trace)
            } else {
                consoleLog('getAllProjectsByWorkspace.js/loadProjects', 3, 'workspaceID: ' + workspaceID ,trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'project/workspace/' + workspaceID)
                if (!data.ok) {
                    throw Error('no project available')
                }
                projects.value = await data.json()
                //console.log ('Projects: ', projects.value)
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getAllProjectsByWorkspace.js/loadProjects', 3, err, trace)
        }
    }

    return { error, loadProjects }
}

export default getAllProjectsByWorkspace