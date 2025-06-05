<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ scenarioName }}<br>-- Tests --</h3>

                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <button @click="handleInsert('0')" title="Insert a test" v-if="!backToScenarioID">
                    <i class="fa-solid fa-circle-plus"></i>
                    Test</button>

                <button @click="processImport()" title="Import selected test(s)" v-if="backToScenarioID">
                    <i class="fa-solid fa-download"></i>
                    Import Selected Row(s)</button>

                <button @click="handleImport()" class="action" title="Import a test from your project"
                    v-if="!backToScenarioID">
                    <i class="fa-solid fa-download"></i>
                    Import</button>

                <button @click="handleExport" class="action" title="Export current tests into a .json file"
                    v-if="!backToScenarioID">
                    <i class="fa-solid fa-file-code"></i>
                    JSON Export</button>
                <a :href="URL + jsonFile" :key="jsonFile" v-if="!backToScenarioID && viewLink">{{ jsonFile }}</a>


                <form @submit.prevent="">

                    <table>
                        <tbody>
                        <tr>
                            <td class="menu">
                                <div class="input-container focus" style="max-width: 10rem" v-if="!backToScenarioID">
                                    <input type="text" name="RowNb" class="input" @focus="handleFocus($event)"
                                        @blur="handleBlur($event)" @change="handleRowToInsert" v-model="rowToInsert"
                                        required />
                                    <label>Row(s) to insert</label>
                                    <span>Row(s) to insert</span>
                                </div>
                            </td>
                            <td class="menu">
                                <div class="actions3">
                                    <div class="input-container focus" style="min-width: 30rem; max-width: 30rem">
                                        <input type="text" name="dataFilter" class="input" @focus="handleFocus($event)"
                                            title="You can filter by the code, label or by comment or =<position>"
                                            @blur="handleBlur($event)" v-model="filterValue" />
                                        <label>Filter {{ filteredRows }}</label>
                                        <span>Filter {{ filteredRows }}</span>
                                    </div>
                                    <i class="fa-regular fa-trash-can" @click="filterValue = ''"
                                        title="Reset the filter"></i>
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    <input type="radio" id="type1" value="0" v-model="commentSwitch" /><label
                                        for="type1">All&nbsp;&nbsp;</label>
                                    <input type="radio" id="type2" value="1" v-model="commentSwitch" /><label
                                        for="type2">Business&nbsp;&nbsp;</label>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <h3 class="subtitle" v-if="backToScenarioID">Select the Test(s) to import</h3>


                </form>


                <div class="entities" height="150px">
                    <div v-if="error"> {{ error }}</div>
                    <div v-if="filteredData.length" class="layout">
                        <TestsList class="referencesList" :tests="filteredData" :workspaceID="workspaceID"
                            :workspace="workspace" :superUser="superUser" :projectID="projectID" :userID="userID"
                            :trace="trace" :location="location" @refreshtests="refreshTests"
                            @selectrecord="selectRecord" @handleinsert="handleInsert" @handlecopy="handleCopy"
                            @handlemove="handleMove" @handledelete="handleDelete" @storelocation="storeLocation" />
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
import TestsList from '../../components/test/TestsList.vue'
import getScenario from '../../composables/scenario/getScenario'
import getTestsByScenario from '../../composables/test/getTestsByScenario'
import updatePositionTest from '../../composables/test/updatePositionTest'
import reorderTests from '../../composables/test/reorderTests'
import addTest from '../../composables/test/addTest'
import copyTest from '../../composables/test/copyTest'
import importTest from '../../composables/test/importTest'
import exportTest from '../../composables/test/exportTest'
import deleteTest from '../../composables/test/deleteTest'

