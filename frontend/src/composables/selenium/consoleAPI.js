/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-10-14
 * @Last Modified by: 
 * @Last Modified time: 2024-10-14 08:19:02
 * @Description: Display a message on the API consoleAPI
 */


import { ref } from 'vue'
import { consoleLog } from '../../util/debug';



const consoleAPI = (title, value, level, ident) => {

    const error = ref(null)

    const consoleMsg = async (selenium, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('consoleAPI.js/consoleMsg', 3, 'LOCAL Database consoleAPI not implemented', trace)
            } else {
                consoleLog('consoleAPI.js/consoleMsg', 3, 'title: ' + title + " - " + value, trace)

                    const url = process.env.VUE_APP_MYSQL_API
                    let data = await fetch(url + 'Selenium/robot/console', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({  'level': level, 'ident': ident, 'title': title, 'value': value })
                    })
            }

        } catch (err) {
            error.value = err.message
            consoleLog('consoleAPI.js/consoleMsg', 3, error.value, trace)
        }
    }

    return { error, consoleMsg }
}

export default consoleAPI