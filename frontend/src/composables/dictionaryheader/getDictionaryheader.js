/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-09
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get detail of a dictionaryheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getDictionaryheader = (dictionaryheaderID) => {

  const error = ref(null)

  const loadDictionaryheader = async (dictionaryheader, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getDictionaryheader.js/loadDictionaryheader', 3, 'LOCAL Database get a dictionaryheader not implemented', trace)
      } else {
        consoleLog('getDictionaryheader.js/loadDictionaryheader', 3, 'dictionaryheaderID:' + dictionaryheaderID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'dictionaryheader/' + dictionaryheaderID)
        if (!data.ok) {
          throw Error('no dictionaryheader available')
        }
        dictionaryheader.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getDictionaryheader.js/loadDictionaryheader', 3, error.value, trace)
    }
  }

  return { error, loadDictionaryheader }
}

export default getDictionaryheader