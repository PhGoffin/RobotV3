/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-05
 * @Last Modified time: 2024-03-05 08:40:49
 * @Description: get a reference backup header by project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const getReferencebackupheaderByProject = (projectID, userID) => {
    const error = ref(null)

    const loadTheReference = async (reference, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getReferencebackupheaderByProject.js/loadTheReference', 3, 'LOCAL Database load reference backup header by project not implemented', trace)
            } else {
                consoleLog('getReferencebackupheaderByProject.js/loadTheReference', 3, 'projectID: ' + projectID + ', userID: ' + userID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'referencebackupheader/project', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'userID': userID })
                })
                if (!data.ok) {
                    throw Error('Error during the load of the reference backup header by project')
                }
                reference.value = await data.json()
                consoleLog('getReferencebackupheaderByProject.js/loadTheReference', 3, '--- getReferencebackupheaderByProject ---' + url + 'referencebackupheader/project', trace)
                consoleLog('getReferencebackupheaderByProject.js/loadTheReference', 3, reference.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getReferencebackupheaderByProject.js/loadTheReference', 3, error.value, trace)
        }
    }

    return { error, loadTheReference }
}

export default getReferencebackupheaderByProject