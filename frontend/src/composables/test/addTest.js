/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-28
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-10 07:33:47
 * @Description: Add a new test
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addTest = (scenarioID, action, comment, testCondition, functionID, parameter1, parameter2, parameter3, parameter4, active, position) => {

    const error = ref(null)

    const addNewTest = async (test, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addTest.js/addNewTest', 3, 'LOCAL Database Add Test not implemented', trace)
            } else {
                consoleLog('addTest.js/addNewTest', 3,'test: ' + test,  trace )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'test/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },                    
                    body: JSON.stringify({ 'scenarioID': scenarioID, 'action': action, 'comment': comment, 'testCondition': testCondition, 'functionID': functionID,
                     'parameter1': parameter1, 'parameter2': parameter2, 'parameter3': parameter3, 'parameter4': parameter4, 'active': active, 'position': position })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a test')
                }
                test.value = await data.json()
                consoleLog('addTest.js/addNewTest', 3, '--- createTest ---' + url + 'test/create', trace)
                consoleLog('addTest.js/addNewTest', 3, '--- Message: ' + test.value.message, trace)
                consoleLog('addTest.js/addNewTest', 3, test.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addTest.js/addNewTest', 3, error.value, trace)
        }
    }

    return { error, addNewTest }
}

export default addTest