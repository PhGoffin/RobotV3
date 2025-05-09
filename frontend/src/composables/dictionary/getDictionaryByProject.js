/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get dictionary by project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getDictionarysByProject = (projectID) => {

  const error = ref(null)

  const loadDictionary = async (dictionary, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getDictionarysBySubproject.js/loadDictionary', 3, 'LOCAL Database get dictionary by project not implemented', trace)
      } else {
        consoleLog('getDictionarysBySubproject.js/loadDictionary', 3, 'projectID:' + projectID , trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'dictionary/project/' + projectID)
        if (!data.ok) {
          throw Error('no dictionary available')
        }
        dictionary.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getDictionarysBySubproject.js/loadDictionary', 3, error.value, trace)
    }
  }

  return { error, loadDictionary }
}

export default getDictionarysByProject