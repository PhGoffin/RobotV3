/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-11-20
 * @Last Modified by: 
 * @Last Modified time: 2024-11-20 15:13:30
 * @Description: Update the Test Comment Type
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updateCommentType = (testID, commentType) => {

    const error = ref(null)

    const updateTheCommentType = async (test, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateCommentType.js/updateTheCommentType', 3, 'LOCAL Database Update Test Comment Type not implemented', trace)
            } else {
                consoleLog('updateCommentType.js/updateTheCommentType', 3,'testID: ' + testID + ', commentType: ' + commentType, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'test/commentType', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'commentType': commentType, 'testID': testID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the test comment Type')
                }
                test.value = await data.json()
                consoleLog('updateCommentType.js/updateTheCommentType', 3, '--- updateCommentType ---' + url + 'test/commentType', trace)
                consoleLog('updateCommentType.js/updateTheCommentType', 3, '--- Message: ' + test.value.message, trace)
                consoleLog('updateCommentType.js/updateTheCommentType', 3, test.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateCommentType.js/updateTheCommentType', 3, error.value, trace)
        }
    }

    return { error, updateTheCommentType }
}

export default updateCommentType