
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-17
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-17 07:47:39
 * @Description: Delete a specific uploaded file
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const deleteUpload = (projectID, projectName, fileName) => {

    const error = ref(null)

    const deleteTheUpload = async (uploadfile, trace) => {
        try {

                consoleLog('deleteUpload.js/deleteTheUpload', 3, 'projectID: ' + projectID + ', projectName: ' + projectName + ', fileName: ' + fileName, trace)
                const url = process.env.VUE_APP_MYSQL_API + 'upload/delete'
                let data = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'projectName': projectName, 'fileName': fileName })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of an uploaded file')
                }
                uploadfile.value = await data.json()
                consoleLog('deleteUpload.js/deleteTheUpload', 3, '--- deleteUpload ---' + url, trace)
                consoleLog('deleteUpload.js/deleteTheUpload', 3, uploadfile.value, trace)
        

        } catch (err) {
            error.value = err.message
            consoleLog('deleteUpload.js/deleteTheUpload', 3, error.value, trace)
        }
    }

    return { error, deleteTheUpload }
}

export default deleteUpload