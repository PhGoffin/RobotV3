/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 15:47:30
 * @Description: Update a natural
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const updateNatural = (code, value, comment, language, active, naturalID) => {

    const error = ref(null)

    const updateTheNatural = async (natural, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateNatural.js/updateTheNatural', 3, 'LOCAL Database Update natural not implemented', trace)
            } else {
                consoleLog('updateNatural.js/updateTheNatural', 3, 'naturalID: ' + naturalID + ', code: ' + code + ', value: ' + value, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'natural/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'code': code, 'label': value, 'comment': comment, 'language': language, 'active': active, 'naturalID': naturalID })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a natural')
                }
                natural.value = await data.json()
                consoleLog('updateNatural.js/updateTheNatural', 3, '--- updateNatural ---' + url + 'natural/update', trace)
                consoleLog('updateNatural.js/updateTheNatural', 3, '--- Message: ' + natural.value.message, trace)
                consoleLog('updateNatural.js/updateTheNatural', 3, natural.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateNatural.js/updateTheNatural', 3, error.value, trace)
        }
    }

    return { error, updateTheNatural }
}

export default updateNatural