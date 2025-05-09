/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-07
 * @Last Modified by: 
 * @Last Modified time: 2024-11-18 13:34:52
 * @Description: Copy all the Dataset from a Datasetheader
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyAllDataset = (subprojectID, datasetheaderIDCopy, datasetheaderIDOrigin) => {

    const error = ref(null)

    const copyTheDataset = async (dataset, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyAllDataset.js/copyTheDataset', 3, 'LOCAL Database Copy All Dataset not implemented', trace)
            } else {
                consoleLog('copyAllDataset.js/copyTheDataset', 3,'datasetheaderID Origin: ' + datasetheaderIDCopy + ' to Copy: ' + datasetheaderIDOrigin  )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dataset/fullcopy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subprojectID': subprojectID, 'datasetheaderIDCopy': datasetheaderIDCopy, 'datasetheaderIDOrigin': datasetheaderIDOrigin })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a dataset')
                }
                dataset.value = await data.json()
                consoleLog('copyAllDataset.js/copyTheDataset', 3, '--- copyAllDataset ---' + url + 'dataset/fullcopy', trace)
                consoleLog('copyAllDataset.js/copyTheDataset', 3, '--- Message: ' + dataset.value.message, trace)
                consoleLog('copyAllDataset.js/copyTheDataset', 3, dataset.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyAllDataset.js/copyTheDataset', 3, error.value, trace)
        }
    }

    return { error, copyTheDataset }
}

export default copyAllDataset