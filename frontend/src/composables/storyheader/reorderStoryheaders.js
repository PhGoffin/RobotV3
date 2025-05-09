/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-31
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Reorder all the Storyheaders
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderStoryheaders = (subprojectID) => {

    const error = ref(null)

    const reorderTheStoryheaders = async (storyheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderStoryheaders.js/reorderTheStoryheaders', 3, 'LOCAL Database reorder Storyheaders is not implemented', trace)
            } else {
                consoleLog('reorderStoryheaders.js/reorderTheStoryheaders', 3,'subprojectID: ' + subprojectID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'storyheader/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'subprojectID': subprojectID })
                })

                if (!data.ok) {
                    throw Error('No storyheader available')
                }
                storyheader.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderStoryheaders.js/reorderTheStoryheaders', 3, err)
        }
    }

    return { error, reorderTheStoryheaders }
}

export default reorderStoryheaders