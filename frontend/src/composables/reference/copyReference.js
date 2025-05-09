/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-25
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Copy a Reference
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyReference = (referenceID, position) => {

    const error = ref(null)

    const copyTheReference = async (reference, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyReference.js/copyTheReference', 3, 'LOCAL Database Copy Reference not implemented', trace)
            } else {
                consoleLog('copyReference.js/copyTheReference', 3,'referenceID: ' + referenceID + ', Position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'reference/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'referenceID': referenceID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a reference')
                }
                reference.value = await data.json()
                consoleLog('copyReference.js/copyTheReference', 3, '--- copyReference ---' + url + 'reference/copy', trace)
                consoleLog('copyReference.js/copyTheReference', 3, '--- Message: ' + reference.value.message, trace)
                consoleLog('copyReference.js/copyTheReference', 3, reference.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyReference.js/copyTheReference', 3, error.value, trace)
        }
    }

    return { error, copyTheReference }
}

export default copyReference