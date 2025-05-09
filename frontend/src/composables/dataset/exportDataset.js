/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-06-03
 * @Last Modified by: 
 * @Last Modified time: 2024-06-03 09:36:43
 * @Description: Export Data into a json file
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const exportDataset = ( datasetheaderID, filename) => {

    const error = ref(null)

    const exportTheDataset = async (dataset, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('exportDataset.js/exportTheDataset', 3, 'LOCAL Database Export datasets not implemented', trace)
            } else {
                consoleLog('exportDataset.js/exportTheDataset', 3, 'datasetheaderID: ' + datasetheaderID + ', filename: ' + filename, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dataset/export', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'datasetheaderID': datasetheaderID, 'filename': filename  })
                })
                if (!data.ok) {
                    throw Error('Error during the export of the datasets')
                }
                dataset.value = await data.json()
                consoleLog('exportDataset.js/exportTheDataset', 3, '--- exportDataset ---' + url + 'dataset/export', trace)
                consoleLog('exportDataset.js/exportTheDataset', 3, '--- Message: ' + dataset.value.message, trace)
                consoleLog('exportDataset.js/exportTheDataset', 3, dataset.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('exportDataset.js/exportTheDataset', 3, error.value, trace)
        }
    }

    return { error, exportTheDataset }
}

export default exportDataset