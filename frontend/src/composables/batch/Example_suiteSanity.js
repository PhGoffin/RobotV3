/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-08-02
 * @Last Modified by: 
 * @Last Modified time: 2024-08-02 11:59:02
 * @Description: Execute a Suite sanity in batch mode
 */

// --------------------------------------------------------------------------
// Execute an API
// --------------------------------------------------------------------------
const execAPI = async (dataAPI) => {
    console.log('start a batch')
    try {

        const url = 'http://localhost:5000/api/'
        //let scenarioID = 101
        let data = await fetch(url + 'Selenium/robot/suite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'suiteName': dataAPI.suiteName, 'suiteID': dataAPI.suiteID, 'projectID': dataAPI.projectID, 'subprojectID': dataAPI.subprojectID, 'userID': dataAPI.userID })
        })        
        console.log('Data: ', data.ok)
        if (!data.ok) {
            throw Error('no scenario available')
        }
        let result = await data.json()
        console.log ('Data: ', result.data)  

    } catch (err) {
        console.log('execAPI - Error', err)
    }    
}

  // -----------------------------------------------------------
  // Call a suite to execute the scenario
  //
  // @param {string} data.suiteName     Name of the suite
  // @param {number} data.suiteID       ID of the suite
  // @param {number} data.projectID     ID of the project
  // @param {number} data.subprojectID  ID of the subproject
  // @param {number} data.userID        ID of the user
  //
  // -----------------------------------------------------------

const dataAPI = { suiteName: 'Suite for Sanity Test Batch mode', suiteID: 16, projectID: 1, subprojectID: 14,  userID: 2 }
execAPI(dataAPI)