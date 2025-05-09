<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ subprojectName }}<br>-- Scenarios --</h3>
                <img src="./../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="scenario">

                <p>&nbsp;</p>
                <button @click="handleAdd" v-if="!backToScenarioID">
                    <i class="fa-solid fa-circle-plus" title="Insert a scenario"></i>
                    Scenario</button>
                <button @click="handleImport()" class="action" title="Import a scenario from your workspace"
                    v-if="!backToScenarioID">
                    <i class="fa-solid fa-download"></i>
                    Import</button>

                <button @click="handleLogfile" title="View the logfile" v-if="!backToScenarioID">
                    <i class="fa-regular fa-eye"></i>
                    Logfile</button>

                <form @submit.prevent="handleSubmit">

                    <div class="actions3">
                        <div class="input-container focus" style="min-width: 30rem; max-width: 30rem">
                            <input type="text" name="dataFilter" class="input" @focus="handleFocus($event)"
                                title="You can filter by the code, label or by comment" @blur="handleBlur($event)"
                                v-model="filterValue" />
                            <label>Filter {{ filteredRows }}</label>
                            <span>Filter {{ filteredRows }}</span>
                        </div>
                        <i class="fa-regular fa-trash-can" @click="filterValue = ''" title="Reset the filter"></i>
                    </div>
                    <h3 class="subtitle" v-if="backToScenarioID">Select a scenario for the import of the test(s)</h3>

                </form>

                <div class="entities" height="150px">
                    <div v-if="error"> {{ error }}</div>
                    <div v-if="scenarios.length" class="layout">
                        <ScenariosList class="scenariosList" :scenarios="filteredData" :workspaceID="workspaceID"
                            :workspace="workspace" :superUser="superUser" :projectID="projectID" :userID="userID"
                            :currentuser="userName" :location="location" :trace="trace" @selectrecord="selectRecord"
                            @handlecopy="handleCopy" @handlemove="handleMove" @refreshscenarios="refreshScenarios"
                            @storelocation="storeLocation" />
                    </div>
                </div>

                <div class="input-group">
                    <button @click="handleCancel" class="cancel">
                        <i class="fa-solid fa-ban"></i>
                        OK</button>
                </div>

            </div>
        </div>


    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import ScenariosList from '../../components/scenario/ScenariosList.vue'
