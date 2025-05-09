
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-30
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:08:38
 * @Description: API functions for the logfile
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getLogfilesByUser = (userID) => {

    const error = ref(null)

    const loadLogfile = async (logfiles, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getLogfilesByUser.js/loadLogfile', 3, 'LOCAL Database get Logfiles By User not implemented', trace)
            } else {
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'logfile/user/' + userID)
                if (!data.ok) {
                    throw Error('no logfile available')
                }
                logfiles.value = await data.json()
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getLogfilesByUser.js/loadLogfile', 3, err, trace)
        }
    }

    return { error, loadLogfile }
}

export default getLogfilesByUser