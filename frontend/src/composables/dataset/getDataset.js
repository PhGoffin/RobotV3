/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-31
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get detail of a dataset
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getDataset = (datasetID) => {

  const error = ref(null)

  const loadDataset = async (dataset, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getDataset.js/loadDataset', 3, 'LOCAL Database get a dataset not implemented', trace)
      } else {
        consoleLog('getDataset.js/loadDataset', 3, 'datasetID:' + datasetID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'dataset/' + datasetID)
        if (!data.ok) {
          throw Error('no dataset available')
        }
        dataset.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getDataset.js/loadDataset', 3, error.value, trace)
    }
  }

  return { error, loadDataset }
}

export default getDataset