/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-07
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 17:50
 * @Description: Copy a Dummyuser
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyDummyuser = (dummyuserID, position, userName, today) => {

    const error = ref(null)

    const copyTheDummyuser = async (dummyuser, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyDummyuser.js/copyTheDummyuser', 3, 'LOCAL Database Copy Dummyuser not implemented', trace)
            } else {
                consoleLog('copyDummyuser.js/copyTheDummyuser', 3,'dummyuserID: ' + dummyuserID + ', Position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'dummyuser/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'user': userName, 'today': today, 'dummyuserID': dummyuserID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a dummyuser')
                }
                dummyuser.value = await data.json()
                consoleLog('copyDummyuser.js/copyTheDummyuser', 3, '--- copyDummyuser ---' + url + 'dummyuser/copy', trace)
                consoleLog('copyDummyuser.js/copyTheDummyuser', 3, '--- Message: ' + dummyuser.value.message, trace)
                consoleLog('copyDummyuser.js/copyTheDummyuser', 3, dummyuser.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyDummyuser.js/copyTheDummyuser', 3, error.value, trace)
        }
    }

    return { error, copyTheDummyuser }
}

export default copyDummyuser