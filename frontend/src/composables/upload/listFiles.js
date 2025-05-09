
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-16
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-16 18:23:50
 * @Description: List all the uploaded files
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const listFiles = (projectID, projectName) => {

    const error = ref(null)

    const listTheFiles = async (files, trace) => {
        try {

                consoleLog('listFiles.js/listTheFiles', 3, 'projectID: ' + projectID + ', projectName: ' + projectName, trace)
                const url = process.env.VUE_APP_MYSQL_API + 'upload/list'
                let data = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'projectName': projectName })
                })
                if (!data.ok) {
                    throw Error('Error during the list of uploaded files')
                }
                files.value = await data.json()
                consoleLog('listFiles.js/listTheFiles', 3, '--- listFiles ---' + url, trace)
                consoleLog('listFiles.js/listTheFiles', 3, files.value, trace)
        

        } catch (err) {
            error.value = err.message
            consoleLog('listFiles.js/listTheFiles', 3, error.value, trace)
        }
    }

    return { error, listTheFiles }
}

export default listFiles