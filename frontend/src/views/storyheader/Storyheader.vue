<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ subprojectName }}<br>-- Story Set --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <button @click="handleInsert('0')">
                    <i class="fa-solid fa-circle-plus"></i>
                    Story Set</button>
                <button @click="handleLogfile">
                    <i class="fa-regular fa-eye"></i>
                    Logfile</button>


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
                        <StoryheaderList class="storyheadersList" :storyheaders="filteredData"
                            :workspaceID="workspaceID" :workspace="workspace" :superUser="superUser"
                            :projectID="projectID" :currentuser="userName" :subprojectID="subprojectID" :userID="userID"
                            :trace="trace" :location="location" @refreshstoryheaders="refreshStoryheaders"
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


import StoryheaderList from '../../components/storyheader/StoryheaderList.vue'
import getStoryheadersBySubproject from '../../composables/storyheader/getStoryheadersBySubproject'
import updatePositionStoryheaders from '../../composables/storyheader/updatePositionStoryheaders'
import reorderStoryheaders from '../../composables/storyheader/reorderStoryheaders'
import addStoryheader from '../../composables/storyheader/addStoryheader'
import copyStoryheader from '../../composables/storyheader/copyStoryheader'
import copyAllStory from '../../composables/story/copyAllStory'
import deleteStoryheader from '../../composables/storyheader/deleteStoryheader'
import deleteAllStory from '../../composables/story/deleteAllStory'


