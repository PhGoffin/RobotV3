/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-10
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get detail of a project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getProject = (projectID) => {

  //const project = ref(null)
  const error = ref(null)

  const loadProject = async (project, trace) => {
    try {

      // simulate delay
      // await new Promise(resolve => {
      //   setTimeout(resolve, 2000)
      // })

      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getProject.js/loadProject', 3, 'LOCAL Database project not implemented', trace)
      } else {
        consoleLog('getProject.js/loadProject', 3, 'projectID:' + projectID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'project/' + projectID)
        if (!data.ok) {
          throw Error('no project available')
        }
        project.value = await data.json()
        project.value = project.value.data[0]
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getProject.js/loadProject', 3, error.value, trace)
    }
  }

  return { error, loadProject }
}

export default getProject