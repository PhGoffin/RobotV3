/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-31
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get datasets by subproject
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getDatasetsBySubproject = (subprojectID) => {

  const error = ref(null)

  const loadDataset = async (datasets, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getDatasetsBySubproject.js/loadDataset', 3, 'LOCAL Database get dataset by subproject not implemented', trace)
      } else {
        consoleLog('getDatasetsBySubproject.js/loadDataset', 3, 'subprojectID:' + subprojectID , trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'dataset/subproject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'subprojectID': subprojectID })
        })
        if (!data.ok) {
          throw Error('no dataset available')
        }
        datasets.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getDatasetsBySubproject.js/loadDataset', 3, error.value, trace)
    }
  }

  return { error, loadDataset }
}

export default getDatasetsBySubproject