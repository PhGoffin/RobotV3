/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-31
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Dataset position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionDataset = (datasetID, position) => {

    const error = ref(null)

    const updateThePosition = async (dataset, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionDataset.js/updateThePosition', 3, 'LOCAL Database Update Dataset position not implemented', trace)
            } else {
                consoleLog('updatePositionDataset.js/updateThePosition', 3,'datasetID: ' + datasetID + ', position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dataset/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'datasetID': datasetID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the dataset position')
                }
                dataset.value = await data.json()
                consoleLog('updatePositionDataset.js/updateThePosition', 3, '--- updatePositionDataset ---' + url + 'dataset/position', trace)
                consoleLog('updatePositionDataset.js/updateThePosition', 3, '--- Message: ' + dataset.value.message, trace)
                consoleLog('updatePositionDataset.js/updateThePosition', 3, dataset.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionDataset.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionDataset