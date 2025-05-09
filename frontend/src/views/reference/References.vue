<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ projectName }}<br>User: {{ userName }}<br>-- References --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <button @click="handleInsert('0')" v-if="display">
                    <i class="fa-solid fa-circle-plus"></i>
                    Reference</button>

                <button @click="handleExport()" class="action">
                    <i class="fa-solid fa-upload"></i>
                    Export</button>

                <button @click="handleImport()" class="action">
                    <i class="fa-solid fa-download"></i>
                    Import</button>


                <form @submit.prevent="">

                    <table>
                        <tr>
                            <td class="menu">
                                <div class="input-container focus" style="max-width: 10rem" v-if="display">
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
                                            title="You can filter by the code, label or by comment"
                                            @blur="handleBlur($event)" v-model="filterValue" />
                                        <label>Filter {{ filteredRows }}</label>
                                        <span>Filter {{ filteredRows }}</span>
                                    </div>
                                    <i class="fa-regular fa-trash-can" @click="filterValue = ''"
                                        title="Reset the filter"></i>
                                </div>
                            </td>
                        </tr>

                    </table>

                </form>



                <div class="entities" height="150px">
                    <div v-if="error"> {{ error }}</div>
                    <div v-if="filteredData.length" class="layout">
                        <ReferencesList class="referencesList" :references="filteredData" :workspaceID="workspaceID"
                            :workspace="workspace" :superUser="superUser" :projectID="projectID" :userID="userID"
                            :location="location" :currentuser="currentuser" :trace="trace"
                            @refreshreferences="refreshReferences" @selectrecord="selectRecord"
                            @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove"
                            @handledelete="handleDelete" @storelocation="storeLocation" />
                    </div>
                </div>
                <div class="input-group">
                    <button @click="handleCancel" class="cancel">
                        <i class="fa-solid fa-circle-check"></i>
                        Cancel</button>
                </div>

            </div>
        </div>


    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import ReferencesList from '../../components/reference/ReferencesList.vue'
import getReferencesByProject from '../../composables/reference/getReferencesByProject'
import getDashboardReference from '../../composables/reference/getDashboardReference'
import updatePositionReference from '../../composables/reference/updatePositionReference'
import reorderReferences from '../../composables/reference/reorderReferences'
import addReference from '../../composables/reference/addReference'
import copyReference from '../../composables/reference/copyReference'
import deleteReference from '../../composables/reference/deleteReference'

