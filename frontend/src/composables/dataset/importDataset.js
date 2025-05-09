/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-08-07
 * @Last Modified by: 
 * @Last Modified time: 2024-08-07 13:17:35
 * @Description: Import a data from another datasetheader
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const importDataset = ( currentDatasetheaderID, position, datasetID, userName, today) => {

    const error = ref(null)

    const importTheDataset = async (test, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('importDataset.js/importTheDataset', 3, 'LOCAL Database Import Data not implemented', trace)
            } else {
                consoleLog('importDataset.js/importTheDataset', 3,'datasetID: ' + datasetID  + ', position:' + position + ', currentDatasetheaderID: ' + currentDatasetheaderID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dataset/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'currentDatasetheaderID': currentDatasetheaderID, 'position': position, 'user': userName, 'today': today, 'datasetID': datasetID  })
                })
                if (!data.ok) {
                    throw Error('Error during the import of a data')
                }
                test.value = await data.json()
                consoleLog('importDataset.js/importTheDataset', 3, '--- importDataset ---' + url + 'dataset/import', trace)
                consoleLog('importDataset.js/importTheDataset', 3, '--- Message: ' + test.value.message, trace)
                consoleLog('importDataset.js/importTheDataset', 3, test.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('importDataset.js/importTheDataset', 3, error.value, trace)
        }
    }

    return { error, importTheDataset }
}

export default importDataset