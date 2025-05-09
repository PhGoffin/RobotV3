/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-05
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get detail of a datasetheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getDatasetheader = (datasetheaderID) => {

  const error = ref(null)

  const loadDatasetheader = async (datasetheader, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getDatasetheader.js/loadDatasetheader', 3, 'LOCAL Database get a datasetheader not implemented', trace)
      } else {
        consoleLog('getDatasetheader.js/loadDatasetheader', 3, 'datasetheaderID:' + datasetheaderID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'datasetheader/' + datasetheaderID)
        if (!data.ok) {
          throw Error('no datasetheader available')
        }
        datasetheader.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getDatasetheader.js/loadDatasetheader', 3, error.value, trace)
    }
  }

  return { error, loadDatasetheader }
}

export default getDatasetheader