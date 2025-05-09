
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-30
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 18:28
 * @Description: Add a new dataset
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addDataset = (subprojectID, datasetheaderID, code, label, comment, position, active, userName, today) => {

    const error = ref(null)

    const addNewDataset = async (dataset, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addDataset.js/addNewDataset', 3, 'LOCAL Database Add dataset not implemented', trace)
            } else {
                consoleLog('addDataset.js/addNewDataset', 3, 'subprojectID: ' + subprojectID + 'datasetheaderID: ' + datasetheaderID + ', code: ' + code + ', label: ' + label + ', active: ' + active, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dataset/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subprojectID': subprojectID, 'datasetheaderID': datasetheaderID, 'code': code, 'label': label, 'comment': comment, 'position': position, 'active': active, 'user': userName, 'today': today })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new dataset')
                }
                dataset.value = await data.json()
                consoleLog('addDataset.js/addNewDataset', 3, '--- createDataset ---' + url + 'dataset/create', trace)
                consoleLog('addDataset.js/addNewDataset', 3, '--- Message: ' + dataset.value.message, trace)
                consoleLog('addDataset.js/addNewDataset', 3, dataset.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addDataset.js/addNewDataset', 3, error.value, trace)
        }
    }

    return { error, addNewDataset }
}

export default addDataset