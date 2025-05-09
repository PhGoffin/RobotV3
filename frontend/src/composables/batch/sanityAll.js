/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-08-02
 * @Last Modified by: 
 * @Last Modified time: 2024-08-02 15:39:16
 * @Description: Execute all sanity scenarios in batch mode
 */

// --------------------------------------------------------------------------
// Execute a Robot API
// --------------------------------------------------------------------------
const execRobotAPI = async (dataAPI) => {
    console.log('start a batch')
    try {

        const url = 'http://localhost:5000/api/'
        //let scenarioID = 101
        let data = await fetch(url + 'Selenium/robot/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'scenarioName': dataAPI.scenarioName, 'scenarioID': dataAPI.scenarioID, 'subprojectID': dataAPI.subprojectID, 'projectID': dataAPI.projectID, 'userID': dataAPI.userID })
        })
        console.log('Data: ', data.ok)
        if (!data.ok) {
            throw Error('no scenario available')
        }
        let result = await data.json()
        console.log('Data: ', result.data)

    } catch (err) {
        console.log('execRobotAPI - Error', err)
    }
}


// --------------------------------------------------------------------------
// Execute a Logfile API
// --------------------------------------------------------------------------
const execLogfileAPI = async (dataAPI) => {
    try {

        const url = 'http://localhost:5000/api/'
        //let scenarioID = 101
        let data = await fetch(url + 'logfile/export', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'userID': dataAPI.userID, 'reset': dataAPI.reset, 'filename': dataAPI.filename })
        })
        console.log('Data: ', data.ok)
        if (!data.ok) {
            throw Error('no logfile available')
        }
        let result = await data.json()
        console.log('Data: ', result.data)

    } catch (err) {
        console.log('execLogfileAPI - Error', err)
    }
}



const execSanity = async () => {

// -----------------------------------------------------------
// Call the API to execute tests in a scenario (POST)
//
// @param {string} data.scenarioName  Name of the scenario
// @param {number} data.scenarioID    ID of the scenario
// @param {number} data.subprojectID  ID of the subproject
// @param {number} data.projectID     ID of the subproject
// @param {number} data.userID        ID of the user
//
// -----------------------------------------------------------

// Sanity INT
let dataAPI = { scenarioName: 'Sanity check on INT', scenarioID: 98, subprojectID: 14, projectID: 1, userID: 2 }
await execRobotAPI(dataAPI)
dataAPI = { userID: 2, reset: 1, filename: './data/batchlog.json' }
await execLogfileAPI(dataAPI)

// Sanity ACC
dataAPI = { scenarioName: 'Sanity check on ACC', scenarioID: 95, subprojectID: 14, projectID: 1, userID: 2 }
await execRobotAPI(dataAPI)
dataAPI = { userID: 2, reset: 0, filename: './data/batchlog.json' }
await execLogfileAPI(dataAPI)

/*
// Sanity TRAIN
dataAPI = { scenarioName: 'Sanity check on TRAIN', scenarioID: 99, subprojectID: 14, projectID: 1, userID: 2 }
execRobotAPI(dataAPI)
dataAPI = { userID: 2, reset: 0, filename: './data/batchlog.json' }
await execLogfileAPI(dataAPI)

// Sanity PROD
dataAPI = { scenarioName: 'Sanity check on PROD', scenarioID: 100, subprojectID: 14, projectID: 1, userID: 2 }
execRobotAPI(dataAPI)
dataAPI = { userID: 2, reset: 0, filename: './data/batchlog.json' }
await execLogfileAPI(dataAPI)

// Notification
dataAPI = { scenarioName: 'Sanity Notification', scenarioID: 97, subprojectID: 14, projectID: 1, userID: 2 }
execRobotAPI(dataAPI)
dataAPI = { userID: 2, reset: 0, filename: './data/batchlog.json' }
await execLogfileAPI(dataAPI)

*/

}

execSanity()

