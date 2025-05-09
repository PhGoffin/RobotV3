/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-08
 * @Last Modified by: 
 * @Last Modified time: 2024-04-08 17:11:35
 * @Description: Get datasets by code (full code)
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const getDatasetByCode = (subprojectID, fullCode) => {

  const error = ref(null)

  const loadDataset = async (datasets, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getDatasetByCode.js/loadDataset', 3, 'LOCAL Database get dataset by code not implemented', trace)
      } else {
        consoleLog('getDatasetByCode.js/loadDataset', 3, 'subprojectID:' + subprojectID + ', code: ' + fullCode, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'dataset/code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'subprojectID': subprojectID, 'code': fullCode, active: 1  })
        })
        if (!data.ok) {
          throw Error('no dataset available')
        }
        datasets.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getDatasetByCode.js/loadDataset', 3, error.value, trace)
    }
  }

  return { error, loadDataset }
}

export default getDatasetByCode