import getAllScenariosBySubproject from '../../composables/scenario/getAllScenariosBySubproject'
import updatePositionScenario from '../../composables/scenario/updatePositionScenario'
import reorderScenarios from '../../composables/scenario/reorderScenarios'
import copyScenario from '../../composables/scenario/copyScenario'
import copyAllTests from '../../composables/test/copyAllTests'
import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Scenarios',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected', 'workspaceID', 'workspace',
        'projectID', 'projectName', 'subprojectID', 'subprojectName', 'location'],
    components: { ScenariosList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('Scenarios.vue', trace.value)
        consoleLog('Scenarios.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }


        const location = ref(props.location)
        const workspaceID = ref(props.workspaceID)
        const workspace = ref(props.workspace)
        const userID = ref(props.userID)
        const superUser = ref(props.superUser)
        const subprojectID = ref(props.subprojectID)
        const subprojectName = ref(props.subprojectName)
        const scenarios = ref([])
        const backToScenarioID = ref(0)
        const displayInfo = ref('')
        const filterValue = ref('')
        const recordSelected = ref([])
        const suiteID = ref(0)
        const storyID = ref(0)

        const userName = ref(props.currentuser)
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
        const year = currentDate.getFullYear();
        let today = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year


        // -----------------------------------------------------------------------
        // Check if we come from the suite vue
        // Syntax is: suite=<suiteID>
        // -----------------------------------------------------------------------
        if (location.value.includes('suite=')) {
            // split the location to find the keyword
            let data = location.value.split("=");
            suiteID.value = data[1]
        } else if (location.value.includes('story=')) {
            // split the location to find the keyword
            let data = location.value.split("=");
            storyID.value = data[1]
        } else if (location.value.includes('testimport=')) {
            // split the location to find the keyword
            let data = location.value.split("=");
            backToScenarioID.value = data[1]
        } else if (location.value.includes('backtotest=')) {
            context.emit('storelocation', 'controlpanel')
            // split the location to find the keyword
            let data = location.value.split("=");
            backToScenarioID.value = data[1]
            router.push({ name: 'Tests', params: { id: backToScenarioID.value } })
        }



        // -------------------------------------------
        // Management of the errors
        // -------------------------------------------
        const errorMessage = ref('')
        const styleMessage = ref('')

        // --------------------------------------------------------------------------
        // Execute a function from an error message
        // --------------------------------------------------------------------------
        const displayErrorFunction = (myCallback) => {
            errorMessage.value = ''
            if (myCallback != null && myCallback != undefined) {
                // call the function
                myCallback()
            }
        }

        // --------------------------------------------------------------------------
        // Display error message on the screen and trigger a function after a delay
        // --------------------------------------------------------------------------
        const DisplayError = (myMessage, myStyle, myCallback) => {
            errorMessage.value = myMessage
            styleMessage.value = myStyle.toLowerCase()
            consoleLog('Scenarios.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        // --------------------------------------------------------------------------
        // User set the focus on a field
        // --------------------------------------------------------------------------
        const handleFocus = (event) => {
            event.target.parentElement.classList.add("focus")
        }

        // --------------------------------------------------------------------------
        // User leave a field
        // --------------------------------------------------------------------------
        const handleBlur = (event) => {
            if (event.target.value == "") {
                event.target.parentElement.classList.remove("focus")
            }
        }


        const loadScenarioData = async () => {
            // -------------------------------------------
            // load all the scenarios of the subproject 
            // -------------------------------------------
            consoleLog('Scenarios.vue/loadScenarioData', 2, 'Loading scenario by subproject', trace.value)
            const { error, loadScenarios } = getAllScenariosBySubproject(subprojectID.value)
            loadScenarios(scenarios, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Scenarios.vue/loadScenarioData', 2, 'Scenarios Load by subproject status: ' + scenarios.value.success, trace.value)
                    if (scenarios.value.success && scenarios.value.data.length) {
                        scenarios.value = scenarios.value.data
                        filteredData.value = scenarios.value
                        consoleLog('Scenarios.vue/loadScenarioData', 2, scenarios, trace.value)
                        return (1)
                    } else {
                        consoleLog('Scenarios.vue/loadScenarioData', 2, 'No scenario found!', trace.value)
                        return (0)
                    }
                })
        }


        // Load projects data
        loadScenarioData()


        // ---------------------------------------------
        // Compute the scenarios depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('Scenarios.vue/filteredData', 2, 'computed value', trace.value)
            if (scenarios.value.length) {
                return scenarios.value.filter((ar) => ar.scenario.toUpperCase().includes(filterValue.value.toUpperCase()))
            } else {
                filteredRows.value = ''
                return scenarios.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })

        // --------------------------------------------------------------------------
        // ProjectSingle emits a request to refresh the contracts
        // --------------------------------------------------------------------------
        const refreshScenarios = (status, msg, reload) => {
            consoleLog('Scenarios.vue/refreshScenarios', 2, 'received a request to refresh the scenarios from ScenariosList / ScenarioSingle', trace.value)
            consoleLog('Scenarios.vue/refreshScenarios', 2, 'Code: ' + status + ', message: ' + msg, trace.value)

            if (msg == "Browser not responding!") {
                DisplayError('User kills the browser!', 'Alert')
                //router.push({ name: 'Login' })
            } else {
                if (status == 1) {
                    DisplayError(msg, 'Info')
                } else {
                    DisplayError(msg, 'Alert')
                }
                if (reload) loadScenarioData()

            }
        }


        // --------------------------------------------------------------------------
        // Call the API to reorder correctly all the positions of the scenarios 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let scenario = []
            consoleLog('Scenarios.vue/doReorder', 2, 'Reorder all the positions of the Scenarios', trace.value)
            const { error, reorderTheScenarios } = reorderScenarios(subprojectID.value)
            return await reorderTheScenarios(scenario, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Scenarios.vue/doReorder', 2, 'Scenario reorder status: ' + scenario.value.success, trace.value)
                    if (scenario.value.success) {
                        consoleLog('Scenarios.vue/doReorder', 2, scenario, trace.value)
                        return (1)
                    } else {
                        consoleLog('Scenarios.vue/doReorder', 2, 'Error during the reorder of the scenarios position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to copy a scenario 
        // --------------------------------------------------------------------------
        const doCopy = async (scenarioID, position) => {
            let scenario = []
            consoleLog('Scenarios.vue/doCopy', 2, 'Copy an existing Scenario - scenarioID: ' + scenarioID + ' at position: ' + position, trace.value)
            const { error1, copyTheScenario } = copyScenario(scenarioID, position, userName.value, today)
            await copyTheScenario(scenario, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Scenarios.vue/doCopy', 2, 'Scenario copy status: ' + scenario.value.success, trace.value)
                    if (scenario.value.success) {
                        consoleLog('Scenarios.vue/doCopy', 2, scenario, trace.value)
                        return (1)
                    } else {
                        consoleLog('Scenarios.vue/doCopy', 2, 'Error during the copy of a scenario', trace.value)
                        return (0)
                    }
                })

            // Get the ID of the new copied scenario
            let Id = scenario.value.id
            let test = []

            consoleLog('Scenarios.vue/doCopy', 2, 'Copy all linked Tests - scenarioID: ' + scenarioID + ' ,Id: ' + Id, trace.value)
            const { error2, copyTheTest } = copyAllTests(Id, scenarioID)
            return await copyTheTest(test, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Scenarios.vue/doCopy', 2, 'Full Test copy status: ' + test.value.success, trace.value)
                    if (test.value.success) {
                        consoleLog('Scenarios.vue/doCopy', 2, test, trace.value)
                        return (1)
                    } else {
                        consoleLog('Scenarios.vue/doCopy', 2, 'Error during the copy of the full tests', trace.value)
                        return (0)
                    }
                })

        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a scenario 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (scenarioID, position) => {

            let scenario = []
            consoleLog('Scenarios.vue/doUpdatePosition', 2, 'Change the position of a Scenario - scenarioID: ' + scenarioID + ', position: ' + position, trace.value)
            const { error, updateThePosition } = updatePositionScenario(scenarioID, position)
            return await updateThePosition(scenario, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('Scenarios.vue/doUpdatePosition', 2, 'Scenario status: ' + scenario.value.success, trace.value)
                    if (scenario.value.success) {
                        consoleLog('Scenarios.vue/doUpdatePosition', 2, scenario, trace.value)
                        return (1)
                    } else {
                        consoleLog('Scenarios.vue/doUpdatePosition', 2, 'Error during the update of the scenario position', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // User asks to go to the Import screen
        // --------------------------------------------------------------------------
        const handleImport = () => {
            consoleLog('Scenarios.vue/handleImport', 2, 'User asks to go to the Import screen', trace.value)
            router.push({ name: 'ScenarioImport' })
        }


        // --------------------------------------------------------------------------
        // User cancel the action, Back to the control panel
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('Scenarios.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            if (location.value.includes('suite=')) {
                //router.go (-1)
                router.push({ name: 'SuiteEdit', params: { id: suiteID.value } })
            } else if (location.value.includes('aidashboard')) {
                router.push({ name: 'AIDashboard' })
            } else if (location.value.includes('story=')) {
                router.push({ name: 'StoryEdit', params: { id: storyID.value } })
            } else if (backToScenarioID.value) {
                context.emit('storelocation', 'controlpanel')
                router.push({ name: 'Tests', params: { id: backToScenarioID.value } })
            } else {
                router.push({ name: 'ControlPanel' })
            }
        }


        // --------------------------------------------------------------------------
        // User asks to add a new project
        // --------------------------------------------------------------------------
        const handleAdd = () => {
            consoleLog('Scenarios.vue/handleAdd', 2, 'Add a new scenario', trace.value)
            router.push({ name: 'ScenarioAdd' })
        }

        // --------------------------------------------------------------------------
        // ScenarioList emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = (location) => {
            consoleLog('Scenarios.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
            context.emit('storelocation', location)
        }

        // --------------------------------------------------------------------------
        // Scenario received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (scenarioID) => {
            consoleLog('Scenarios.vue/selectRecord', 2, 'Received a request to select a record: ' + scenarioID, trace.value)
            if (!recordSelected.value.includes(scenarioID)) {
                recordSelected.value.push(scenarioID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != scenarioID)
            }
            consoleLog('Scenarios.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('Scenarios.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // Scenarios received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('Scenarios.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' scenario(s) after the Scenario position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to copy before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                let originalPosition = position
                position = position.padStart(6, '0') + 'C'
                //console.log (' ******** 1 ******* Loop')
                // Copy all the selected scenario(s)
                for (let recordID of recordSelected.value) {
                    position = originalPosition.padStart(6, '0') + 'C'
                    position = position + counter
                    counter = counter + 1
                    if (await doCopy(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the copy of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected scenario(s) copy successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadScenarioData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Scenarios received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('Scenarios.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' scenario(s) after the Scenario position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                let originalPosition = position
                position = position.padStart(6, '0') + 'M'
                consoleLog('Scenarios.vue/handleMove', 2, '************** Position: ' + position, trace.value)
                //position = position.padStart(6, '0') + 'M'
                //console.log (' ******** 1 ******* Loop')
                // Update the position of all the selected scenario(s)
                for (let recordID of recordSelected.value) {
                    position = originalPosition.padStart(6, '0') + 'M'
                    position = position + counter
                    counter = counter + 1
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected scenario(s) reorder successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadScenarioData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // User ask to go to the logfile
        // --------------------------------------------------------------------------
        const handleLogfile = () => {
            consoleLog('Dashboard.vue/handleLogfile', 2, 'User want to view the Logfile', trace.value)
            context.emit('storelocation', 'scenario')
            router.push({ name: 'Logfiles' })
        }


        return {
            errorMessage, styleMessage, scenarios, filteredData, filterValue, filteredRows, subprojectID, subprojectName,
            workspaceID, workspace, superUser, userID, userName, displayInfo, trace, backToScenarioID,
            handleCancel, handleAdd, refreshScenarios, handleFocus, handleBlur, storeLocation, selectRecord,
            handleCopy, handleMove, handleLogfile, handleImport
        }


    }

}
</script>

<style scoped>
.custom-font {
    font-family: 'Quicksand', sans-serif;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body,
input,
textarea,
select {
    font-family: 'Quicksand', sans-serif;
    font-size: large;
}

span,
label,
title {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    font-size: large;
}

.my-container {
    position: relative;
    width: 100%;
    height: 100%;
    /* min-height: 100vh; */
    padding: 5rem;
    background-color: #fafafa;
    overflow: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form {
    width: 85%;
    /* max-width: 2000px; */
    min-height: 65vh;
    background-color: #eee;
    border-radius: 3rem;
    box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    overflow: hidden;
    display: grid;
    /* grid-template-columns: repeat(2, 1fr); */
    grid-template-columns: 30% 1fr;

}

.banner {
    background-color: #1abc9c;
    position: relative;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.banner .message {
    position: absolute;
    bottom: 1rem;
    left: 10%;
    width: 80%;
    max-width: 80%;
    max-height: 15%;
    height: 15%;
    padding: 1.2rem;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.2);
}

.banner .message.alert {
    background-color: #d1a8a8;
    color: #fff;
}

.banner .message.warning {
    background-color: #f1d995;
    color: black;
}

.banner .message.info {
    background-color: #a7c4e6;
    color: black;
}

.banner .popup {
    position: absolute;
    bottom: 5%;
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    left: 10%;
}

.popup .message {
    border-radius: 3rem;
    padding: 2.3rem 2.2rem;
    color: black;
    background: #eb84ad;
}

.popup .info {
    border-radius: 3rem;
    padding: 2.3rem 2.2rem;
    color: black;
    background: #beb5b8;
}

.popup .buttonGroup {
    display: flex;
    align-items: center;
    justify-content: center;

}

.popup .button {
    padding: 0.6rem 1.3rem;
    font-size: large;
    color: white;
    line-height: 1;
    border-radius: 25px;
    outline: none;
    cursor: pointer;
    transition: 0.3s;
    margin: 1.3rem 0.5rem 0.5rem 0;
}

.popup .button.yes {
    background-color: #beb5b8;
    border: 2px solid black;
}

.popup .button.no {
    background-color: #787a7a;
    border: 2px solid black;
}


.popup .button:hover {
    background-color: white;
    color: black;
}


.banner img {
    position: absolute;
    top: 8rem;
    width: 12rem;
    height: 12rem;
    max-width: 12rem;
    max-height: 12rem;
    animation: rotatehead 1.0s linear;
}

@keyframes rotatehead {
    from {
        transform: rotate(0deg) scale(0.5);
        /* left: -20% */
    }

    to {
        transform: rotate(360deg) scale(1);
        /* left: 45% */
    }
}

.title {
    padding: 2.3rem 2.2rem;
    color: #fff;
    font-weight: bold;
    font-size: 1.5rem;
    line-height: 1;
    margin-bottom: 0.7rem;
}

.subtitle {
    padding: 1rem 1rem;
    background-color: #cfc9c9;
    color: #1abc9c;
    border-radius: 25px;
}

.scenario {
    /* padding: 2.3rem 2.2rem; */
    position: relative;
    background-color: #eee;
}


form {
    padding: 0 2.3rem 0 2.2rem;
    z-index: 10;
    overflow: hidden;
    position: relative;
}

.input-container {
    position: relative;
    margin: 1rem 0;
}

.input {
    width: 100%;
    outline: none;
    border: 2px solid #3d3c3c;
    background: none;
    padding: 0.6rem 1.2rem;
    color: #3d3c3c;
    font-weight: 500;
    font-size: 0.95rem;
    letter-spacing: 0.5px;
    border-radius: 25px;
    transition: 0.3s;
}

.input.disabled {
    background-color: #d3dad8;
}

textarea.input {
    padding: 0.8rem 1.2rem;
    min-height: 150px;
    border-radius: 22px;
    resize: none;
    overflow-y: auto;
}

option {
    width: 100%;
    outline: none;
    border: 2px solid #3d3c3c;
    background-color: #d8d6d6;
    padding: 0.6rem 1.2rem;
    color: #3d3c3c;
    font-weight: 700;
    font-size: 0.95rem;
    letter-spacing: 0.5px;
    border-radius: 25px;
    transition: 0.3s;
}

.input-container label {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
    padding: 0 0.4rem;
    color: #3d3c3c;
    font-size: 0.9rem;
    font-weight: 700;
    pointer-events: none;
    z-index: 1000;
    transition: 0.5s;
}

.input-container.textarea label {
    top: 1rem;
    transform: translateY(0);
}

button {
    padding: 0.6rem 1.3rem;
    background-color: #1abc9c;
    border: 2px solid black;
    font-size: large;
    color: white;
    line-height: 1;
    border-radius: 25px;
    outline: none;
    cursor: pointer;
    transition: 0.3s;
    margin: 1.3rem 0.5rem 0.5rem 0;
}

button:hover {
    background-color: transparent;
    color: black;
}

button.cancel {
    background-color: #787a7a;
}

button.cancel:hover {
    background-color: white;
    color: black;
}

.input-container span {
    position: absolute;
    top: 0;
    left: 25px;
    transform: translateY(-50%);
    font-size: 0.8rem;
    padding: 0 0.4rem;
    color: transparent;
    pointer-events: none;
    z-index: 500;
}

.input-container span:before,
.input-container span:after {
    content: "";
    position: absolute;
    width: 10%;
    opacity: 0;
    transition: 0.3s;
    height: 5px;
    background-color: white;
    top: 50%;
    transform: translateY(-50%);
}

.input-container span:before {
    left: 50%;
}

.input-container span:after {
    right: 50%;
}

.input-container.focus label {
    top: 0;
    transform: translateY(-50%);
    left: 25px;
    font-size: 0.8rem;
}

.input-container.focus span:before,
.input-container.focus span:after {
    width: 50%;
    opacity: 1;
    background-color: #eee;
    height: 100%;
}

button.action {
    background-color: #7cbcbc;
}

button.action:hover {
    background-color: white;
    color: black;
}


.actions3 {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.actions3 i {
    font-size: 24px;
    margin-left: 10px;
    color: #bbb;
    cursor: pointer;
}

.actions3 i.blue {
    font-size: 24px;
    margin-left: 10px;
    color: #072af5;
    cursor: pointer;
}

.actions3 i.green {
    font-size: 24px;
    margin-left: 10px;
    color: #07ca62;
    cursor: pointer;
}

.actions3 i:hover {
    color: #777;
}

.entities {
    overflow: scroll;
    /* scrollbar-color: red orange; */
    scrollbar-width: thin;
    height: 50rem;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>