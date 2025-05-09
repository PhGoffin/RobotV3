/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-27
 * @Last Modified by: 
 * @Last Modified time: 2024-04-10 11:13:31
 * @Description: Get references for the dashboard (reference linked by a project parameter)
 */

import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const getDashboardReference = (projectID, userID, storyheaderID) => {

    const error = ref(null)

    const loadReference = async (references, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getDashboardReference.js/loadReference', 3, 'LOCAL Database get Dashboard reference not implemented', trace)
            } else {
                consoleLog('getDashboardReference.js/loadReference', 3, 'projectID:' + projectID + ', userID:' + userID + ', storyheaderID: ' + storyheaderID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'reference/dashboard', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'userID': userID, 'storyheaderID': storyheaderID })
                })
                if (!data.ok) {
                    throw Error('no reference available')
                }
                references.value = await data.json()
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getDashboardReference.js/loadReference', 3, error.value, trace)
        }
    }

    return { error, loadReference }
}

export default getDashboardReference