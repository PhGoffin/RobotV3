/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-05-28
 * @Last Modified by: 
 * @Last Modified time: 2024-05-28 10:27:20
 * @Description: Get datasetheaders by code
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getDatasetheadersByCode = (subprojectID, code) => {

  const error = ref(null)

  const loadDatasetheader = async (datasetheaders, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getDatasetheadersByCode.js/loadDatasetheader', 3, 'LOCAL Database get datasetheader by code is not implemented', trace)
      } else {
        consoleLog('getDatasetheadersByCode.js/loadDatasetheader', 3, 'subprojectID:' + subprojectID + ', code: ' + code , trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'datasetheader/code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'subprojectID': subprojectID, 'code': code })
        })
        if (!data.ok) {
          throw Error('no datasetheader available')
        }
        datasetheaders.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getDatasetheadersByCode.js/loadDatasetheader', 3, error.value, trace)
    }
  }

  return { error, loadDatasetheader }
}

export default getDatasetheadersByCode