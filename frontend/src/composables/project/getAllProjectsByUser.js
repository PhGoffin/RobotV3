/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-10
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:17:23
 * @Description: Get all the projects by a user
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAllProjectsByUser = (userID) => {

    //const projects = ref([])
    const error = ref(null)
    const projectstatus = 0

    const loadProjects = async (projects, trace) => {
        try {

            // simulate delay
            // await new Promise(resolve => {
            //   setTimeout(resolve, 2000)
            // })

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAllProjectsByUser.js/loadProjects', 3, 'LOCAL Database project by workspace not implemented', trace)
            } else {
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'project/user/' + userID)
                if (!data.ok) {
                    throw Error('no project available')
                }
                projects.value = await data.json()
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getAllProjectsByUser.js/loadProjects', 3, err, trace)
        }
    }

    return { error, loadProjects }
}

export default getAllProjectsByUser