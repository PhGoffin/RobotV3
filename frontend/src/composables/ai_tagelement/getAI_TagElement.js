
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-20
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-20 17:07:08
 * @Description: Get an AI_TagElement
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAI_TagElement = (tagelementID) => {

    const error = ref(null)

    const getTheAI_TagElement = async (tagelement, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAI_TagElement.js/getTheAI_TagElement', 3, 'LOCAL Database get AI_TagElement not implemented', trace)
            } else {
                consoleLog('getAI_TagElement.js/getTheAI_TagElement', 3, 'tagelementID: ' + tagelementID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagelement/' + tagelementID)
                if (!data.ok) {
                    throw Error('Error during the get AI_TagElement')
                }
                tagelement.value = await data.json()
                consoleLog('getAI_TagElement.js/getTheAI_TagElement', 3, '--- get tagelement ---' + url + 'aitagelement/' + tagelementID, trace)
                consoleLog('getAI_TagElement.js/getTheAI_TagElement', 3, '--- Message: ' + tagelement.value.message, trace)
                consoleLog('getAI_TagElement.js/getTheAI_TagElement', 3, tagelement.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getAI_TagElement.js/getTheAI_TagElement', 3, error.value, trace)
        }
    }

    return { error, getTheAI_TagElement }
}

export default getAI_TagElement