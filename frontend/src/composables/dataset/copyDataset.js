/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-30
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 18:29
 * @Description: Copy a Dataset
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyDataset = (datasetID, position, userName, today) => {

    const error = ref(null)

    const copyTheDataset = async (dataset, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyDataset.js/copyTheDataset', 3, 'LOCAL Database Copy Dataset not implemented', trace)
            } else {
                consoleLog('copyDataset.js/copyTheDataset', 3,'datasetID: ' + datasetID + ', Position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dataset/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'user': userName, 'today': today, 'datasetID': datasetID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a dataset')
                }
                dataset.value = await data.json()
                consoleLog('copyDataset.js/copyTheDataset', 3, '--- copyDataset ---' + url + 'dataset/copy', trace)
                consoleLog('copyDataset.js/copyTheDataset', 3, '--- Message: ' + dataset.value.message, trace)
                consoleLog('copyDataset.js/copyTheDataset', 3, dataset.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyDataset.js/copyTheDataset', 3, error.value, trace)
        }
    }

    return { error, copyTheDataset }
}

export default copyDataset