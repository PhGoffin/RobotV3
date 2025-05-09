<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">Path</h3>
                <img src="../../assets/AIRobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <button @click="handleInsert('-1')">
                    <i class="fa-solid fa-circle-plus"></i>
                    Path</button>

                <button @click="handleImport()" class="action">
                    <i class="fa-solid fa-download"></i>
                    Import Path</button>


                <form @submit.prevent="">

                    <table>
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
                                        <input type="text" name="dataFilter" class="input" @focus="handleFocus($event)"
                                            title="You can filter by the path or by comment" @blur="handleBlur($event)"
                                            v-model="filterValue" />
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
                        <AIPathList class="AIPathList" :key="filterValue" :aipaths="filteredData" :workspaceID="workspaceID"
                            :workspace="workspace" :superUser="superUser" :projectID="projectID" :userID="userID"
                            :trace="trace" @refreshPath="refreshPath" @selectrecord="selectRecord"
                            @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove"
                            @handledelete="handleDelete" />
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
import AIPathList from '../../components/ai_path/AIPathList.vue'
import getAI_PathByProject from '../../composables/ai_path/getAI_PathByProject'
import updatePositionAI_Path from '../../composables/ai_path/updatePositionAI_Path'
import reorderAI_Path from '../../composables/ai_path/reorderAI_Path'
import addAI_Path from '../../composables/ai_path/addAI_Path'
import copyAI_Path from '../../composables/ai_path/copyAI_Path'
import deleteAI_Path from '../../composables/ai_path/deleteAI_Path'
import importAI_Path from '../../composables/ai_path/importAI_Path'


