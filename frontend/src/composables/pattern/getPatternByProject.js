
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-12
 * @Last Modified by: 
 * @Last Modified time: 2024-04-12 14:11:21
 * @Description: Get Patterns by project
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getPatternByProject = (projectID) => {

    const error = ref(null)

    const getThePattern = async (pattern, trace) => {
        try {
            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getPatternByProject.js/getThePattern', 3, 'LOCAL Database get Patterns by project not implemented', trace)
            } else {
                consoleLog('getPatternByProject.js/getThePattern', 3, 'projectID: ' + projectID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'pattern/project/' + projectID)
                if (!data.ok) {
                    throw Error('Error during the get Pattern by project')
                }
                pattern.value = await data.json()
                consoleLog('getPatternByProject.js/getThePattern', 3, '--- getpatternByProject ---' + url + 'pattern/project/' + projectID, trace)
                consoleLog('getPatternByProject.js/getThePattern', 3, '--- Message: ' + pattern.value.message, trace)
                consoleLog('getPatternByProject.js/getThePattern', 3, pattern.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getPatternByProject.js/getThePattern', 3, error.value, trace)
        }
    }

    return { error, getThePattern }
}

export default getPatternByProject