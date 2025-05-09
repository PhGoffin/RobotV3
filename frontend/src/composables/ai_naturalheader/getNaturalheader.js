/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 08:52:18
 * @Description: Get detail of a naturalheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getNaturalheader = (naturalheaderID) => {

  const error = ref(null)

  const loadNaturalheader = async (naturalheader, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getNaturalheader.js/loadNaturalheader', 3, 'LOCAL Database get a naturalheader not implemented', trace)
      } else {
        consoleLog('getNaturalheader.js/loadNaturalheader', 3, 'naturalheaderID:' + naturalheaderID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'naturalheader/' + naturalheaderID)
        if (!data.ok) {
          throw Error('no naturalheader available')
        }
        naturalheader.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getNaturalheader.js/loadNaturalheader', 3, error.value, trace)
    }
  }

  return { error, loadNaturalheader }
}

export default getNaturalheader