import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Function',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'location'],
    components: { AIPathList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const recordTarget = ref(0)
        const rowToInsert = ref(1)


        displayMsg('AIPath.vue', trace.value)
        consoleLog('AIPath.vue - props', 1, props, trace.value)

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
        const superUser = ref(props.superUser)
        const aipaths = ref([])
        const displayInfo = ref('')
        const location = ref(props.location)
        const filterValue = ref('')

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
            consoleLog('AIPath.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        const loadPathData = async () => {
            // -------------------------------------------
            // load all the AI Paths  
            // -------------------------------------------
            consoleLog('AIPath.vue/loadPathData', 2, 'Loading Paths', trace.value)
            const { error, getTheAI_Path } = getAI_PathByProject(projectID.value)
            getTheAI_Path(aipaths, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('AIPath.vue/loadPathData', 2, 'Path Load status: ' + aipaths.value.success, trace.value)
                    if (aipaths.value.success && aipaths.value.data.length) {
                        aipaths.value = aipaths.value.data
                        filteredData.value = aipaths.value
                        consoleLog('AIPath.vue/loadPathData', 2, aipaths.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('AIPath.vue/loadPathData', 2, 'No Path found!', trace.value)
                        return (0)
                    }
                })
        }


        // Load projects data
        loadPathData()


        // ---------------------------------------------
        // Compute the functions depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('AIPath.vue/filteredData', 2, 'computed value', trace.value)
            if (aipaths.value.length) {
                return aipaths.value.filter((ar) => ar.fullPath.toUpperCase().includes(filterValue.value.toUpperCase())
                    || ar.comment.toUpperCase().includes(filterValue.value.toUpperCase()))
            } else {
                filteredRows.value = ''
                return aipaths.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })


        // --------------------------------------------------------------------------
        // AIPathList emits a request to refresh the functions
        // --------------------------------------------------------------------------
        const refreshPath = (status, msg) => {
            consoleLog('AIPath.vue/refreshPath', 2, 'received a request to refresh the functions  from AIPathList / AIPathSingle', trace.value)
            consoleLog('AIPath.vue/refreshPath', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadPathData()
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
        // User cancel the action, Back to the control panel or the dashbaord
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('AIPath.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'AIRobot' })
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
        // Call the API to reorder correctly all the positions of the Paths 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let aipath = []
            consoleLog('AIPath.vue/doReorder', 2, 'Reorder all the positions of the References', trace.value)
            const { error, reorderTheAI_Path } = reorderAI_Path(projectID.value)
            return await reorderTheAI_Path(aipath, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('AIPath.vue/doReorder', 2, 'Path reorder status: ' + aipath.value.success, trace.value)
                    if (aipath.value.success) {
                        consoleLog('AIPath.vue/doReorder', 2, aipath, trace.value)
                        return (1)
                    } else {
                        consoleLog('AIPath.vue/doReorder', 2, 'Error during the reorder of the Path position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert a Path 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let aipath = []
            let path = 'New'
            let comment = 'New'


            consoleLog('AIPath.vue/doInsert', 2, 'Insert a new Path - position: ' + position, trace.value)
            // projectID, path, pathCondition, comment, position, active

            const { error, addNewAI_Path } = addAI_Path(projectID.value, path, '', 100, comment, position, 1)
            return await addNewAI_Path(aipath, trace.value)
                .then(function () {
                    // check the status of the insert
                    consoleLog('AIPath.vue/doInsert', 2, 'Path insert status: ' + aipath.value.success, trace.value)
                    if (aipath.value.success) {
                        consoleLog('AIPath.vue/doInsert', 2, aipath, trace.value)
                        return (1)
                    } else {
                        consoleLog('AIPath.vue/doInsert', 2, 'Error during the insert of a Path', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to copy a Path 
        // --------------------------------------------------------------------------
        const doCopy = async (PathID, position) => {
            let aipath = []
            consoleLog('AIPath.vue/doCopy', 2, 'Copy an existing Function - PathID: ' + PathID + ' at position: ' + position, trace.value)
            const { error, copyTheAI_Path } = copyAI_Path(PathID, position)
            return await copyTheAI_Path(aipath, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('AIPath.vue/doCopy', 2, 'Path copy status: ' + aipath.value.success, trace.value)
                    if (aipath.value.success) {
                        consoleLog('AIPath.vue/doCopy', 2, aipath, trace.value)
                        return (1)
                    } else {
                        consoleLog('AIPath.vue/doCopy', 2, 'Error during the copy of a Path', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a Path 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (PathID, position) => {

            let aipath = []
            consoleLog('AIPath.vue/doUpdatePosition', 2, 'Change the position of a Path - PathID: ' + PathID + ', position: ' + position, trace.value)
            const { error, updateTheAI_Path } = updatePositionAI_Path(PathID, position)
            return await updateTheAI_Path(aipath, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('AIPath.vue/doUpdatePosition', 2, 'Path status: ' + aipath.value.success, trace.value)
                    if (aipath.value.success) {
                        consoleLog('AIPath.vue/doUpdatePosition', 2, aipath, trace.value)
                        return (1)
                    } else {
                        consoleLog('AIPath.vue/doUpdatePosition', 2, 'Error during the update of the Path position', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete a Path 
        // --------------------------------------------------------------------------
        const doDelete = async (PathID) => {
            let aipath = []
            consoleLog('AIPath.vue/doDelete', 2, 'Delete an existing Path - PathID: ' + PathID, trace.value)
            const { error, deleteTheAI_Path } = deleteAI_Path(PathID)
            return await deleteTheAI_Path(aipath, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('AIPath.vue/doDelete', 2, 'Path delete status: ' + aipath.value.success, trace.value)
                    if (aipath.value.success) {
                        consoleLog('AIPath.vue/doDelete', 2, aipath, trace.value)
                        return (1)
                    } else {
                        consoleLog('AIPath.vue/doDelete', 2, 'Error during the delete of a Path', trace.value)
                        return (0)
                    }
                })
        }



        // --------------------------------------------------------------------------
        // aipath received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (PathID) => {
            consoleLog('AIPath.vue/selectRecord', 2, 'Received a request to select a record: ' + PathID, trace.value)
            if (!recordSelected.value.includes(PathID)) {
                recordSelected.value.push(PathID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != PathID)
            }
            consoleLog('AIPath.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('AIPath.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // aipath received a request to add a new Reference
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('AIPath.vue/handleInsert', 2, 'Add ' + rowToInsert.value + ' new empty function(s) after the position: ' + position, trace.value)
            position = position.padStart(6, '0') + 'I'
            let status = 1;
            let err = 1;
            for (let i = 1; i <= rowToInsert.value; i++) {
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a Path', 'Alert')
            } else {
                DisplayError('Inserted ' + rowToInsert.value + ' Path(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            await doReorder()
            // Refresh the list
            await loadPathData()

        }


        // --------------------------------------------------------------------------
        // aipath received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('AIPath.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' Path(s) after the position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to copy before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.padStart(6, '0') + 'C'
                // Copy all the selected function(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doCopy(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the copy of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected Path(s) copy successfully', 'Info')
                }
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                // Refresh the list
                await loadPathData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // aipath received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('AIPath.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' Path(s) after the position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.padStart(6, '0') + 'M'
                // Update the position of all the selected function(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected function(s) reorder successfully', 'Info')
                }
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                // Refresh the list
                await loadPathData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // aipath received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (PathID) => {
            consoleLog('AIPath.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' function(s) and the function: ' + PathID, trace.value)
            let status = 1;

            // Add the PathID if it's not already in the list
            if (!recordSelected.value.includes(PathID)) {
                recordSelected.value.push(PathID)
            }
            // Delete the selected function(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected Path(s)', 'Alert')
            } else {
                DisplayError('Selected Path(s) deleted successfully', 'Info')
            }
            // Refresh the list
            await loadPathData()
            recordSelected.value = []
        }

        // --------------------------------------------------------------------------
        // Path received a request to import paths into a project
        // --------------------------------------------------------------------------
        const handleImport = async () => {
            let aipath = []

            consoleLog('AIPath.vue/handleImport', 2, 'Import paths into the project (' + projectID.value + ') ' + projectName.value, trace.value)
            const { error, importData } = importAI_Path(projectID.value)
            let ret = await importData(aipath, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('AIPath.vue/handleImport', 2, 'Path status: ' + aipath.value.success, trace.value)
                    if (aipath.value.success) {
                        consoleLog('AIPath.vue/handleImport', 2, aipath, trace.value)
                        DisplayError(aipath.value.message, 'Info')
                        return (1)
                    } else {
                        consoleLog('AIPath.vue/handleImport', 2, 'Error during the import of the paths', trace.value)
                        DisplayError('Internal Error during the import', 'Error')
                        return (0)
                    }
                })
            // Load attribute data
            await loadPathData()
            return (ret)
        }

        return {
            errorMessage, styleMessage, aipaths, filteredData, filterValue, filteredRows, workspaceID, workspace,
            superUser, projectID, projectName, userID, displayInfo, trace, rowToInsert,
            handleCancel, refreshPath, handleInsert, handleCopy, handleMove, handleDelete, selectRecord,
            handleFocus, handleBlur, handleCancel, handleRowToInsert, handleImport
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