import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Storyheader',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'subprojectID', 'subprojectName', 'location'],
    components: { StoryheaderList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const recordTarget = ref(0)
        const rowToInsert = ref(1)


        displayMsg('Storyheader.vue', trace.value)
        consoleLog('Storyheader.vue - props', 1, props, trace.value)

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
        const storyheaders = ref([])
        const displayInfo = ref('')
        const location = ref(props.location)
        const filterValue = ref('')
        const storyID = ref(0)

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
            consoleLog('Storyheader.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        const loadStoryheaderData = async () => {
            // -------------------------------------------
            // load all the storyheaders of the subproject 
            // -------------------------------------------
            consoleLog('Storyheader.vue/loadStoryheaderData', 2, 'Loading storyheader by subproject', trace.value)
            // second parameter is 0 to have active >= 0
            const { error, loadStoryheader } = getStoryheadersBySubproject(subprojectID.value, 0)
            loadStoryheader(storyheaders, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Storyheader.vue/loadStoryheaderData', 2, 'Storyheaders status: ' + storyheaders.value.success, trace.value)
                    if (storyheaders.value.success && storyheaders.value.data.length) {
                        storyheaders.value = storyheaders.value.data
                        filteredData.value = storyheaders.value
                        consoleLog('Storyheader.vue/loadStoryheaderData', 2, storyheaders.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('Storyheader.vue/loadStoryheaderData', 2, 'No storyheader found!', trace.value)
                        return (0)
                    }
                })
        }


        // Load projects data
        loadStoryheaderData()


        // ---------------------------------------------
        // Compute the storyheaders depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('Storyheader.vue/filteredData', 2, 'computed value', trace.value)
            if (storyheaders.value.length) {
                return storyheaders.value.filter((ar) => ar.label.toUpperCase().includes(filterValue.value.toUpperCase())
                    || ar.comment.toUpperCase().includes(filterValue.value.toUpperCase()))
            } else {
                filteredRows.value = ''
                return storyheaders.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })


        // --------------------------------------------------------------------------
        // StoryheaderSingle emits a request to refresh the storyheaders
        // --------------------------------------------------------------------------
        const refreshStoryheaders = (status, msg, reload) => {
            consoleLog('Storyheader.vue/refreshStoryheaders', 2, 'received a request to refresh the storyheaders  from StoryheadersList / StoryheaderSingle', trace.value)
            consoleLog('Storyheader.vue/refreshStoryheaders', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            if (reload) loadStoryheaderData()
        }


        // --------------------------------------------------------------------------
        // StoryheaderSingle emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = (location) => {
            consoleLog('Storyheader.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
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
            consoleLog('Storyheader.vue/handleCancel', 2, 'User Cancel the action', trace.value)
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
        // Call the API to reorder correctly all the positions of the storyheaders 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let storyheader = []
            consoleLog('Storyheader.vue/doReorder', 2, 'Reorder all the positions of the Storyheaders', trace.value)
            const { error, reorderTheStoryheaders } = reorderStoryheaders(subprojectID.value)
            return await reorderTheStoryheaders(storyheader, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Storyheader.vue/doReorder', 2, 'Storyheader reorder status: ' + storyheader.value.success, trace.value)
                    if (storyheader.value.success) {
                        consoleLog('Storyheader.vue/doReorder', 2, storyheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Storyheader.vue/doReorder', 2, 'Error during the reorder of the storyheaders position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert a storyheader 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let storyheader = []
            let label = 'New'

            // subprojectID, label, comment, position, active
            consoleLog('Storyheader.vue/doInsert', 2, 'Insert a new Storyheader', trace.value)
            const { error, addNewStoryheader } = addStoryheader(subprojectID.value, label, '', position, 1, userName.value, today)
            return await addNewStoryheader(storyheader, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Storyheader.vue/doInsert', 2, 'Storyheader insert status: ' + storyheader.value.success, trace.value)
                    if (storyheader.value.success) {
                        consoleLog('Storyheader.vue/doInsert', 2, storyheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Storyheader.vue/doInsert', 2, 'Error during the insert of a storyheader', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to copy a storyheader 
        // --------------------------------------------------------------------------
        const doCopy = async (storyheaderID, position) => {
            let storyheader = []
            consoleLog('Storyheader.vue/doCopy', 2, 'Copy an existing Storyheader - storyheaderID: ' + storyheaderID + ' at position: ' + position, trace.value)
            const { error1, copyTheStoryheader } = copyStoryheader(storyheaderID, position, userName.value, today)
            await copyTheStoryheader(storyheader, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Storyheader.vue/doCopy', 2, 'Storyheader copy status: ' + storyheader.value.success, trace.value)
                    if (storyheader.value.success) {
                        consoleLog('Storyheader.vue/doCopy', 2, storyheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Storyheader.vue/doCopy', 2, 'Error during the copy of a storyheader', trace.value)
                        return (0)
                    }
                })

            // Get the ID of the new copied datasetheader
            let Id = storyheader.value.id
            let stories = []

            // Copy all the linked rules
            consoleLog('Storyheader.vue/doCopy', 2, 'Copy all linked stories - storyheaderID: ' + storyheaderID, trace.value)
            const { error2, copyTheStory } = copyAllStory(Id, storyheaderID)
            return await copyTheStory(stories, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Storyheader.vue/doCopy', 2, 'Full Stories copy status: ' + stories.value.success, trace.value)
                    if (stories.value.success) {
                        consoleLog('Storyheader.vue/doCopy', 2, stories, trace.value)
                        return (1)
                    } else {
                        consoleLog('Storyheader.vue/doCopy', 2, 'Error during the copy of the full rules', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a storyheader 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (storyheaderID, position) => {

            let storyheader = []
            consoleLog('Storyheader.vue/doUpdatePosition', 2, 'Change the position of a Storyheader - storyheaderID: ' + storyheaderID + ', position: ' + position, trace.value)
            const { error, updateThePosition } = updatePositionStoryheaders(storyheaderID, position)
            return await updateThePosition(storyheader, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('Storyheader.vue/doUpdatePosition', 2, 'Storyheader status: ' + storyheader.value.success, trace.value)
                    if (storyheader.value.success) {
                        consoleLog('Storyheader.vue/doUpdatePosition', 2, storyheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Storyheader.vue/doUpdatePosition', 2, 'Error during the update of the storyheader position', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete a storyheader 
        // --------------------------------------------------------------------------
        const doDelete = async (storyheaderID) => {
            let storyheader = []
            consoleLog('Storyheader.vue/doDelete', 2, 'Delete an existing Storyheader ' + storyheaderID, trace.value)
            const { error, deleteTheStoryheader } = deleteStoryheader(subprojectID.value, storyheaderID)
            await deleteTheStoryheader(storyheader, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Storyheader.vue/doDelete', 2, 'Storyheader delete status: ' + storyheader.value.success, trace.value)
                    if (storyheader.value.success) {
                        consoleLog('Storyheader.vue/doDelete', 2, storyheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Storyheader.vue/doDelete', 2, 'Error during the delete of a storyheader', trace.value)
                        return (0)
                    }
                })

            let rules = []
            consoleLog('Storyheader.vue/doDelete', 2, 'Delete all linked Stories - storyheaderID: ' + storyheaderID, trace.value)
            const { error2, deleteTheStory } = deleteAllStory(storyheaderID)
            return await deleteTheStory(rules, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Storyheader.vue/doDelete', 2, 'Full Stories delete status: ' + rules.value.success, trace.value)
                    if (rules.value.success) {
                        consoleLog('Storyheader.vue/doDelete', 2, rules, trace.value)
                        return (1)
                    } else {
                        consoleLog('Storyheader.vue/doDelete', 2, 'No Story to delete', trace.value)
                        return (1)
                    }
                })
        }



        // --------------------------------------------------------------------------
        // Storyheaders received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (storyheaderID) => {
            consoleLog('Storyheader.vue/selectRecord', 2, 'Received a request to select a record: ' + storyheaderID, trace.value)
            if (!recordSelected.value.includes(storyheaderID)) {
                recordSelected.value.push(storyheaderID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != storyheaderID)
            }
            consoleLog('Storyheader.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('Storyheader.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // Storyheaders received a request to add a new Storyheader
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('Storyheader.vue/handleInsert', 2, 'Add ' + rowToInsert.value + ' new empty storyheader(s) after the Storyheader position: ' + position, trace.value)
            position = position.toString().padStart(6, '0') + 'I'
            let status = 1;
            let err = 1;
            for (let i = 1; i <= rowToInsert.value; i++) {
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a storyheader', 'Alert')
            } else {
                DisplayError('Inserted ' + rowToInsert.value + ' rule set(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            await doReorder()
            // Refresh the list
            await loadStoryheaderData()

        }


        // --------------------------------------------------------------------------
        // Storyheaders received a request to copy record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('Storyheader.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' storyheader(s) after the Storyheader position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to copy before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.toString().padStart(6, '0') + 'C'
                //console.log (' ******** 1 ******* Loop')
                // Copy all the selected storyheader(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doCopy(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the copy of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected Story set(s) copy successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadStoryheaderData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Storyheaders received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('Storyheader.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' storyheader(s) after the Storyheader position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.toString().padStart(6, '0') + 'M'
                //console.log (' ******** 1 ******* Loop')
                // Update the position of all the selected storyheader(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected Story set(s) reorder successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadStoryheaderData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Storyheaders received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (storyheaderID) => {
            consoleLog('Storyheader.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' storyheader(s) and the Storyheader: ' + storyheaderID, trace.value)
            let status = 1;
            //console.log (' ******** 1 ******* Loop')

            // Add the storyheaderID if it's not already in the list
            if (!recordSelected.value.includes(storyheaderID)) {
                recordSelected.value.push(storyheaderID)
            }

            // Delete the selected storyheader(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected storyheader(s)', 'Alert')
            } else {
                DisplayError('Selected Story set(s) deleted successfully', 'Info')
            }
            //console.log (' ******** 2 ******* refresh')
            // Refresh the list
            await loadStoryheaderData()
            recordSelected.value = []
        }

        // --------------------------------------------------------------------------
        // User ask to go to the logfile
        // --------------------------------------------------------------------------
        const handleLogfile = () => {
            consoleLog('Storyheader.vue/handleLogfile', 2, 'User want to view the Logfile', trace.value)
            context.emit('storelocation', 'story')
            router.push({ name: 'Logfiles' })
        }


        return {
            errorMessage, styleMessage, storyheaders, filteredData, filterValue, filteredRows, workspaceID, workspace,
            superUser, projectID, projectName, subprojectID, subprojectName, userID, userName, displayInfo, trace, rowToInsert,
            handleCancel, refreshStoryheaders, handleInsert, handleCopy, handleMove, handleDelete, selectRecord,
            handleFocus, handleBlur, handleCancel, handleRowToInsert, storeLocation, handleLogfile
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
    scrollbar-width: thin;
    height: 50rem;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>