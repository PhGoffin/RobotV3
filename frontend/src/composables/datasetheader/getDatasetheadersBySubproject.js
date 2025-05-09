/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-05
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get datasetheaders by subproject
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getDatasetheadersBySubproject = (subprojectID) => {

  const error = ref(null)

  const loadDatasetheader = async (datasetheaders, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getDatasetheadersBySubproject.js/loadDatasetheader', 3, 'LOCAL Database get datasetheader by subproject not implemented', trace)
      } else {
        consoleLog('getDatasetheadersBySubproject.js/loadDatasetheader', 3, 'subprojectID:' + subprojectID , trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'datasetheader/subproject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'subprojectID': subprojectID })
        })
        if (!data.ok) {
          throw Error('no datasetheader available')
        }
        datasetheaders.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getDatasetheadersBySubproject.js/loadDatasetheader', 3, error.value, trace)
    }
  }

  return { error, loadDatasetheader }
}

export default getDatasetheadersBySubproject