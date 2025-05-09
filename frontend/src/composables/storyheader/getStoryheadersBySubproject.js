/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-23 07:29:04
 * @Description: Get storyheaders by subproject
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getStoryheadersBySubproject = (subprojectID, active) => {

  const error = ref(null)

  const loadStoryheader = async (storyheaders, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getStoryheadersBySubproject.js/loadStoryheader', 3, 'LOCAL Database get storyheader by subproject not implemented', trace)
      } else {
        consoleLog('getStoryheadersBySubproject.js/loadStoryheader', 3, 'subprojectID:' + subprojectID , trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'storyheader/subproject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'subprojectID': subprojectID, 'active': active })
        })
        if (!data.ok) {
          throw Error('no storyheader available')
        }
        storyheaders.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getStoryheadersBySubproject.js/loadStoryheader', 3, error.value, trace)
    }
  }

  return { error, loadStoryheader }
}

export default getStoryheadersBySubproject