import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Project',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'location'],
    components: { ReferencesList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const recordTarget = ref(0)
        const rowToInsert = ref(1)


        displayMsg('References.vue', trace.value)
        consoleLog('References.vue - props', 1, props, trace.value)

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
        const userID = ref(props.userID)
        const userName = ref(props.currentuser)
        const superUser = ref(props.superUser)
        const storyheaderID = ref(0)
        const references = ref([])
        const displayInfo = ref('')
        const location = ref(props.location)
        const filterValue = ref('')
        const display = ref(true)

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
            consoleLog('References.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        const loadReferenceData = async () => {

            if (location.value.includes('dashboard=')) {
                display.value = false
                // -------------------------------------------
                // load all the references of the dashboard 
                // -------------------------------------------
                let data = location.value.split("=");
                if (data[1] != undefined) storyheaderID.value = data[1]

                consoleLog('References.vue/getDashboardReference', 2, 'Loading reference from the dashboard', trace.value)
                const { error, loadReference } = getDashboardReference(projectID.value, userID.value, storyheaderID.value)
                loadReference(references, trace.value)
                    .then(function () {
                        consoleLog('References.vue/getDashboardReference', 2, 'projectID: ' + projectID.value + ', userID: ' + userID.value + ', storyheaderID: ' + storyheaderID, trace.value)
                        consoleLog('References.vue/getDashboardReference', 2, references, trace.value)
                        if (references.value.success && references.value.data.length) {
                            references.value = references.value.data
                            filteredData.value = references.value
                            consoleLog('References.vue/getDashboardReference', 2, references, trace.value)
                            return (1)
                        } else {
                            consoleLog('References.vue/getDashboardReference', 2, 'No reference found!', trace.value)
                            return (0)
                        }
                    })

            } else {
                // -------------------------------------------
                // load all the references of the project/user 
                // -------------------------------------------
                consoleLog('References.vue/loadReferenceData', 2, 'Loading reference by project/user', trace.value)
                const { error, loadReference } = getReferencesByProject(projectID.value, userID.value)
                loadReference(references, trace.value)
                    .then(function () {
                        // check the status of the load
                        consoleLog('References.vue/loadReferenceData', 2, 'Reference Load by project/user status: ' + references.value.success, trace.value)
                        if (references.value.success && references.value.data.length) {
                            references.value = references.value.data
                            filteredData.value = references.value
                            consoleLog('References.vue/loadReferenceData', 2, references.value, trace.value)
                            return (1)
                        } else {
                            consoleLog('References.vue/loadReferenceData', 2, 'No reference found!', trace.value)
                            return (0)
                        }
                    })
            }
        }


        // Load projects data
        loadReferenceData()


        // ---------------------------------------------
        // Compute the references depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('References.vue/filteredData', 2, 'computed value', trace.value)
            if (references.value.length) {
                return references.value.filter((ar) => ar.code.toUpperCase().includes(filterValue.value.toUpperCase())
                    || ar.label.toUpperCase().includes(filterValue.value.toUpperCase()) || ar.comment.toUpperCase().includes(filterValue.value.toUpperCase()))
            } else {
                filteredRows.value = ''
                return references.value
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
        const refreshReferences = (status, msg) => {
            consoleLog('References.vue/refreshReferences', 2, 'received a request to refresh the references  from ReferenceList / ReferenceSingle', trace.value)
            consoleLog('References.vue/refreshReferences', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadReferenceData()
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
        // User asks to go to the Export screen
        // --------------------------------------------------------------------------
        const handleExport = () => {
            consoleLog('References.vue/handleExport', 2, 'User asks to go to the Export screen', trace.value)
            router.push({ name: 'ReferenceExport' })
        }

        // --------------------------------------------------------------------------
        // User asks to go to the Import screen
        // --------------------------------------------------------------------------
        const handleImport = () => {
            consoleLog('References.vue/handleImport', 2, 'User asks to go to the Import screen', trace.value)
            router.push({ name: 'ReferenceImport' })
        }


        // --------------------------------------------------------------------------
        // User cancel the action, Back to the control panel or the dashbaord
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('References.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            if (location.value.includes('dashboard=')) {
                router.push({ name: 'Dashboard' })
            } else if (location.value.includes('parameter=')) {
                let data = location.value.split("=");
                let storyheaderID = data[1]
                let parameterID = data[2]
                context.emit('storelocation', 'story=' + storyheaderID)
                router.push({ name: 'ParameterEdit', params: { id: parameterID } })
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
        // Call the API to reorder correctly all the positions of the references 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let reference = []
            consoleLog('References.vue/doReorder', 2, 'Reorder all the positions of the References', trace.value)
            const { error, reorderTheReferences } = reorderReferences(projectID.value, userID.value)
            return await reorderTheReferences(reference, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('References.vue/doReorder', 2, 'Reference reorder status: ' + reference.value.success, trace.value)
                    if (reference.value.success) {
                        consoleLog('References.vue/doReorder', 2, reference, trace.value)
                        return (1)
                    } else {
                        consoleLog('References.vue/doReorder', 2, 'Error during the reorder of the references position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert a reference 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let reference = []
            const now = new Date();
            const currentDateTime = now.toLocaleString();
            let code = 'New'
            let label = 'New' // + currentDateTime

            consoleLog('References.vue/doInsert', 2, 'Insert a new Reference', trace.value)
            const { error, addNewReference } = addReference(projectID.value, userID.value, code, label, '', position, 1)
            return await addNewReference(reference, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('References.vue/doInsert', 2, 'Reference insert status: ' + reference.value.success, trace.value)
                    if (reference.value.success) {
                        consoleLog('References.vue/doInsert', 2, reference, trace.value)
                        return (1)
                    } else {
                        consoleLog('References.vue/doInsert', 2, 'Error during the insert of a reference', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to copy a reference 
        // --------------------------------------------------------------------------
        const doCopy = async (referenceID, position) => {
            let reference = []
            consoleLog('References.vue/doCopy', 2, 'Copy an existing Reference - referenceID: ' + referenceID + ' at position: ' + position, trace.value)
            const { error, copyTheReference } = copyReference(referenceID, position)
            return await copyTheReference(reference, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('References.vue/doCopy', 2, 'Reference copy status: ' + reference.value.success, trace.value)
                    if (reference.value.success) {
                        consoleLog('References.vue/doCopy', 2, reference, trace.value)
                        return (1)
                    } else {
                        consoleLog('References.vue/doCopy', 2, 'Error during the copy of a reference', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a reference 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (referenceID, position) => {

            let reference = []
            consoleLog('References.vue/doUpdatePosition', 2, 'Change the position of a Reference - referenceID: ' + referenceID + ', position: ' + position, trace.value)
            const { error, updateThePosition } = updatePositionReference(referenceID, position)
            return await updateThePosition(reference, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('References.vue/doUpdatePosition', 2, 'Reference status: ' + reference.value.success, trace.value)
                    if (reference.value.success) {
                        consoleLog('References.vue/doUpdatePosition', 2, reference, trace.value)
                        return (1)
                    } else {
                        consoleLog('References.vue/doUpdatePosition', 2, 'Error during the update of the reference position', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete a reference 
        // --------------------------------------------------------------------------
        const doDelete = async (referenceID) => {
            let reference = []
            consoleLog('References.vue/doDelete', 2, 'Delete an existing Reference - projectID: ' + projectID.value + ', userID: ' + userID.value + ', referenceID: ' + referenceID, trace.value)
            const { error, deleteTheReference } = deleteReference(projectID.value, userID.value, referenceID)
            return await deleteTheReference(reference, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('References.vue/doDelete', 2, 'Reference delete status: ' + reference.value.success, trace.value)
                    if (reference.value.success) {
                        consoleLog('References.vue/doDelete', 2, reference, trace.value)
                        return (1)
                    } else {
                        consoleLog('References.vue/doDelete', 2, 'Error during the delete of a reference', trace.value)
                        return (0)
                    }
                })
        }



        // --------------------------------------------------------------------------
        // References received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (referenceID) => {
            consoleLog('References.vue/selectRecord', 2, 'Received a request to select a record: ' + referenceID, trace.value)
            if (!recordSelected.value.includes(referenceID)) {
                recordSelected.value.push(referenceID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != referenceID)
            }
            consoleLog('References.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('References.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // References received a request to add a new Reference
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('References.vue/handleInsert', 2, 'Add ' + rowToInsert.value + ' new empty reference(s) after the Reference position: ' + position, trace.value)
            position = position.padStart(6, '0') + 'I'
            let status = 1;
            let err = 1;
            for (let i = 1; i <= rowToInsert.value; i++) {
                //console.log (' ******** 1 ******* Loop: ' + i)
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a reference', 'Alert')
            } else {
                DisplayError('Inserted ' + rowToInsert.value + ' reference(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            //console.log (' ******** 2 ******* reorder')
            await doReorder()
            // Refresh the list
            //console.log (' ******** 3 ******* refresh')
            await loadReferenceData()

        }


        // --------------------------------------------------------------------------
        // References received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('References.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' reference(s) after the Reference position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to copy before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.padStart(6, '0') + 'C'
                //console.log (' ******** 1 ******* Loop')
                // Copy all the selected reference(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doCopy(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the copy of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected reference(s) copy successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadReferenceData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // References received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('References.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' reference(s) after the Reference position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.padStart(6, '0') + 'M'
                consoleLog('References.vue/handleMove', 2, '************** Position: ' + position, trace.value)
                //position = position.padStart(6, '0') + 'M'
                //console.log (' ******** 1 ******* Loop')
                // Update the position of all the selected reference(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected reference(s) reorder successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadReferenceData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // References received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (referenceID) => {
            consoleLog('References.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' reference(s) and the Reference: ' + referenceID, trace.value)
            let status = 1;
            //console.log (' ******** 1 ******* Loop')

            // Add the referenceID if it's not already in the list
            if (!recordSelected.value.includes(referenceID)) {
                recordSelected.value.push(referenceID)
            }

            // Delete the selected reference(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected reference(s)', 'Alert')
            } else {
                DisplayError('Selected reference(s) deleted successfully', 'Info')
            }
            //console.log (' ******** 2 ******* refresh')
            // Refresh the list
            await loadReferenceData()
            recordSelected.value = []
        }

        // --------------------------------------------------------------------------
        // References emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = (location) => {
            consoleLog('References.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
            context.emit('storelocation', location)
        }



        return {
            errorMessage, styleMessage, references, filteredData, filterValue, filteredRows, workspaceID, workspace,
            superUser, projectID, projectName, userID, userName, displayInfo, trace, rowToInsert, location, display,
            handleCancel, refreshReferences, handleInsert, handleCopy, handleMove, handleDelete, selectRecord,
            handleFocus, handleBlur, handleCancel, handleRowToInsert, handleImport, handleExport, storeLocation
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

button.action {
    background-color: #7cbcbc;
}

button.action:hover {
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
    /* scrollbar-color: rgba(29, 71, 37, 0.829) rgb(125, 145, 128); */
    scrollbar-width: thin;
    height: 50rem;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>