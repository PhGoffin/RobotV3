
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-10 
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:08:38
 * @Description: API functions for the library
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAllLibraries = () => {

    const error = ref(null)

    const loadLibraries = async (libraries, trace) => {
        try {

            // simulate delay
            // await new Promise(resolve => {
            //   setTimeout(resolve, 2000)
            // })

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAllLibraries.js/loadLibraries', 3, 'LOCAL Database library not implemented', trace)
            } else {
                //console.log('MySQL project')
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'library')
                if (!data.ok) {
                    throw Error('no library available')
                }
                libraries.value = await data.json()
                //console.log('--- getAllLibraries ---' + url, trace)
                //libraries.value = libraries.value.data
                //console.log(libraries.value, trace)
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getAllLibraries.js/loadLibraries', 3, err, trace)
        }
    }

    return { error, loadLibraries }
}

export default getAllLibraries