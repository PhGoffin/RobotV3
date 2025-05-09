/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 08:49:54
 * @Description: Copy a Naturalheader
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyNaturalheader = (naturalheaderID, position) => {

    const error = ref(null)

    const copyTheNaturalheader = async (naturalheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyNaturalheader.js/copyTheNaturalheader', 3, 'LOCAL Database Copy Naturalheader not implemented', trace)
            } else {
                consoleLog('copyNaturalheader.js/copyTheNaturalheader', 3,'naturalheaderID: ' + naturalheaderID + ', Position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'naturalheader/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'naturalheaderID': naturalheaderID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a naturalheader')
                }
                naturalheader.value = await data.json()
                consoleLog('copyNaturalheader.js/copyTheNaturalheader', 3, '--- copyNaturalheader ---' + url + 'naturalheader/copy', trace)
                consoleLog('copyNaturalheader.js/copyTheNaturalheader', 3, '--- Message: ' + naturalheader.value.message, trace)
                consoleLog('copyNaturalheader.js/copyTheNaturalheader', 3, naturalheader.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyNaturalheader.js/copyTheNaturalheader', 3, error.value, trace)
        }
    }

    return { error, copyTheNaturalheader }
}

export default copyNaturalheader