/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-11 
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Load detail of a linked user (users linked to a project)
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getLinkedUser = (userprojectID) => {

    const error = ref(null)

    const loadLinkedUser = async (linkedUser, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getLinkedUser.js/loadLinkedUser', 3, 'LOCAL Database getFreeUser is not implemented', trace)
            } else {
                consoleLog('getLinkedUser.js/loadLinkedUser', 3,' userprojectID ' + userprojectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'user/linkedUser/' + userprojectID)
                if (!data.ok) {
                    throw Error('no linked user available')
                }
                linkedUser.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getLinkedUser.js/loadLinkedUser', 3, err)
        }
    }

    return { error, loadLinkedUser }
}

export default getLinkedUser