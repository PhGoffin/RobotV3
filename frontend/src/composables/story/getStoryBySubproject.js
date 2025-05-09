/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-22
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get story by subproject
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getStoryBySubproject = (subprojectID) => {

  const error = ref(null)

  const loadStory = async (story, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getStoryBySubproject.js/loadStory', 3, 'LOCAL Database get story by subproject not implemented', trace)
      } else {
        consoleLog('getStoryBySubproject.js/loadStory', 3, 'subprojectID:' + subprojectID , trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'story/subproject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'subprojectID': subprojectID })
        })
        if (!data.ok) {
          throw Error('no story available')
        }
        story.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getStoryBySubproject.js/loadStory', 3, error.value, trace)
    }
  }

  return { error, loadStory }
}

export default getStoryBySubproject