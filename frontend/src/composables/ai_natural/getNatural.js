/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 08:43:55
 * @Description: Get detail of a natural
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getNatural = (naturalID) => {

  const error = ref(null)

  const loadNatural = async (natural, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getNatural.js/loadNatural', 3, 'LOCAL Database get a natural not implemented', trace)
      } else {
        consoleLog('getNatural.js/loadNatural', 3, 'naturalID:' + naturalID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'natural/' + naturalID)
        if (!data.ok) {
          throw Error('no natural available')
        }
        natural.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getNatural.js/loadNatural', 3, error.value, trace)
    }
  }

  return { error, loadNatural }
}

export default getNatural