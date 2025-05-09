// --------------------------------------------------------------------------
// Execute an API
// --------------------------------------------------------------------------
const execAPI = async (scenarioID) => {
    console.log('start a batch')
    try {

        const url = 'http://localhost:5000/api/'
        //let scenarioID = 101
        let data = await fetch(url + 'scenario/' + scenarioID)
        console.log('Data: ', data.ok)
        if (!data.ok) {
            throw Error('no scenario available')
        }
        let scenario = await data.json()
        console.log ('Data: ', scenario.data)  

    } catch (err) {
        console.log('getScenario.js/loadScenario', err)
    }    
}
execAPI(101)




