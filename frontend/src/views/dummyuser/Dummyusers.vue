<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ projectName }}<br>-- Dummy User --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <button @click="handleInsert('0I0')">
                    <i class="fa-solid fa-circle-plus"></i>
                    Dummy User</button>


                <form @submit.prevent="">

                    <table>
                        <tbody>
                            <tr>
                                <td class="menu">
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
                        </tbody>
                    </table>

                </form>


                <div class="entities" height="150px">
                    <div v-if="error"> {{ error }}</div>
                    <div v-if="filteredData.length" class="layout">
                        <DummyusersList class="dummyusersList" :dummyusers="filteredData" :workspaceID="workspaceID"
                            :workspace="workspace" :superUser="superUser" :projectID="projectID"
                            :subprojectID="subprojectID" :userID="userID" :trace="trace" :location="location"
                            @refreshdummyusers="refreshDummyusers" @selectrecord="selectRecord"
                            @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove"
                            @handledelete="handleDelete" @storelocation="storeLocation" />
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
import DummyusersList from '../../components/dummyuser/DummyusersList.vue'
import getDummyusersByProject from '../../composables/dummyuser/getDummyusersByProject'
import updatePositionDummyuser from '../../composables/dummyuser/updatePositionDummyuser'
import reorderDummyusers from '../../composables/dummyuser/reorderDummyusers'
import addDummyuser from '../../composables/dummyuser/addDummyuser'
import copyDummyuser from '../../composables/dummyuser/copyDummyuser'
import deleteDummyuser from '../../composables/dummyuser/deleteDummyuser'

