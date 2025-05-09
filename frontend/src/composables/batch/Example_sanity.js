/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-08-02
 * @Last Modified by: 
 * @Last Modified time: 2024-08-02 11:33:24
 * @Description: Execute a sanity batch
 */

// --------------------------------------------------------------------------
// Execute an API
// --------------------------------------------------------------------------
const execAPI = async (dataAPI) => {
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
        console.log ('Data: ', result.data)  

    } catch (err) {
        console.log('execAPI - Error', err)
    }    
}

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

const dataAPI = { scenarioName: 'Sanity Test', scenarioID: 101, subprojectID: 14, projectID: 1, userID: 2 }
execAPI(dataAPI)