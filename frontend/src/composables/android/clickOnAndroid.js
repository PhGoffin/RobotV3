/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2026-04-13
 * @Last Modified by: Someone
 * @Last Modified time: 2026-04-13 16:29:40
 * @Description: Click on the virtual android device (Android Studio)
 */

import { ref } from 'vue'
import { consoleLog } from '../../util/debug';


const clickOnAndroid = (x, y) => {

    const error = ref(null)

    const clickOn = async (android, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('clickOnAndroid.js/clickOn', 3, 'LOCAL Database Android clickOn not implemented', trace)
            } else {
                consoleLog('clickOnAndroid.js/clickOn', 3, '', trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'android/click', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'x': Math.round(x), 'y': Math.round(y)})
                })

                if (!data.ok) {
                    throw Error('no android available')
                }
                android.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('clickOnAndroid.js/clickOn', 3, error.value, trace)
        }
    }

    return { error, clickOn }
}

export default clickOnAndroid