/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-05
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Copy a Datasetheader
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyDatasetheader = (datasetheaderID, position) => {

    const error = ref(null)

    const copyTheDatasetheader = async (datasetheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyDatasetheader.js/copyTheDatasetheader', 3, 'LOCAL Database Copy Datasetheader not implemented', trace)
            } else {
                consoleLog('copyDatasetheader.js/copyTheDatasetheader', 3,'datasetheaderID: ' + datasetheaderID + ', Position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'datasetheader/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'datasetheaderID': datasetheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a datasetheader')
                }
                datasetheader.value = await data.json()
                consoleLog('copyDatasetheader.js/copyTheDatasetheader', 3, '--- copyDatasetheader ---' + url + 'datasetheader/copy', trace)
                consoleLog('copyDatasetheader.js/copyTheDatasetheader', 3, '--- Message: ' + datasetheader.value.message, trace)
                consoleLog('copyDatasetheader.js/copyTheDatasetheader', 3, datasetheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyDatasetheader.js/copyTheDatasetheader', 3, error.value, trace)
        }
    }

    return { error, copyTheDatasetheader }
}

export default copyDatasetheader