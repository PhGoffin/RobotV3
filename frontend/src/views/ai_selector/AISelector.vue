<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">Selector</h3>
                <img src="../../assets/AIRobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <button @click="handleInsert('-1')">
                    <i class="fa-solid fa-circle-plus"></i>
                    Selector</button>

                <button @click="handleImport()" class="action">
                    <i class="fa-solid fa-download"></i>
                    Import Selectors</button>



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
                                            title="You can filter by the name or by comment" @blur="handleBlur($event)"
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
                        <AISelectorList :key="filterValue" class="AISelectorList" :aiselectors="filteredData"
                            :workspaceID="workspaceID" :workspace="workspace" :superUser="superUser"
                            :projectID="projectID" :userID="userID" :trace="trace" @refreshSelector="refreshSelector"
                            @selectrecord="selectRecord" @handleinsert="handleInsert" @handlecopy="handleCopy"
                            @handlemove="handleMove" @handledelete="handleDelete" />
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
import AISelectorList from '../../components/ai_selector/AISelectorList.vue'
import getAI_SelectorByProject from '../../composables/ai_selector/getAI_SelectorByProject'
import updatePositionAI_Selector from '../../composables/ai_selector/updatePositionAI_Selector'
import reorderAI_Selector from '../../composables/ai_selector/reorderAI_Selector'
import addAI_Selector from '../../composables/ai_selector/addAI_Selector'
import copyAI_Selector from '../../composables/ai_selector/copyAI_Selector'
import deleteAI_Selector from '../../composables/ai_selector/deleteAI_Selector'
import importAI_Selector from '../../composables/ai_selector/importAI_Selector'


