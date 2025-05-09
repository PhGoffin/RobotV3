/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 08:55:12
 * @Description: Reorder all the Naturalheader
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderNaturalheader = () => {

    const error = ref(null)

    const reorderTheNaturalheader = async (naturalheader, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderNaturalheaders.js/reorderTheNaturalheaders', 3, 'LOCAL Database reorder Naturalheader is not implemented', trace)
            } else {
                consoleLog('reorderNaturalheaders.js/reorderTheNaturalheaders', 3,'projectID: ' + projectID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'naturalheader/reorder')
                if (!data.ok) {
                    throw Error('No naturalheader available')
                }
                naturalheader.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderNaturalheaders.js/reorderTheNaturalheaders', 3, err)
        }
    }

    return { error, reorderTheNaturalheader }
}

export default reorderNaturalheader