/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-07
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Reorder all the Dummyusers
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderDummyusers = (projectID) => {

    const error = ref(null)

    const reorderTheDummyuser = async (dummyuser, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderDummyusers.js/reorderTheDummyuser', 3, 'LOCAL Database reorder Dummyuser is not implemented', trace)
            } else {
                consoleLog('reorderDummyusers.js/reorderTheDummyuser', 3,'projectID: ' + projectID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dummyuser/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID })
                })

                if (!data.ok) {
                    throw Error('No dummyuser available')
                }
                dummyuser.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderDummyusers.js/reorderTheDummyuser', 3, err)
        }
    }

    return { error, reorderTheDummyuser }
}

export default reorderDummyusers