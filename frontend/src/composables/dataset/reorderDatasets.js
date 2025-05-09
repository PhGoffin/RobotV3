/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-31
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Reorder all the Datasets
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderDatasets = (datasetheaderID) => {

    const error = ref(null)

    const reorderTheDatasets = async (dataset, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderDatasets.js/reorderTheDatasets', 3, 'LOCAL Database reorder Datasets is not implemented', trace)
            } else {
                consoleLog('reorderDatasets.js/reorderTheDatasets', 3,'datasetheaderID: ' + datasetheaderID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dataset/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'datasetheaderID': datasetheaderID })
                })

                if (!data.ok) {
                    throw Error('No dataset available')
                }
                dataset.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderDatasets.js/reorderTheDatasets', 3, err)
        }
    }

    return { error, reorderTheDatasets }
}

export default reorderDatasets