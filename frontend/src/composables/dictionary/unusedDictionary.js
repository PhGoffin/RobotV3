/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-02
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-02 16:55:38
 * @Description: Get all unused dictionary by project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const unusedDictionary = (projectID) => {

  const error = ref(null)

  const loadDictionary = async (dictionary, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getDictionarysBySubproject.js/loadDictionary', 3, 'LOCAL Database get unused dictionary by project not implemented', trace)
      } else {
        consoleLog('getDictionarysBySubproject.js/loadDictionary', 3, 'projectID:' + projectID , trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'dictionary/unused/' + projectID)
        if (!data.ok) {
          throw Error('no unused dictionary available')
        }
        dictionary.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('unusedDictionary.js/loadDictionary', 3, error.value, trace)
    }
  }

  return { error, loadDictionary }
}

export default unusedDictionary