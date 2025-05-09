/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-11-06 14:06:37
 * @Description: Get storys by subproject
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getStoryByHeader = (storyheaderID, active) => {

  const error = ref(null)
  if (active == undefined) active = '%'

  const loadStory = async (storys, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getStoryByHeader.js/loadStory', 3, 'LOCAL Database get story by header not implemented', trace)
      } else {
        consoleLog('getStoryByHeader.js/loadStory', 3, 'storyheaderID:' + storyheaderID , trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'story/header', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'storyheaderID': storyheaderID, 'active': active })
        })
        if (!data.ok) {
          throw Error('no story available')
        }
        storys.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getStoryByHeader.js/loadStory', 3, error.value, trace)
    }
  }

  return { error, loadStory }
}

export default getStoryByHeader