import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Function',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'location'],
    components: { AISelectorList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const recordTarget = ref(0)
        const rowToInsert = ref(1)


        displayMsg('AI_Selector.vue', trace.value)
        consoleLog('AI_Selector.vue - props', 1, props, trace.value)

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
        const aiselectors = ref([])
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
            consoleLog('AI_Selector.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        const loadSelectorData = async () => {
            // -------------------------------------------
            // load all the AI Selectors  
            // -------------------------------------------
            consoleLog('AI_Selector.vue/loadSelectorData', 2, 'Loading selectors', trace.value)
            const { error, getTheAI_Selector } = getAI_SelectorByProject(projectID.value)
            getTheAI_Selector(aiselectors, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('AI_Selector.vue/loadSelectorData', 2, 'Selector Load status: ' + aiselectors.value.success, trace.value)
                    if (aiselectors.value.success && aiselectors.value.data.length) {
                        aiselectors.value = aiselectors.value.data
                        filteredData.value = aiselectors.value
                        consoleLog('AI_Selector.vue/loadSelectorData', 2, aiselectors.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('AI_Selector.vue/loadSelectorData', 2, 'No Selector found!', trace.value)
                        return (0)
                    }
                })
        }


        // Load projects data
        loadSelectorData()


        // ---------------------------------------------
        // Compute the functions depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('AI_Selector.vue/filteredData', 2, 'computed value', trace.value)
            if (aiselectors.value.length) {
                return aiselectors.value.filter((ar) => ar.name.toUpperCase().includes(filterValue.value.toUpperCase())
                    || ar.comment.toUpperCase().includes(filterValue.value.toUpperCase()))
            } else {
                filteredRows.value = ''
                return aiselectors.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })


        // --------------------------------------------------------------------------
        // AISelectorList emits a request to refresh the functions
        // --------------------------------------------------------------------------
        const refreshSelector = (status, msg) => {
            consoleLog('AI_Selector.vue/refreshSelector', 2, 'received a request to refresh the functions  from AISelectorList / FunctionSingle', trace.value)
            consoleLog('AI_Selector.vue/refreshSelector', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadSelectorData()
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
            consoleLog('AI_Selector.vue/handleCancel', 2, 'User Cancel the action', trace.value)
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
        // Call the API to reorder correctly all the positions of the selectors 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let aiselector = []
            consoleLog('AI_Selector.vue/doReorder', 2, 'Reorder all the positions of the References', trace.value)
            const { error, reorderTheAI_Selector } = reorderAI_Selector(projectID.value)
            return await reorderTheAI_Selector(aiselector, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('AI_Selector.vue/doReorder', 2, 'Selector reorder status: ' + aiselector.value.success, trace.value)
                    if (aiselector.value.success) {
                        consoleLog('AI_Selector.vue/doReorder', 2, aiselector, trace.value)
                        return (1)
                    } else {
                        consoleLog('AI_Selector.vue/doReorder', 2, 'Error during the reorder of the selector position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert a selector 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let aiselector = []
            let name = 'New'
            let comment = 'New'


            consoleLog('AI_Selector.vue/doInsert', 2, 'Insert a new selector - position: ' + position, trace.value)
            // projectID, name, endTag, comment, position, active

            const { error, addNewAI_Selector } = addAI_Selector(projectID.value, name, '', comment, position, 1)
            return await addNewAI_Selector(aiselector, trace.value)
                .then(function () {
                    // check the status of the insert
                    consoleLog('AI_Selector.vue/doInsert', 2, 'Selector insert status: ' + aiselector.value.success, trace.value)
                    if (aiselector.value.success) {
                        consoleLog('AI_Selector.vue/doInsert', 2, aiselector, trace.value)
                        return (1)
                    } else {
                        consoleLog('AI_Selector.vue/doInsert', 2, 'Error during the insert of a selector', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to copy a selector 
        // --------------------------------------------------------------------------
        const doCopy = async (selectorID, position) => {
            let aiselector = []
            consoleLog('AI_Selector.vue/doCopy', 2, 'Copy an existing Function - selectorID: ' + selectorID + ' at position: ' + position, trace.value)
            const { error, copyTheAI_Selector } = copyAI_Selector(selectorID, position)
            return await copyTheAI_Selector(aiselector, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('AI_Selector.vue/doCopy', 2, 'Selector copy status: ' + aiselector.value.success, trace.value)
                    if (aiselector.value.success) {
                        consoleLog('AI_Selector.vue/doCopy', 2, aiselector, trace.value)
                        return (1)
                    } else {
                        consoleLog('AI_Selector.vue/doCopy', 2, 'Error during the copy of a Selector', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a selector 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (selectorID, position) => {

            let aiselector = []
            consoleLog('AI_Selector.vue/doUpdatePosition', 2, 'Change the position of a selector - selectorID: ' + selectorID + ', position: ' + position, trace.value)
            const { error, updateTheAI_Selector } = updatePositionAI_Selector(selectorID, position)
            return await updateTheAI_Selector(aiselector, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('AI_Selector.vue/doUpdatePosition', 2, 'Selector status: ' + aiselector.value.success, trace.value)
                    if (aiselector.value.success) {
                        consoleLog('AI_Selector.vue/doUpdatePosition', 2, aiselector, trace.value)
                        return (1)
                    } else {
                        consoleLog('AI_Selector.vue/doUpdatePosition', 2, 'Error during the update of the selector position', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete a selector 
        // --------------------------------------------------------------------------
        const doDelete = async (selectorID) => {
            let aiselector = []
            consoleLog('AI_Selector.vue/doDelete', 2, 'Delete an existing Selector - selectorID: ' + selectorID, trace.value)
            const { error, deleteTheAI_Selector } = deleteAI_Selector(selectorID)
            return await deleteTheAI_Selector(aiselector, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('AI_Selector.vue/doDelete', 2, 'Selector delete status: ' + aiselector.value.success, trace.value)
                    if (aiselector.value.success) {
                        consoleLog('AI_Selector.vue/doDelete', 2, aiselector, trace.value)
                        return (1)
                    } else {
                        consoleLog('AI_Selector.vue/doDelete', 2, 'Error during the delete of a selector', trace.value)
                        return (0)
                    }
                })
        }



        // --------------------------------------------------------------------------
        // AISelector received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (selectorID) => {
            consoleLog('AI_Selector.vue/selectRecord', 2, 'Received a request to select a record: ' + selectorID, trace.value)
            if (!recordSelected.value.includes(selectorID)) {
                recordSelected.value.push(selectorID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != selectorID)
            }
            consoleLog('AI_Selector.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('AI_Selector.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // AISelector received a request to add a new Reference
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('AI_Selector.vue/handleInsert', 2, 'Add ' + rowToInsert.value + ' new empty function(s) after the position: ' + position, trace.value)
            position = position.padStart(6, '0') + 'I'
            let status = 1;
            let err = 1;
            for (let i = 1; i <= rowToInsert.value; i++) {
                //console.log (' ******** 1 ******* Loop: ' + i)
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a selector', 'Alert')
            } else {
                DisplayError('Inserted ' + rowToInsert.value + ' selector(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            //console.log (' ******** 2 ******* reorder')
            await doReorder()
            // Refresh the list
            //console.log (' ******** 3 ******* refresh')
            await loadSelectorData()

        }


        // --------------------------------------------------------------------------
        // AISelector received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('AI_Selector.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' selector(s) after the position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to copy before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.padStart(6, '0') + 'C'
                //console.log (' ******** 1 ******* Loop')
                // Copy all the selected function(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doCopy(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the copy of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected selector(s) copy successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadSelectorData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // AISelector received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('AI_Selector.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' selector(s) after the position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.padStart(6, '0') + 'M'
                //console.log (' ******** 1 ******* Loop')
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
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadSelectorData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // AISelector received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (selectorID) => {
            consoleLog('AI_Selector.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' function(s) and the function: ' + selectorID, trace.value)
            let status = 1;
            //console.log (' ******** 1 ******* Loop')

            // Add the selectorID if it's not already in the list
            if (!recordSelected.value.includes(selectorID)) {
                recordSelected.value.push(selectorID)
            }

            // Delete the selected function(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected selector(s)', 'Alert')
            } else {
                DisplayError('Selected selector(s) deleted successfully', 'Info')
            }
            //console.log (' ******** 2 ******* refresh')
            // Refresh the list
            await loadSelectorData()
            recordSelected.value = []
        }


        // --------------------------------------------------------------------------
        // Selector received a request to import selector into a project
        // --------------------------------------------------------------------------
        const handleImport = async () => {
            let aiselector = []

            consoleLog('AI_Selector.vue/handleImport', 2, 'Import selectors into the project (' + projectID.value + ') ' + projectName.value, trace.value)
            const { error, importData } = importAI_Selector(projectID.value)
            let ret = await importData(aiselector, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('aiselector.vue/handleImport', 2, 'Selector status: ' + aiselector.value.success, trace.value)
                    if (aiselector.value.success) {
                        consoleLog('aiselector.vue/handleImport', 2, aiselector, trace.value)
                        DisplayError(aiselector.value.message, 'Info')
                        return (1)
                    } else {
                        consoleLog('aiselector.vue/handleImport', 2, 'Error during the import of the selectors', trace.value)
                        DisplayError('Internal Error during the import', 'Error')
                        return (0)
                    }
                })
            // Load selector data
            await loadSelectorData()
            return (ret)
        }


        return {
            errorMessage, styleMessage, aiselectors, filteredData, filterValue, filteredRows, workspaceID, workspace,
            superUser, projectID, projectName, userID, displayInfo, trace, rowToInsert,
            handleCancel, refreshSelector, handleInsert, handleCopy, handleMove, handleDelete, selectRecord,
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