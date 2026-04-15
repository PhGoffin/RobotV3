
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2026-04-13
 * @Last Modified by: Someone
 * @Last Modified time: 2026-04-13 15:44:09
 * @Description: Take a snapshot of an virtual android device (Android Studio)
 */

import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const snapshotAndroid = () => {

    const error = ref(null)

    const snapshot = async (android, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('snapshotAndroid.js/snapshot', 3, 'LOCAL Database get a android snapshot not implemented', trace)
            } else {
                consoleLog('snapshotAndroid.js/snapshot', 3, '', trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'android/snapshot')
                if (!data.ok) {
                    throw Error('no android available')
                }

                android.value = await data.json()

            }


        } catch (err) {
            error.value = err.message
            consoleLog('snapshotAndroid.js/snapshot', 3, error.value, trace)
        }
    }

    return { error, snapshot }
}

export default snapshotAndroid