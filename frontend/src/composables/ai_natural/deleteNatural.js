/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 08:43:24
 * @Description: Delete a natural
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteNatural = (naturalheaderID, naturalID) => {

    const error = ref(null)

    const deleteTheNatural = async (natural, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteNatural.js/deleteTheNatural', 3, 'LOCAL Database delete natural not implemented', trace)
            } else {
                consoleLog('deleteNatural.js/deleteTheNatural', 3, 'naturalheaderID: ' + naturalheaderID + ', naturalID: ' + naturalID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'natural/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'naturalheaderID': naturalheaderID, 'naturalID': naturalID })
                })
                if (!data.ok) {
                    throw Error('Error during the delete of the natural')
                }
                natural.value = await data.json()
                consoleLog('deleteNatural.js/deleteTheNatural', 3, '--- deleteNatural ---' + url + 'natural/delete', trace)
                consoleLog('deleteNatural.js/deleteTheNatural', 3, '--- Message: ' + natural.value.message, trace)
                consoleLog('deleteNatural.js/deleteTheNatural', 3, natural.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteNatural.js/deleteTheNatural', 3, error.value, trace)
        }
    }

    return { error, deleteTheNatural }
}

export default deleteNatural