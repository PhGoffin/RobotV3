/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-26
 * @Last Modified by: 
 * @Last Modified time: 2024-04-10 10:53:00
 * @Description: Get all the parameters by the projectID and storyheaderID
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getParametersByStory = (projectID, storyheaderID) => {

    const error = ref(null)

    const loadParameters = async (parameters, trace) => {
        try {


            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getParametersByStory.js/loadParameters', 3, 'LOCAL Database parameter by story not implemented', trace)
            } else {
                consoleLog('getParametersByStory.js/loadParameters', 3, 'projectID: ' + projectID + ', storyheaderID: ' + storyheaderID ,trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'parameter/story', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'projectID': projectID, 'storyheaderID': storyheaderID })
                })
                if (!data.ok) {
                    throw Error('no parameter available')
                }
                parameters.value = await data.json()
                consoleLog('getParametersByStory.js/loadParameters', 3, parameters.value,trace)
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getParametersByStory.js/loadParameters', 3, err, trace)
        }
    }

    return { error, loadParameters }
}

export default getParametersByStory