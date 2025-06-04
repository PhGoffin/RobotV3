/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-08-02
 * @Last Modified by: 
 * @Last Modified time: 2024-11-15 12:12:00
 * @Description: Execute a ExecuteBatch
 */

// --------------------------------------------------------------------------
// Execute an API
// --------------------------------------------------------------------------
const execAPI = async (dataAPI) => {
    console.log('start a batch')
    try {

        const url = 'http://localhost:5000/api/'
        //let scenarioID = 101
        let data = await fetch(url + 'playwright/robot/test', {
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
  // @param {number} data.subprojectID  ID of the subproject (14 = Prospect 17 = Prospect Labs)
  // @param {number} data.projectID     ID of the subproject (85 = Prospect)
  // @param {number} data.userID        ID of the user ( 2 = Phil)
  //
  // -----------------------------------------------------------

const dataAPI = { scenarioName: 'ExecuteBatch', scenarioID: 178, subprojectID: 17, projectID: 85, userID: 2 }
execAPI(dataAPI)