import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Test',
    props: ['trace', 'id', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'location'],
    components: { TestsList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const rowToInsert = ref(1)


        displayMsg('Tests.vue', trace.value)
        consoleLog('Tests.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }


        const workspaceID = ref(props.workspaceID)
        const workspace = ref(props.workspace)
        const projectID = ref(props.projectID)
        const userID = ref(props.userID)
        const userName = ref(props.currentuser)
        const superUser = ref(props.superUser)
        const scenario = ref([])
        const scenarioID = ref(props.id)
        const backToScenarioID = ref(0)
        const scenarioName = ref('')
        const tests = ref([])
        const displayInfo = ref('')
        const location = ref(props.location)
        const filterValue = ref('')
        const URL = ref(process.env.VUE_APP_MYSQL_API + 'test/download/')
        const jsonFile = ref(userName.value + '_test.json')
        const viewLink = ref(false)
        const commentSwitch = ref(0)



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
            consoleLog('Tests.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }

        // Manage the parameters value: Check if we come from the import
        // Syntax is: testimport/<scenario>
        if (location.value.includes('testimport=')) {
            // split the location to find the keyword
            let data = location.value.split("=");
            backToScenarioID.value = data[1]
            recordSelected.value = []
        }



        // -------------------------------------------
        // load all the data of the scenario 
        // -------------------------------------------
        const { error, loadScenario } = getScenario(scenarioID.value)
        loadScenario(scenario, trace.value)
            .then(function () {
                // check the status of the load
                consoleLog('Tests.vue/getScenario', 2, 'Tests Loading a scenario status: ' + scenario.value.success, trace.value)
                if (scenario.value.success && scenario.value.data.length) {
                    scenario.value = scenario.value.data
                    consoleLog('Tests.vue/loadTestData', 2, scenario.value, trace.value)
                    scenarioName.value = scenario.value[0].scenario
                    return (1)
                } else {
                    consoleLog('Tests.vue/loadTestData', 2, 'No scenario found!', trace.value)
                    return (0)
                }
            })

        const loadTestData = async () => {
            // -------------------------------------------
            // load all the tests of a scenario
            // -------------------------------------------
            consoleLog('Tests.vue/loadTestData', 2, 'Loading test by scenario', trace.value)
            const { error, loadTest } = getTestsByScenario(scenarioID.value)
            loadTest(tests, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Tests.vue/loadTestData', 2, 'Tests Load by scenario status: ' + tests.value.success, trace.value)
                    if (tests.value.success && tests.value.data.length) {
                        tests.value = tests.value.data
                        filteredData.value = tests.value
                        consoleLog('Tests.vue/loadTestData', 2, tests.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('Tests.vue/loadTestData', 2, 'No test found!', trace.value)
                        return (0)
                    }
                })
        }


        // Load projects data
        loadTestData()


        // ---------------------------------------------
        // Compute the references depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('Tests.vue/filteredData', 2, 'computed value', trace.value)
            if (tests.value.length) {

                if (commentSwitch.value == 0) {
                    return tests.value.filter((ar) => ar.action.toUpperCase().includes(filterValue.value.toUpperCase())
                        || ar.comment.toUpperCase().includes(filterValue.value.toUpperCase()) || '=' + ar.position == filterValue.value)

                } else {
                    return tests.value.filter((ar) => (ar.action.toUpperCase().includes(filterValue.value.toUpperCase())
                        || ar.comment.toUpperCase().includes(filterValue.value.toUpperCase()) || '=' + ar.position == filterValue.value) && ar.commentType == commentSwitch.value)

                }
            } else {
                filteredRows.value = ''
                return tests.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })


        // --------------------------------------------------------------------------
        // ReferenceSingle emits a request to refresh the references
        // --------------------------------------------------------------------------
        const refreshTests = (status, msg) => {
            consoleLog('Tests.vue/refreshTests', 2, 'received a request to refresh the tests  from TestList / TestSingle', trace.value)
            consoleLog('Tests.vue/refreshTests', 2, 'status: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadTestData()
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


        // --------------------------------------------------------------------------
        // User cancel the action, Back to the Scenarios
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('Tests.vue/handleCancel', 2, 'User Cancel the action - backToScenarioID: ' + backToScenarioID.value, trace.value)
            if (!backToScenarioID.value) {
                router.push({ name: 'Scenarios' })
            } else {
                context.emit('storelocation', 'backtotest=' + backToScenarioID.value)
                router.push({ name: 'Scenarios' })
            }
        }

        // --------------------------------------------------------------------------
        // User asks to go to the Import screen to import
        // --------------------------------------------------------------------------
        const handleImport = () => {
            consoleLog('Tests.vue/handleImport', 2, 'User asks to go to the Import screen', trace.value)
            context.emit('storelocation', 'testimport=' + scenarioID.value)
            router.push({ name: 'Scenarios' })
        }

        // --------------------------------------------------------------------------
        // User asks to Export tests into a json file
        // --------------------------------------------------------------------------
        const handleExport = async (event) => {
            let ret = await doExport()
            if (ret) viewLink.value = true
        }

        // --------------------------------------------------------------------------
        // User change the row number
        // --------------------------------------------------------------------------
        const handleRowToInsert = () => {
            if (rowToInsert.value < 1 || rowToInsert.value > 10) {
                DisplayError('Row(s) to insert must be between 1 and 10', 'Warning')
                rowToInsert.value = 1
            }
        }


        // --------------------------------------------------------------------------
        // Call the API to reorder correctly all the positions of the references 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let test = []
            consoleLog('Tests.vue/doReorder', 2, 'Reorder all the positions of the Tests', trace.value)
            const { error, reorderTheTest } = reorderTests(scenarioID.value)
            return await reorderTheTest(test, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Tests.vue/doReorder', 2, 'Test reorder status: ' + test.value.success, trace.value)
                    if (test.value.success) {
                        consoleLog('Tests.vue/doReorder', 2, test, trace.value)
                        return (1)
                    } else {
                        consoleLog('Tests.vue/doReorder', 2, 'Error during the reorder of the tests position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to import a test 
        // --------------------------------------------------------------------------
        const doImport = async (position, recordID) => {
            let test = []

            consoleLog('Tests.vue/doImport', 2, 'Import a Test', trace.value)
            const { error, importTheTest } = importTest(backToScenarioID.value, position, recordID)
            return await importTheTest(test, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Tests.vue/doImport', 2, 'Test import status: ' + test.value.success, trace.value)
                    if (test.value.success) {
                        consoleLog('Tests.vue/doImport', 2, test, trace.value)
                        return (1)
                    } else {
                        consoleLog('Tests.vue/doImport', 2, 'Error during the import of a test', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to export the tests into a json file 
        // --------------------------------------------------------------------------
        const doExport = async () => {
            let test = []
            let filename = './data/' + jsonFile.value

            consoleLog('Tests.vue/doExport', 2, 'Export Tests in ' + filename, trace.value)
            const { error, exportTheTest } = exportTest(scenarioID.value, filename)
            return await exportTheTest(test, trace.value)
                .then(function () {
                    // check the status of the export
                    consoleLog('Tests.vue/doExport', 2, 'Test export status: ' + test.value.success, trace.value)
                    if (test.value.success) {
                        consoleLog('Tests.vue/doExport', 2, test, trace.value)
                        return (1)
                    } else {
                        consoleLog('Tests.vue/doExport', 2, 'Error during the export of a test', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert a test 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let test = []
            const now = new Date();
            const currentDateTime = now.toLocaleString();
            let action = 'Step'
            let comment = 'New'

            consoleLog('Tests.vue/doInsert', 2, 'Insert a new Test', trace.value)
            const { error, addNewTest } = addTest(scenarioID.value, action, comment, '', 0, '', '', '', '', 1, position)
            return await addNewTest(test, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Tests.vue/doInsert', 2, 'Test insert status: ' + test.value.success, trace.value)
                    if (test.value.success) {
                        consoleLog('Tests.vue/doInsert', 2, test, trace.value)
                        return (1)
                    } else {
                        consoleLog('Tests.vue/doInsert', 2, 'Error during the insert of a test', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to copy a reference 
        // --------------------------------------------------------------------------
        const doCopy = async (testID, position) => {
            let test = []
            consoleLog('Tests.vue/doCopy', 2, 'Copy an existing Test - testID: ' + testID + ' at position: ' + position, trace.value)
            const { error, copyTheTest } = copyTest(testID, position)
            return await copyTheTest(test, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Tests.vue/doCopy', 2, 'Test copy status: ' + test.value.success, trace.value)
                    if (test.value.success) {
                        consoleLog('Tests.vue/doCopy', 2, test, trace.value)
                        return (1)
                    } else {
                        consoleLog('Tests.vue/doCopy', 2, 'Error during the copy of a test', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a test 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (testID, position) => {

            let test = []
            consoleLog('Tests.vue/doUpdatePosition', 2, 'Change the position of a Test - testID: ' + testID + ', position: ' + position, trace.value)
            const { error, updateThePosition } = updatePositionTest(testID, position)
            return await updateThePosition(test, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('Tests.vue/doUpdatePosition', 2, 'Test status: ' + test.value.success, trace.value)
                    if (test.value.success) {
                        consoleLog('Tests.vue/doUpdatePosition', 2, test, trace.value)
                        return (1)
                    } else {
                        consoleLog('Tests.vue/doUpdatePosition', 2, 'Error during the update of the test position', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete a test 
        // --------------------------------------------------------------------------
        const doDelete = async (testID) => {
            let test = []
            consoleLog('Tests.vue/doDelete', 2, 'Delete an existing Test - testID: ' + testID, trace.value)
            const { error, deleteTheTest } = deleteTest(testID)
            return await deleteTheTest(test, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Tests.vue/doDelete', 2, 'Delete delete status: ' + test.value.success, trace.value)
                    if (test.value.success) {
                        consoleLog('Tests.vue/doDelete', 2, test, trace.value)
                        return (1)
                    } else {
                        consoleLog('Tests.vue/doDelete', 2, 'Error during the delete of a test', trace.value)
                        return (0)
                    }
                })
        }



        // --------------------------------------------------------------------------
        // Tests received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (testID) => {
            consoleLog('Tests.vue/selectRecord', 2, 'Received a request to select a record: ' + testID, trace.value)
            if (!recordSelected.value.includes(testID)) {
                recordSelected.value.push(testID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != testID)
            }
            consoleLog('Tests.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('Tests.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // Tests received a request to add a new Test
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('Tests.vue/handleInsert', 2, 'Add ' + rowToInsert.value + ' new empty test(s) after the position: ' + position, trace.value)
            let originalPosition = position
            position = position.padStart(6, '0') + 'I'
            let status = 1;
            for (let i = 1; i <= rowToInsert.value; i++) {
                //console.log (' ******** 1 ******* Loop: ' + i)
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a test', 'Alert')
            } else {
                DisplayError('Inserted ' + rowToInsert.value + ' test(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            //console.log (' ******** 2 ******* reorder')
            await doReorder()
            // Refresh the list
            //console.log (' ******** 3 ******* refresh')
            context.emit('storelocation', 'controlpanel=' + originalPosition)
            location.value = 'controlpanel=' + originalPosition
            await loadTestData()

        }


        // --------------------------------------------------------------------------
        // Tests received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('Tests.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' test(s) after the position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to copy before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                let originalPosition = position
                position = position.padStart(6, '0') + 'C'
                //console.log (' ******** 1 ******* Loop')
                // Copy all the selected reference(s)
                for (let recordID of recordSelected.value) {
                    position = originalPosition.padStart(6, '0') + 'C'
                    position = position + counter.toString().padStart(3, '0')
                    counter = counter + 1
                    if (await doCopy(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the copy of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected test(s) copy successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                context.emit('storelocation', 'controlpanel=' + originalPosition)
                location.value = 'controlpanel=' + originalPosition
                await loadTestData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Tests received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('Tests.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' test(s) after the position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                let originalPosition = position
                position = position.padStart(6, '0') + 'M'
                // Update the position of all the selected reference(s)
                for (let recordID of recordSelected.value) {
                    position = originalPosition.padStart(6, '0') + 'C'
                    position = position + counter.toString().padStart(3, '0')
                    counter = counter + 1
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected test(s) reorder successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                context.emit('storelocation', 'controlpanel=' + originalPosition)
                location.value = 'controlpanel=' + originalPosition
                await loadTestData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Tests received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (testID, position) => {
            consoleLog('Tests.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' test(s) and the Test: ' + testID, trace.value)
            let status = 1;
            let originalPosition = position - 1
            //console.log (' ******** 1 ******* Loop')

            // Add the testID if it's not already in the list
            if (!recordSelected.value.includes(testID)) {
                recordSelected.value.push(testID)
            }

            // Delete the selected reference(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected reference(s)', 'Alert')
            } else {
                DisplayError('Selected test(s) deleted successfully', 'Info')
            }
            // Refresh the list
            context.emit('storelocation', 'controlpanel=' + originalPosition)
            location.value = 'controlpanel=' + originalPosition
            await loadTestData()
            recordSelected.value = []
        }


        // --------------------------------------------------------------------------
        // Process Import
        // --------------------------------------------------------------------------
        const processImport = async () => {
            consoleLog('Tests.vue/processImport', 2, 'User asks to Import selected row(s)', trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to import...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                let position = 99999
                // Import all the selected reference(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doImport(position, recordID) == 0) status = 0
                }

                consoleLog('Tests.vue/processImport', 2, 'Reorder the Tests', trace.value)
                scenarioID.value = backToScenarioID.value
                await doReorder()
                recordSelected.value = []

                if (status == 0) {
                    DisplayError('Error during the import of the selected record(s)', 'Alert')
                } else {
                    context.emit('storelocation', 'backtotest=' + backToScenarioID.value)
                    router.push({ name: 'Scenarios' })
                }
            }
        }


        // --------------------------------------------------------------------------
        // TestsList emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = (location) => {
            consoleLog('Tests.vue/storeLocation', 2, 'Emit a request to the parent to update the location: ' + location, trace.value)
            context.emit('storelocation', location)
        }


        return {
            errorMessage, styleMessage, tests, filteredData, filterValue, filteredRows, workspaceID, workspace, commentSwitch,
            superUser, projectID, userID, displayInfo, trace, rowToInsert, scenarioName, backToScenarioID, location, URL, jsonFile, viewLink,
            handleCancel, refreshTests, handleInsert, handleCopy, handleMove, handleDelete, selectRecord,
            handleFocus, handleBlur, handleCancel, handleRowToInsert, handleImport, handleExport, processImport, storeLocation
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
    width: 100%;
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
    /* max-width: 20rem; */
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
    width: 15rem;
    height: 15rem;
    max-width: 15rem;
    max-height: 15rem;
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

.entity {
    /* padding: 2.3rem 2.2rem; */
    position: relative;
    background-color: #eee;
}


form {
    padding: 0 2.3rem 2.2rem;
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

th.menu,
td.menu {
    padding: 0 1.2rem 0 0;
    text-align: left;
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
    scrollbar-width: thin;
    height: 50rem;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>