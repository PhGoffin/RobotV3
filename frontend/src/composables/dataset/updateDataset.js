/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-31
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 18:30
 * @Description: Update a dataset
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updateDataset = (code, label, comment, active, datasetheaderID, datasetID, userName, today) => {

    const error = ref(null)

    const updateTheDataset = async (dataset, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateDataset.js/updateTheDataset', 3, 'LOCAL Database Update dataset not implemented', trace)
            } else {
                consoleLog('updateDataset.js/updateTheDataset', 3, 'datasetheaderID: ' + datasetheaderID  + ', datasetID: ' + datasetID + ', code: ' + code + ', label: ' + label, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dataset/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'code': code, 'label': label, 'comment': comment, 'active': active, 'user': userName, 'today': today, 'datasetheaderID': datasetheaderID, 'datasetID': datasetID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a dataset')
                }
                dataset.value = await data.json()
                consoleLog('updateDataset.js/updateTheDataset', 3, '--- updateDataset ---' + url + 'dataset/update', trace)
                consoleLog('updateDataset.js/updateTheDataset', 3, '--- Message: ' + dataset.value.message, trace)
                consoleLog('updateDataset.js/updateTheDataset', 3, dataset.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateDataset.js/updateTheDataset', 3, error.value, trace)
        }
    }

    return { error, updateTheDataset }
}

export default updateDataset