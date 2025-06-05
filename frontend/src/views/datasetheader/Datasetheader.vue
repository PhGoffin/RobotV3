<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ projectName }}<br>{{ subprojectName }}<br>-- Dataset --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">


                <button @click="handleInsert('0')" v-if="!backToDataHeaderID">
                    <i class="fa-solid fa-circle-plus"></i>
                    Dataset</button>
                <button @click="handleImport()" class="action" title="Import a scenario from your workspace"
                    v-if="!backToDataHeaderID">
                    <i class="fa-solid fa-download"></i>
                    Import</button>


                <form @submit.prevent="">

                    <table>
                        <tbody>
                            <tr>
                                <td class="menu" v-if="!backToDataHeaderID">
                                    <div class="input-container focus" style="max-width: 10rem">
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
                                            <input type="text" name="dataFilter" class="input"
                                                @focus="handleFocus($event)"
                                                title="You can filter by code or by comment" @blur="handleBlur($event)"
                                                v-model="filterValue" />
                                            <label>Filter {{ filteredRows }}</label>
                                            <span>Filter {{ filteredRows }}</span>
                                        </div>
                                        <i class="fa-regular fa-trash-can" @click="filterValue = ''"
                                            title="Reset the filter"></i>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 class="subtitle" v-if="backToDataHeaderID">Select a dataset for the import of the data</h3>

                </form>

                <div class="entities" height="150px">
                    <div v-if="error"> {{ error }}</div>
                    <div v-if="filteredData.length" class="layout">
                        <DatasetheadersList class="datasetheadersList" :datasetheaders="filteredData"
                            :workspaceID="workspaceID" :workspace="workspace" :superUser="superUser"
                            :projectID="projectID" :subprojectID="subprojectID" :userID="userID" :trace="trace"
                            :location="location" @refreshdatasetheaders="refreshDatasetheaders"
                            @selectrecord="selectRecord" @handleinsert="handleInsert" @handlecopy="handleCopy"
                            @handlemove="handleMove" @handledelete="handleDelete" @storelocation="storeLocation" />
                    </div>
                </div>
                <div class="input-group">
                    <button @click="handleCancel" class="cancel">
                        <i class="fa-solid fa-ban"></i>
                        Cancel</button>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import DatasetheadersList from '../../components/datasetheader/DatasetheadersList.vue'
import getDatasetheadersBySubproject from '../../composables/datasetheader/getDatasetheadersBySubproject'
import updatePositionDatasetheaders from '../../composables/datasetheader/updatePositionDatasetheaders'
import reorderDatasetheaders from '../../composables/datasetheader/reorderDatasetheaders'
import addDatasetheader from '../../composables/datasetheader/addDatasetheader'
import copyDatasetheader from '../../composables/datasetheader/copyDatasetheader'
import copyAllDataset from '../../composables/dataset/copyAllDataset'
import deleteDatasetheader from '../../composables/datasetheader/deleteDatasetheader'
import deleteAllDataset from '../../composables/dataset/deleteAllDataset'

