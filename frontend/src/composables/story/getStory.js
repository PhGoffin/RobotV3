/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get detail of a story
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getStory = (storyID) => {

  const error = ref(null)

  const loadStory = async (story, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getStory.js/loadStory', 3, 'LOCAL Database get a story not implemented', trace)
      } else {
        consoleLog('getStory.js/loadStory', 3, 'storyID:' + storyID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'story/' + storyID)
        if (!data.ok) {
          throw Error('no story available')
        }
        story.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getStory.js/loadStory', 3, error.value, trace)
    }
  }

  return { error, loadStory }
}

export default getStory