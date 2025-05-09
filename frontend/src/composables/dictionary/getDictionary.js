/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get detail of a dictionary
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getDictionary = (dictionaryID) => {

  const error = ref(null)

  const loadDictionary = async (dictionary, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getDictionary.js/loadDictionary', 3, 'LOCAL Database get a dictionary not implemented', trace)
      } else {
        consoleLog('getDictionary.js/loadDictionary', 3, 'dictionaryID:' + dictionaryID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'dictionary/' + dictionaryID)
        if (!data.ok) {
          throw Error('no dictionary available')
        }
        dictionary.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getDictionary.js/loadDictionary', 3, error.value, trace)
    }
  }

  return { error, loadDictionary }
}

export default getDictionary