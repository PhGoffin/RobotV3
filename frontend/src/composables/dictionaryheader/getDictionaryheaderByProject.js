/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-09
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get dictionaryheader by project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getDictionaryheadersByProject = (projectID) => {

  const error = ref(null)

  const loadDictionaryheader = async (dictionaryheader, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getDictionaryheadersBySubproject.js/loadDictionaryheader', 3, 'LOCAL Database get dictionaryheader by project not implemented', trace)
      } else {
        consoleLog('getDictionaryheadersBySubproject.js/loadDictionaryheader', 3, 'projectID:' + projectID , trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'dictionaryheader/project/' + projectID)
        if (!data.ok) {
          throw Error('no dictionaryheader available')
        }
        dictionaryheader.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getDictionaryheadersBySubproject.js/loadDictionaryheader', 3, error.value, trace)
    }
  }

  return { error, loadDictionaryheader }
}

export default getDictionaryheadersByProject