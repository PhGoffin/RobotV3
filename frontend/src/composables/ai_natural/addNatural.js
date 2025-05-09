
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 15:47:02
 * @Description: Add a new natural
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addNatural = (naturalheaderID, code, value, comment, language, position, active) => {

    const error = ref(null)

    const addNewNatural = async (natural, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addNatural.js/addNewNatural', 3, 'LOCAL Database Add natural not implemented', trace)
            } else {
                consoleLog('addNatural.js/addNewNatural', 3, 'naturalheaderID: ' + naturalheaderID + ', code: ' + code + ', value: ' + value + ', active: ' + active, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'natural/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'naturalheaderID': naturalheaderID, 'code': code, 'label': value, 'comment': comment, 'language': language, 'position': position, 'active': active })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a new natural')
                }
                natural.value = await data.json()
                consoleLog('addNatural.js/addNewNatural', 3, '--- createnatural ---' + url + 'natural/create', trace)
                consoleLog('addNatural.js/addNewNatural', 3, '--- Message: ' + natural.value.message, trace)
                consoleLog('addNatural.js/addNewNatural', 3, natural.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addNatural.js/addNewNatural', 3, error.value, trace)
        }
    }

    return { error, addNewNatural }
}

export default addNatural