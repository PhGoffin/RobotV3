/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-31
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:14:43
 * @Description: Delete a dataset
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteDataset = (datasetheaderID, datasetID) => {

    const error = ref(null)

    const deleteTheDataset = async (dataset, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('DeleteDataset.js/DeleteTheDataset', 3, 'LOCAL Database delete dataset not implemented', trace)
            } else {
                consoleLog('DeleteDataset.js/DeleteTheDataset', 3, 'datasetheaderID: ' + datasetheaderID + ', datasetID: ' + datasetID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dataset/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'datasetheaderID': datasetheaderID, 'datasetID': datasetID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the dataset')
                }
                dataset.value = await data.json()
                consoleLog('DeleteDataset.js/DeleteTheDataset', 3, '--- DeleteDataset ---' + url + 'dataset/delete', trace)
                consoleLog('DeleteDataset.js/DeleteTheDataset', 3, '--- Message: ' + dataset.value.message, trace)
                consoleLog('DeleteDataset.js/DeleteTheDataset', 3, dataset.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('DeleteDataset.js/DeleteTheDataset', 3, error.value, trace)
        }
    }

    return { error, deleteTheDataset }
}

export default deleteDataset