import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Datasetheader',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'subprojectID', 'subprojectName', 'location'],
    components: { DatasetheadersList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const recordTarget = ref(0)
        const rowToInsert = ref(1)


        displayMsg('Datasetheaders.vue', trace.value)
        consoleLog('Datasetheaders.vue - props', 1, props, trace.value)

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
        const projectName = ref(props.projectName)
        const subprojectID = ref(props.subprojectID)
        const subprojectName = ref(props.subprojectName)
        const userID = ref(props.userID)
        const superUser = ref(props.superUser)
        const datasetheaders = ref([])
        const backToDataHeaderID = ref(0)
        const displayInfo = ref('')
        const location = ref(props.location)
        const filterValue = ref('')
        const testID = ref(0)
        const ruleID = ref(0)

        // -----------------------------------------------------------------------
        // Check if we come from the test vue
        // Syntax is: test=<testID>=<datasetheaderID>=<parameter number - 1, 2 or 3>=<filter data>
        // -----------------------------------------------------------------------
        if (location.value.includes('test=')) {
            // split the location to find the keyword
            let data = location.value.split("=");
            //     if (data[3] != undefined) {
            //         filterValue.value = data[3]
            //     }
            testID.value = data[1]
        } else if (location.value.includes('rule=')) {
            // split the location to find the keyword
            let data = location.value.split("=");
            ruleID.value = data[1]
        } else if (location.value.includes('dataimport=')) {
            // split the location to find the keyword
            let data = location.value.split("=");
            backToDataHeaderID.value = data[1]
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
            consoleLog('Datasetheaders.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        const loadDatasetheaderData = async () => {
            // -------------------------------------------
            // load all the datasetheaders of the subproject 
            // -------------------------------------------
            consoleLog('Datasetheaders.vue/loadDatasetheaderData', 2, 'Loading datasetheader by subproject', trace.value)
            const { error, loadDatasetheader } = getDatasetheadersBySubproject(subprojectID.value)
            await loadDatasetheader(datasetheaders, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Datasetheaders.vue/loadDatasetheaderData', 2, 'Datasetheader Load by subproject status: ' + datasetheaders.value.success, trace.value)
                    if (datasetheaders.value.success && datasetheaders.value.data.length) {
                        datasetheaders.value = datasetheaders.value.data
                        filteredData.value = datasetheaders.value
                        consoleLog('Datasetheaders.vue/loadDatasetheaderData', 2, datasetheaders.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('Datasetheaders.vue/loadDatasetheaderData', 2, 'No datasetheader found!', trace.value)
                        return (0)
                    }
                })
        }


        // Load projects data
        loadDatasetheaderData()


        // ---------------------------------------------
        // Compute the datasetheaders depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('Datasetheaders.vue/filteredData', 2, 'computed value', trace.value)
            //console.log ('*************** Datasetheaders: ', datasetheaders.value)
            if (datasetheaders.value.length) {
                return datasetheaders.value.filter((ar) => ar.code.toUpperCase().includes(filterValue.value.toUpperCase()) | ar.comment.toUpperCase().includes(filterValue.value.toUpperCase()))
            } else {
                filteredRows.value = ''
                return datasetheaders.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })


        // --------------------------------------------------------------------------
        // DatasetheadersList emits a request to refresh the datasetheaders
        // --------------------------------------------------------------------------
        const refreshDatasetheaders = (status, msg) => {
            consoleLog('Datasetheaders.vue/refreshDatasetheaders', 2, 'received a request to refresh the datasetheaders  from DatasetheaderList / DatasetheaderSingle', trace.value)
            consoleLog('Datasetheaders.vue/refreshDatasetheaders', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadDatasetheaderData()
        }

        // --------------------------------------------------------------------------
        // DatasetheadersList emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = (location) => {
            consoleLog('Datasetheaders.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
            context.emit('storelocation', location)
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
        // User asks to go to the Import screen
        // --------------------------------------------------------------------------
        const handleImport = () => {
            consoleLog('Datasetheaders.vue/handleImport', 2, 'User asks to go to the Import screen', trace.value)
            router.push({ name: 'DatasetheaderImport' })
        }

        // --------------------------------------------------------------------------
        // User cancel the action, Back to the control panel or the dashbaord
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('Datasetheaders.vue/handleCancel', 2, 'User Cancel the action from ' + location.value, trace.value)

            if (location.value.includes('test=')) {
                //router.go (-1)
                router.push({ name: 'TestEdit', params: { id: testID.value } })
            } else if (location.value == 'dashboard') {
                router.push({ name: 'Dashboard' })
            } else if (location.value.includes('rule=')) {
                router.push({ name: 'RuleEdit', params: { id: ruleID.value } })
            } else {
                router.push({ name: 'ControlPanel' })
            }
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
        // Call the API to reorder correctly all the positions of the datasetheaders 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let datasetheader = []
            consoleLog('Datasetheaders.vue/doReorder', 2, 'Reorder all the positions of the Datasetheaders', trace.value)
            const { error, reorderTheDatasetheaders } = reorderDatasetheaders(subprojectID.value)
            return await reorderTheDatasetheaders(datasetheader, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Datasetheaders.vue/doReorder', 2, 'Datasetheader reorder status: ' + datasetheader.value.success, trace.value)
                    if (datasetheader.value.success) {
                        consoleLog('Datasetheaders.vue/doReorder', 2, datasetheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Datasetheaders.vue/doReorder', 2, 'Error during the reorder of the datasetheaders position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert a datasetheader 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let datasetheader = []
            const now = new Date();
            const currentDateTime = now.toLocaleString();
            let code = 'New'

            consoleLog('Datasetheaders.vue/doInsert', 2, 'Insert a new Datasetheader', trace.value)
            const { error, addNewDatasetheader } = addDatasetheader(subprojectID.value, code, '', position, 1)
            return await addNewDatasetheader(datasetheader, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Datasetheaders.vue/doInsert', 2, 'Datasetheader insert status: ' + datasetheader.value.success, trace.value)
                    if (datasetheader.value.success) {
                        consoleLog('Datasetheaders.vue/doInsert', 2, datasetheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Datasetheaders.vue/doInsert', 2, 'Error during the insert of a datasetheader', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to copy a datasetheader 
        // --------------------------------------------------------------------------
        const doCopy = async (datasetheaderID, position) => {
            let datasetheader = []
            consoleLog('Datasetheaders.vue/doCopy', 2, 'Copy an existing Datasetheader - datasetheaderID: ' + datasetheaderID + ' at position: ' + position, trace.value)
            const { error1, copyTheDatasetheader } = copyDatasetheader(datasetheaderID, position)
            await copyTheDatasetheader(datasetheader, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Datasetheaders.vue/doCopy', 2, 'Datasetheader copy status: ' + datasetheader.value.success, trace.value)
                    if (datasetheader.value.success) {
                        consoleLog('Datasetheaders.vue/doCopy', 2, datasetheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Datasetheaders.vue/doCopy', 2, 'Error during the copy of a datasetheader', trace.value)
                        return (0)
                    }
                })

            // Get the ID of the new copied datasetheader
            let Id = datasetheader.value.id
            let dataset = []

            // Copy all the linked dataset
            consoleLog('Datasetheaders.vue/doCopy', 2, 'Copy all linked Dataset - datasetheaderID: ' + datasetheaderID, trace.value)
            const { error2, copyTheDataset } = copyAllDataset(subprojectID.value, Id, datasetheaderID)
            return await copyTheDataset(dataset, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Datasetheaders.vue/doCopy', 2, 'Full Dataset copy status: ' + dataset.value.success, trace.value)
                    if (dataset.value.success) {
                        consoleLog('Datasetheaders.vue/doCopy', 2, dataset, trace.value)
                        return (1)
                    } else {
                        consoleLog('Datasetheaders.vue/doCopy', 2, 'Error during the copy of the full dataset', trace.value)
                        return (0)
                    }
                })

        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a datasetheader 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (datasetheaderID, position) => {

            let datasetheader = []
            consoleLog('Datasetheaders.vue/doUpdatePosition', 2, 'Change the position of a Datasetheader - datasetheaderID: ' + datasetheaderID + ', position: ' + position, trace.value)
            const { error, updateThePosition } = updatePositionDatasetheaders(datasetheaderID, position)
            return await updateThePosition(datasetheader, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('Datasetheaders.vue/doUpdatePosition', 2, 'Datasetheader status: ' + datasetheader.value.success, trace.value)
                    if (datasetheader.value.success) {
                        consoleLog('Datasetheaders.vue/doUpdatePosition', 2, datasetheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Datasetheaders.vue/doUpdatePosition', 2, 'Error during the update of the datasetheader position', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete a datasetheader 
        // --------------------------------------------------------------------------
        const doDelete = async (datasetheaderID) => {
            let datasetheader = []
            consoleLog('Datasetheaders.vue/doDelete', 2, 'Delete an existing Datasetheader - subprojectID: ' + subprojectID.value + ', datasetheaderID: ' + datasetheaderID, trace.value)
            const { error1, deleteTheDatasetheader } = deleteDatasetheader(subprojectID.value, datasetheaderID)
            await deleteTheDatasetheader(datasetheader, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Datasetheaders.vue/doDelete', 2, 'Datasetheader delete status: ' + datasetheader.value.success, trace.value)
                    if (datasetheader.value.success) {
                        consoleLog('Datasetheaders.vue/doDelete', 2, datasetheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Datasetheaders.vue/doDelete', 2, 'Error during the delete of a datasetheader', trace.value)
                        return (0)
                    }
                })

            let dataset = []
            consoleLog('Datasetheaders.vue/doDelete', 2, 'Delete all linked Dataset - datasetheaderID: ' + datasetheaderID, trace.value)
            const { error2, deleteTheDataset } = deleteAllDataset(datasetheaderID)
            return await deleteTheDataset(dataset, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Datasetheaders.vue/doDelete', 2, 'Full Dataset delete status: ' + dataset.value.success, trace.value)
                    if (dataset.value.success) {
                        consoleLog('Datasetheaders.vue/doDelete', 2, dataset, trace.value)
                        return (1)
                    } else {
                        consoleLog('Datasetheaders.vue/doDelete', 2, 'No dataset to delete', trace.value)
                        return (1)
                    }
                })

        }



        // --------------------------------------------------------------------------
        // Datasetheaders received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (datasetheaderID) => {
            consoleLog('Datasetheaders.vue/selectRecord', 2, 'Received a request to select a record: ' + datasetheaderID, trace.value)
            if (!recordSelected.value.includes(datasetheaderID)) {
                recordSelected.value.push(datasetheaderID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != datasetheaderID)
            }
            consoleLog('Datasetheaders.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('Datasetheaders.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // Datasetheaders received a request to add a new Datasetheader
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('Datasetheaders.vue/handleInsert', 2, 'Add ' + rowToInsert.value + ' new empty datasetheader(s) after the Datasetheader position: ' + position, trace.value)
            let originalPosition = position
            position = position.toString().padStart(6, '0') + 'I'
            let status = 1;
            let err = 1;
            for (let i = 1; i <= rowToInsert.value; i++) {
                //console.log (' ******** 1 ******* Loop: ' + i)
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a datasetheader', 'Alert')
            } else {
                DisplayError('Inserted ' + rowToInsert.value + ' datasetheader(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            //console.log (' ******** 2 ******* reorder')
            await doReorder()
            // Refresh the list
            //console.log (' ******** 3 ******* refresh')
            context.emit('storelocation', 'controlpanel=' + originalPosition)
            location.value = 'controlpanel=' + originalPosition
            await loadDatasetheaderData()

        }


        // --------------------------------------------------------------------------
        // Datasetheaders received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('Datasetheaders.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' datasetheader(s) after the Datasetheader position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to copy before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                let originalPosition = position
                position = position.toString().padStart(6, '0') + 'C'
                //console.log (' ******** 1 ******* Loop')
                // Copy all the selected datasetheader(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doCopy(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the copy of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected datasetheader(s) copy successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                context.emit('storelocation', 'controlpanel=' + originalPosition)
                location.value = 'controlpanel=' + originalPosition
                await loadDatasetheaderData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Datasetheaders received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('Datasetheaders.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' datasetheader(s) after the Datasetheader position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                let originalPosition = position
                position = position.toString().padStart(6, '0') + 'M'
                //console.log (' ******** 1 ******* Loop')
                // Update the position of all the selected datasetheader(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected datasetheader(s) reorder successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                context.emit('storelocation', 'controlpanel=' + originalPosition)
                location.value = 'controlpanel=' + originalPosition
                await loadDatasetheaderData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Datasetheaders received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (datasetheaderID, position) => {
            consoleLog('Datasetheaders.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' datasetheader(s) and the Datasetheader: ' + datasetheaderID, trace.value)
            let status = 1;
            let originalPosition = position - 1
            //console.log (' ******** 1 ******* Loop')

            // Add the datasetheaderID if it's not already in the list
            if (!recordSelected.value.includes(datasetheaderID)) {
                recordSelected.value.push(datasetheaderID)
            }

            // Delete the selected datasetheader(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected datasetheader(s)', 'Alert')
            } else {
                DisplayError('Selected datasetheader(s) deleted successfully', 'Info')
            }
            //console.log (' ******** 2 ******* refresh')
            // Refresh the list
            context.emit('storelocation', 'controlpanel=' + originalPosition)
            location.value = 'controlpanel=' + originalPosition
            await loadDatasetheaderData()
            recordSelected.value = []
        }



        return {
            errorMessage, styleMessage, datasetheaders, filteredData, filterValue, filteredRows, workspaceID, workspace,
            superUser, projectID, projectName, subprojectID, subprojectName, userID, displayInfo, trace, rowToInsert, backToDataHeaderID,
            handleCancel, refreshDatasetheaders, handleInsert, handleCopy, handleMove, handleDelete, selectRecord,
            handleFocus, handleBlur, handleCancel, handleRowToInsert, storeLocation, handleImport
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
    top: 12rem;
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
    /* scrollbar-color: red orange; */
    scrollbar-width: thin;
    height: 50rem;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>