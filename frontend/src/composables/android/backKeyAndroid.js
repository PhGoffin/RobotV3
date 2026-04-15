
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2026-04-14
 * @Last Modified by: Someone
 * @Last Modified time: 2026-04-14 15:39:52
 * @Description: Press a back key on an virtual android device (Android Studio)
 */

import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const backKeyAndroid = () => {

    const error = ref(null)

    const backKey = async (android, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('backKeyAndroid.js/backKey', 3, 'LOCAL back key on android not implemented', trace)
            } else {
                consoleLog('backKeyAndroid.js/backKey', 3, '', trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'android/back')
                if (!data.ok) {
                    throw Error('no android available')
                }

                android.value = await data.json()
                consoleLog('backKeyAndroid.js/backKey', 3, android.value, trace)
            }


        } catch (err) {
            error.value = err.message
            consoleLog('backKeyAndroid.js/backKey', 3, error.value, trace)
        }
    }

    return { error, backKey }
}

export default backKeyAndroid