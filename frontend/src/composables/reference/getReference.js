/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-23
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get detail of a reference
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getReference = (referenceID) => {

  const error = ref(null)

  const loadReference = async (reference, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getReference.js/loadReference', 3, 'LOCAL Database get a reference not implemented', trace)
      } else {
        consoleLog('getReference.js/loadReference', 3, 'referenceID:' + referenceID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'reference/' + referenceID)
        if (!data.ok) {
          throw Error('no reference available')
        }
        reference.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getReference.js/loadReference', 3, error.value, trace)
    }
  }

  return { error, loadReference }
}

export default getReference