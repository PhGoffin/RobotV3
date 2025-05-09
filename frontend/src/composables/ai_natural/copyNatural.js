/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 08:42:17
 * @Description: Copy a natural
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyNatural = (naturalID, position) => {

    const error = ref(null)

    const copyTheNatural = async (natural, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyNatural.js/copyTheNatural', 3, 'LOCAL Database Copy natural not implemented', trace)
            } else {
                consoleLog('copyNatural.js/copyTheNatural', 3,'naturalID: ' + naturalID + ', Position: ' + position, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'natural/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'naturalID': naturalID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a natural')
                }
                natural.value = await data.json()
                consoleLog('copyNatural.js/copyTheNatural', 3, '--- copyNatural ---' + url + 'natural/copy', trace)
                consoleLog('copyNatural.js/copyTheNatural', 3, '--- Message: ' + natural.value.message, trace)
                consoleLog('copyNatural.js/copyTheNatural', 3, natural.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyNatural.js/copyTheNatural', 3, error.value, trace)
        }
    }

    return { error, copyTheNatural }
}

export default copyNatural