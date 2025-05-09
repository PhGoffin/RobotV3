/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 08:44:45
 * @Description: get all the naturals from a header
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getNaturalByHeader = (naturalheaderId) => {

    const error = ref(null)

    const loadNatural = async (natural, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getNaturalByHeader.js/loadNatural', 3, 'LOCAL Database load natural by header not implemented', trace)
            } else {
                consoleLog('getNaturalByHeader.js/loadNatural', 3,'naturalheaderId: ' + naturalheaderId, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'natural/header', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'naturalheaderID': naturalheaderId })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a natural')
                }
                natural.value = await data.json()
                consoleLog('getNaturalByHeader.js/loadNatural', 3, '--- getNaturalByHeader ---' + url + 'natural/header', trace)
                consoleLog('getNaturalByHeader.js/loadNatural', 3, '--- Message: ' + natural.value.message, trace)
                consoleLog('getNaturalByHeader.js/loadNatural', 3, natural.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getNaturalByHeader.js/loadNatural', 3, error.value, trace)
        }
    }

    return { error, loadNatural }
}

export default getNaturalByHeader