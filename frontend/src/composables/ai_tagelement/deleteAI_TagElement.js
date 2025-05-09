
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-20
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-21 15:34:06
 * @Description: Delete an AI_TageElement
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteAI_TagElement = (tagelementID) => {

    const error = ref(null)

    const deleteTheAI_TagElement = async (aitagelement, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteAI_TagElement.js/deleteTheAI_TagElement', 3, 'LOCAL Database delete AI_TageElement not implemented', trace)
            } else {
                consoleLog('deleteAI_TagElement.js/deleteTheAI_TagElement', 3, 'tagelementID: ' + tagelementID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'aitagelement/delete/' + tagelementID)
                if (!data.ok) {
                    throw Error('Error during the delete of an AI_TageElement')
                }
                aitagelement.value = await data.json()
                consoleLog('deleteAI_TagElement.js/deleteTheAI_TagElement', 3, '--- deleteAttribute ---' + url + 'aitagelement/delete/' + tagelementID, trace)
                consoleLog('deleteAI_TagElement.js/deleteTheAI_TagElement', 3, '--- Message: ' + aitagelement.value.message, trace)
                consoleLog('deleteAI_TagElement.js/deleteTheAI_TagElement', 3, aitagelement.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteAI_TagElement.js/deleteTheAI_TagElement', 3, error.value, trace)
        }
    }

    return { error, deleteTheAI_TagElement }
}

export default deleteAI_TagElement