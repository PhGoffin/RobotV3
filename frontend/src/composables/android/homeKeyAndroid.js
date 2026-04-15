
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2026-04-14
 * @Last Modified by: Someone
 * @Last Modified time: 2026-04-14 15:39:21
 * @Description: Press a home key on an virtual android device (Android Studio)
 */

import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const homeKeyAndroid = () => {

    const error = ref(null)

    const homeKey = async (android, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('homeKeyAndroid.js/homeKey', 3, 'LOCAL home key on android not implemented', trace)
            } else {
                consoleLog('homeKeyAndroid.js/homeKey', 3, '', trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'android/home')
                if (!data.ok) {
                    throw Error('no android available')
                }

                android.value = await data.json()
                consoleLog('homeKeyAndroid.js/homeKey', 3, android.value, trace)

            }


        } catch (err) {
            error.value = err.message
            consoleLog('homeKeyAndroid.js/homeKey', 3, error.value, trace)
        }
    }

    return { error, homeKey }
}

export default homeKeyAndroid