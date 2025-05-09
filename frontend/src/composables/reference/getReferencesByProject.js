/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-23
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get reference by project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getReferencesByProject = (projectID, userID) => {

  const error = ref(null)

  const loadReference = async (references, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getReferencesByProject.js/loadReference', 3, 'LOCAL Database get reference by project not implemented', trace)
      } else {
        consoleLog('getReferencesByProject.js/loadReference', 3, 'projectID:' + projectID + ', userID:' + userID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'reference/project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'projectID': projectID, 'userID': userID })
        })
        if (!data.ok) {
          throw Error('no reference available')
        }
        references.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getReferencesByProject.js/loadReference', 3, error.value, trace)
    }
  }

  return { error, loadReference }
}

export default getReferencesByProject