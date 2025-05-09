
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-21 
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:08:38
 * @Description: API functions for the license
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAllLicenses = () => {

    const error = ref(null)

    const loadLicenses = async (licenses, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAllLicenses.js/loadLicenses', 3, 'LOCAL Database license not implemented', trace)
            } else {
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'license')
                if (!data.ok) {
                    throw Error('no license available')
                }
                licenses.value = await data.json()
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getAllLicenses.js/loadLicenses', 3, err, trace)
        }
    }

    return { error, loadLicenses }
}

export default getAllLicenses