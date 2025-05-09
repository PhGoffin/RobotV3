/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 08:41:45
 * @Description: Copy all natural
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyAllNatural = (naturalheaderIDCopy, naturalheaderIDOrigin) => {

    const error = ref(null)

    const copyTheNatural = async (natural, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyAllNatural.js/copyTheNatural', 3, 'LOCAL Database Copy natural not implemented', trace)
            } else {
                consoleLog('copyAllNatural.js/copyTheNatural', 3,'naturalheaderIDCopy: ' + naturalheaderIDCopy + ', naturalheaderIDOrigin: ' + naturalheaderIDOrigin )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'natural/fullcopy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'naturalheaderIDCopy': naturalheaderIDCopy, 'naturalheaderIDOrigin': naturalheaderIDOrigin })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a natural')
                }
                natural.value = await data.json()
                consoleLog('copyAllNatural.js/copyTheNatural', 3, '--- copyAllNatural ---' + url + 'natural/fullcopy', trace)
                consoleLog('copyAllNatural.js/copyTheNatural', 3, '--- Message: ' + natural.value.message, trace)
                consoleLog('copyAllNatural.js/copyTheNatural', 3, natural.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyAllNatural.js/copyTheNatural', 3, error.value, trace)
        }
    }

    return { error, copyTheNatural }
}

export default copyAllNatural