import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Dummyuser',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'subprojectID', 'subprojectName', 'location'],
    components: { DummyusersList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const recordTarget = ref(0)
        const rowToInsert = ref(1)


        displayMsg('Dummyuser.vue', trace.value)
        consoleLog('Dummyuser.vue - props', 1, props, trace.value)

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
        const dummyusers = ref([])
        const displayInfo = ref('')
        const location = ref(props.location)
        const filterValue = ref('')

        const userName = ref(props.currentuser)
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
        const year = currentDate.getFullYear();
        let today = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year



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
            consoleLog('Dummyuser.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        const loadDummyuserData = async () => {
            // -------------------------------------------
            // load all the dummyusers of the project 
            // -------------------------------------------
            consoleLog('Dummyuser.vue/loadDummyuserData', 2, 'Loading dummyuser by project', trace.value)
            const { error, loadDummyuser } = getDummyusersByProject(projectID.value)
            loadDummyuser(dummyusers, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Dummyuser.vue/loadDummyuserData', 2, 'Dummyuser Load by subproject status: ' + dummyusers.value.success, trace.value)
                    if (dummyusers.value.success && dummyusers.value.data.length) {
                        dummyusers.value = dummyusers.value.data
                        filteredData.value = dummyusers.value
                        consoleLog('Dummyuser.vue/loadDummyuserData', 2, dummyusers.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dummyuser.vue/loadDummyuserData', 2, 'No dummyuser found!', trace.value)
                        return (0)
                    }
                })
        }


        // Load projects data
        loadDummyuserData()


        // ---------------------------------------------
        // Compute the dummyusers depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('Dummyuser.vue/filteredData', 2, 'computed value', trace.value)
            if (dummyusers.value.length) {
                return dummyusers.value.filter((ar) => ar.user.toUpperCase().includes(filterValue.value.toUpperCase()))
            } else {
                filteredRows.value = ''
                return dummyusers.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })


        // --------------------------------------------------------------------------
        // DummyusersList emits a request to refresh the dummyusers
        // --------------------------------------------------------------------------
        const refreshDummyusers = (status, msg) => {
            consoleLog('Dummyuser.vue/refreshDummyusers', 2, 'received a request to refresh the dummyusers  from DummyusersList / DummyuserSingle', trace.value)
            consoleLog('Dummyuser.vue/refreshDummyusers', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadDummyuserData()
        }

        // --------------------------------------------------------------------------
        // DummyusersList emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = (location) => {
            consoleLog('Dummyuser.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
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
        // User cancel the action, Back to the control panel
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('Dummyuser.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'ControlPanel' })
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
        // Call the API to reorder correctly all the positions of the dummyusers 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let dummyuser = []
            consoleLog('Dummyuser.vue/doReorder', 2, 'Reorder all the positions of the Dummyusers', trace.value)
            const { error, reorderTheDummyuser } = reorderDummyusers(projectID.value)
            return await reorderTheDummyuser(dummyuser, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Dummyuser.vue/doReorder', 2, 'Dummyuser reorder status: ' + dummyuser.value.success, trace.value)
                    if (dummyuser.value.success) {
                        consoleLog('Dummyuser.vue/doReorder', 2, dummyuser, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dummyuser.vue/doReorder', 2, 'Error during the reorder of the dummyusers position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert a dummyuser 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let dummyuser = []
            let user = 'New'
            let dummy = 'New Dummy'

            consoleLog('Dummyuser.vue/doInsert', 2, 'Insert a new Dummyuser', trace.value)
            // projectID, dummy, user, password, crypted, extraInfo, position, active
            const { error, addNewDummyuser } = addDummyuser(projectID.value, dummy, user, '**', 0, '', position, 1, userName.value, today)
            return await addNewDummyuser(dummyuser, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Dummyuser.vue/doInsert', 2, 'Dummy user insert status: ' + dummyuser.value.success, trace.value)
                    if (dummyuser.value.success) {
                        consoleLog('Dummyuser.vue/doInsert', 2, dummyuser, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dummyuser.vue/doInsert', 2, 'Error during the insert of a dummy user', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to copy a dummyuser 
        // --------------------------------------------------------------------------
        const doCopy = async (dummyuserID, position) => {
            let dummyuser = []
            consoleLog('Dummyuser.vue/doCopy', 2, 'Copy an existing Dummyuser - dummyuserID: ' + dummyuserID + ' at position: ' + position, trace.value)
            const { error, copyTheDummyuser } = copyDummyuser(dummyuserID, position, userName.value, today)
            return await copyTheDummyuser(dummyuser, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Dummyuser.vue/doCopy', 2, 'Dummyuser copy status: ' + dummyuser.value.success, trace.value)
                    if (dummyuser.value.success) {
                        consoleLog('Dummyuser.vue/doCopy', 2, dummyuser, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dummyuser.vue/doCopy', 2, 'Error during the copy of a dummyuser', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a dummyuser 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (dummyuserID, position) => {

            let dummyuser = []
            consoleLog('Dummyuser.vue/doUpdatePosition', 2, 'Change the position of a Dummyuser - dummyuserID: ' + dummyuserID + ', position: ' + position, trace.value)
            const { error, updateThePosition } = updatePositionDummyuser(dummyuserID, position)
            return await updateThePosition(dummyuser, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('Dummyuser.vue/doUpdatePosition', 2, 'Dummyuser status: ' + dummyuser.value.success, trace.value)
                    if (dummyuser.value.success) {
                        consoleLog('Dummyuser.vue/doUpdatePosition', 2, dummyuser, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dummyuser.vue/doUpdatePosition', 2, 'Error during the update of the dummyuser position', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete a dummyuser 
        // --------------------------------------------------------------------------
        const doDelete = async (dummyuserID) => {
            let dummyuser = []
            consoleLog('Dummyuser.vue/doDelete', 2, 'Delete an existing Dummyuser - subprojectID: ' + subprojectID.value + ', dummyuserID: ' + dummyuserID, trace.value)
            const { error, deleteTheDummyuser } = deleteDummyuser(subprojectID.value, dummyuserID)
            return await deleteTheDummyuser(dummyuser, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Dummyuser.vue/doDelete', 2, 'Dummyuser delete status: ' + dummyuser.value.success, trace.value)
                    if (dummyuser.value.success) {
                        consoleLog('Dummyuser.vue/doDelete', 2, dummyuser, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dummyuser.vue/doDelete', 2, 'Error during the delete of a dummyuser', trace.value)
                        return (0)
                    }
                })
        }



        // --------------------------------------------------------------------------
        // Dummyusers received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (dummyuserID) => {
            consoleLog('Dummyuser.vue/selectRecord', 2, 'Received a request to select a record: ' + dummyuserID, trace.value)
            if (!recordSelected.value.includes(dummyuserID)) {
                recordSelected.value.push(dummyuserID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != dummyuserID)
            }
            consoleLog('Dummyuser.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('Dummyuser.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // Dummyusers received a request to add a new Dummyuser
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('Dummyuser.vue/handleInsert', 2, 'Add ' + rowToInsert.value + ' new empty dummyuser(s) after the Dummyuser position: ' + position, trace.value)
            position = position.toString().padStart(6, '0') + 'I'
            let status = 1;
            let err = 1;
            for (let i = 1; i <= rowToInsert.value; i++) {
                //console.log (' ******** 1 ******* Loop: ' + i)
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a dummyuser', 'Alert')
            } else {
                DisplayError('Inserted ' + rowToInsert.value + ' dummyuser(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            //console.log (' ******** 2 ******* reorder')
            await doReorder()
            // Refresh the list
            //console.log (' ******** 3 ******* refresh')
            await loadDummyuserData()

        }


        // --------------------------------------------------------------------------
        // Dummyusers received a request to copy record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('Dummyuser.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' dummyuser(s) after the Dummyuser position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to copy before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.toString().padStart(6, '0') + 'C'
                //console.log (' ******** 1 ******* Loop')
                // Copy all the selected dummyuser(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doCopy(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the copy of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected dummy user(s) copy successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadDummyuserData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Dummyusers received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('Dummyuser.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' dummyuser(s) after the Dummyuser position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.toString().padStart(6, '0') + 'M'
                //console.log (' ******** 1 ******* Loop')
                // Update the position of all the selected dummyuser(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected dummy user(s) reorder successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadDummyuserData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Dummyusers received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (dummyuserID) => {
            consoleLog('Dummyuser.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' dummyuser(s) and the Dummyuser: ' + dummyuserID, trace.value)
            let status = 1;
            //console.log (' ******** 1 ******* Loop')

            // Add the dummyuserID if it's not already in the list
            if (!recordSelected.value.includes(dummyuserID)) {
                recordSelected.value.push(dummyuserID)
            }

            // Delete the selected dummyuser(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected dummyuser(s)', 'Alert')
            } else {
                DisplayError('Selected dummy user(s) deleted successfully', 'Info')
            }
            //console.log (' ******** 2 ******* refresh')
            // Refresh the list
            await loadDummyuserData()
            recordSelected.value = []
        }



        return {
            errorMessage, styleMessage, dummyusers, filteredData, filterValue, filteredRows, workspaceID, workspace,
            superUser, projectID, projectName, subprojectID, subprojectName, userID, displayInfo, trace, rowToInsert,
            handleCancel, refreshDummyusers, handleInsert, handleCopy, handleMove, handleDelete, selectRecord,
            handleFocus, handleBlur, handleCancel, handleRowToInsert, storeLocation
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
    background-color: white;
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

.input.disabled.info {
    background-color: #caf5e9;
    width: 130%
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

.actions {
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
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