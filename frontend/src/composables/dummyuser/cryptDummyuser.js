/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-27
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-19 06:36:34
 * @Description: Crypt a dummy password with the selenium API
 */


import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const crypyDummyuser = (textPassword) => {

    const error = ref(null)

    const cryptPassword = async (dummypassword, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('crypyDummyuser.js/cryptPassword', 3, 'LOCAL Database Crypt password not implemented', trace)
            } else {
                consoleLog('crypyDummyuser.js/cryptPassword', 3, 'Password: ' + textPassword , trace)

                    const url = process.env.VUE_APP_MYSQL_API
                    let data = await fetch(url + 'playwright/robot/crypt', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({  'password': textPassword })
                    })
                    if (!data.ok) {
                        throw Error('Error during the crypt of the password')
                    }
                    dummypassword.value = await data.json()
                    consoleLog('crypyDummyuser.js/cryptPassword', 3, dummypassword.value, trace)

                // }
            }

        } catch (err) {
            error.value = err.message
            consoleLog('crypyDummyuser.js/cryptPassword', 3, error.value, trace)
        }
    }

    return { error, cryptPassword }
}

export default crypyDummyuser