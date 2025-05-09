/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get detail of a storyheader
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getStoryheader = (storyheaderID) => {

  const error = ref(null)

  const loadStoryheader = async (storyheader, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getStoryheader.js/loadStoryheader', 3, 'LOCAL Database get a storyheader not implemented', trace)
      } else {
        consoleLog('getStoryheader.js/loadStoryheader', 3, 'storyheaderID:' + storyheaderID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'storyheader/' + storyheaderID)
        if (!data.ok) {
          throw Error('no storyheader available')
        }
        storyheader.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getStoryheader.js/loadStoryheader', 3, error.value, trace)
    }
  }

  return { error, loadStoryheader }
}

export default getStoryheader