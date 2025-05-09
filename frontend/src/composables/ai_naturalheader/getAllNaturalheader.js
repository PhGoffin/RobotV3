/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 10:12:55
 * @Description: Get detail of a naturalheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAllNaturalheader = () => {

  const error = ref(null)

  const loadNaturalheader = async (naturalheader, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getAllNaturalheader.js/loadNaturalheader', 3, 'LOCAL Database get a naturalheader not implemented', trace)
      } else {
        consoleLog('getAllNaturalheader.js/loadNaturalheader', 3, 'naturalheader', trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'naturalheader')
        if (!data.ok) {
          throw Error('no naturalheader available')
        }
        naturalheader.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getAllNaturalheader.js/loadNaturalheader', 3, error.value, trace)
    }
  }

  return { error, loadNaturalheader }
}

export default getAllNaturalheader