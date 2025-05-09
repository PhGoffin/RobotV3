/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 14:19:59
 * @Description: Get Natural by code
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const getNaturalByCode = (code, language, active) => {

    const error = ref(null)

    const loadNatural = async (natural, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getNaturalByCode.js/loadNatural', 3, 'LOCAL Database Get Natural by code not implemented', trace)
            } else {
                consoleLog('getNaturalByCode.js/loadNatural', 3,'Code: ' + code + ', Language: ' + language, trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'natural/value', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'code': code, 'language': language, 'active': active  })
                })
                if (!data.ok) {
                    throw Error('Error during the get natural code')
                }
                natural.value = await data.json()
                consoleLog('getNaturalByCode.js/loadNatural', 3, '--- getNaturalByCode ---' + url + 'natural/value', trace)
                consoleLog('getNaturalByCode.js/loadNatural', 3, '--- Message: ' + natural.value.message, trace)
                consoleLog('getNaturalByCode.js/loadNatural', 3, natural.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getNaturalByCode.js/loadNatural', 3, error.value, trace)
        }
    }

    return { error, loadNatural }
}

export default getNaturalByCode