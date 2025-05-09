/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-10
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:00:40
 * @Description: Get all the subprojects of a project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAllSubprojects = (projectID) => {

    //const subprojects = ref([])
    const error = ref(null)

    const loadSubprojects = async (subprojects, trace) => {
        try {

            // simulate delay
            // await new Promise(resolve => {
            //   setTimeout(resolve, 2000)
            // })

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAllSubprojects.js/loadSubprojects', 3, 'LOCAL Database subproject not implemented', trace)
            } else {
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'subproject/project/' + projectID)
                if (!data.ok) {
                    throw Error('no project available')
                }
                subprojects.value = await data.json()
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getAllSubprojects.js/loadSubprojects', 3, error.value, trace)
        }
    }

    return { error, loadSubprojects }
}

export default getAllSubprojects