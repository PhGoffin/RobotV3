/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-07
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get dummyuser by project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getDummyusersByProject = (projectID) => {

  const error = ref(null)

  const loadDummyuser = async (dummyuser, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getDummyusersBySubproject.js/loadDummyuser', 3, 'LOCAL Database get dummyuser by project not implemented', trace)
      } else {
        consoleLog('getDummyusersBySubproject.js/loadDummyuser', 3, 'projectID:' + projectID , trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'dummyuser/project/' + projectID)
        if (!data.ok) {
          throw Error('no dummyuser available')
        }
        dummyuser.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getDummyusersBySubproject.js/loadDummyuser', 3, error.value, trace)
    }
  }

  return { error, loadDummyuser }
}

export default getDummyusersByProject