/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-09 
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:26:08
 * @Description:Get all the roles 
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAllRoles = () => {

    const error = ref(null)
    const projectstatus = 0

    const loadRoles = async (roles, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAllRoles.js/loadRoles', 3, 'LOCAL Database role not implemented', trace)
            } else {
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'role')
                if (!data.ok) {
                    throw Error('no role available')
                }
                roles.value = await data.json()
            }


        } catch (err) {
            error.value = err.message
            consoleLog('getAllRoles.js/loadRoles', 3, err, trace)
        }
    }

    return { error, loadRoles }
}

export default getAllRoles