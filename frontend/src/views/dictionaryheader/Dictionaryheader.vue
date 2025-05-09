<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ projectName }}<br>-- Dictionary Set --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <button @click="handleInsert('0')">
                    <i class="fa-solid fa-circle-plus"></i>
                    Dictionary Set</button>

                <router-link :to="{ name: 'Dictionary', params: { id: -1 } }">
                    <button class="action" title="Display unused words of the Dictionary">
                        <i class="fa-solid fa-eye-slash"></i>
                        Unused Word</button>
                </router-link>


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
                        <DictionaryheaderList class="dictionaryheaderList" :dictionaryheaders="filteredData"
                            :workspaceID="workspaceID" :workspace="workspace" :superUser="superUser"
                            :projectID="projectID" :subprojectID="subprojectID" :userID="userID" :trace="trace"
                            :location="location" @refreshdictionaryheaders="refreshDictionaryheader"
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
import DictionaryheaderList from '../../components/dictionaryheader/DictionaryheaderList.vue'
import getDictionaryheaderByProject from '../../composables/dictionaryheader/getDictionaryheaderByProject'
import updatePositionDictionaryheader from '../../composables/dictionaryheader/updatePositionDictionaryheader'
import reorderDictionaryheader from '../../composables/dictionaryheader/reorderDictionaryheader'
import addDictionaryheader from '../../composables/dictionaryheader/addDictionaryheader'
import copyDictionaryheader from '../../composables/dictionaryheader/copyDictionaryheader'
import copyAllDictionary from '../../composables/dictionary/copyAllDictionary'
import deleteDictionaryheader from '../../composables/dictionaryheader/deleteDictionaryheader'
import deleteAllDictionary from '../../composables/dictionary/deleteAllDictionary'

import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Dictionaryheader',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'subprojectID', 'subprojectName', 'location'],
    components: { DictionaryheaderList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const recordTarget = ref(0)
        const rowToInsert = ref(1)


        displayMsg('Dictionaryheader.vue', trace.value)
        consoleLog('Dictionaryheader.vue - props', 1, props, trace.value)

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
        const dictionaryheaders = ref([])
        const displayInfo = ref('')
        const location = ref(props.location)
        const filterValue = ref('')
        const testID = ref(0)
        const ruleID = ref(0)


        // -----------------------------------------------------------------------
        // Check if we come from the test or rule vue
        // Syntax is: test=<testID>=<??>=<parameter number - 1, 2 or 3>=<filter data>
        // Syntax is: rule=<ruleID>=<1>====
        // -----------------------------------------------------------------------
        if (location.value.includes('test=')) {
            // split the location to find the keyword
            let data = location.value.split("=");
            testID.value = data[1]
        } else if (location.value.includes('rule=')) {
            // split the location to find the keyword
            let data = location.value.split("=");
            ruleID.value = data[1]
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
            consoleLog('Dictionaryheader.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        const loadDictionaryheaderData = async () => {
            // -------------------------------------------
            // load all the dictionaryheaders of the project 
            // -------------------------------------------
            consoleLog('Dictionaryheader.vue/loadDictionaryheaderData', 2, 'Loading dictionaryheader by project', trace.value)
            const { error, loadDictionaryheader } = getDictionaryheaderByProject(projectID.value)
            loadDictionaryheader(dictionaryheaders, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Dictionaryheader.vue/loadDictionaryheaderData', 2, 'Dictionaryheader Load by subproject status: ' + dictionaryheaders.value.success, trace.value)
                    if (dictionaryheaders.value.success && dictionaryheaders.value.data.length) {
                        dictionaryheaders.value = dictionaryheaders.value.data
                        filteredData.value = dictionaryheaders.value
                        consoleLog('Dictionaryheader.vue/loadDictionaryheaderData', 2, dictionaryheaders.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dictionaryheader.vue/loadDictionaryheaderData', 2, 'No dictionaryheader found!', trace.value)
                        return (0)
                    }
                })
        }


        // Load projects data
        loadDictionaryheaderData()


        // ---------------------------------------------
        // Compute the dictionaryheaders depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('Dictionaryheader.vue/filteredData', 2, 'computed value', trace.value)
            if (dictionaryheaders.value.length) {
                return dictionaryheaders.value.filter((ar) => ar.code.toUpperCase().includes(filterValue.value.toUpperCase())
                    || ar.comment.toUpperCase().includes(filterValue.value.toUpperCase()))
            } else {
                filteredRows.value = ''
                return dictionaryheaders.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })


        // --------------------------------------------------------------------------
        // DictionaryheaderList emits a request to refresh the dictionaryheaders
        // --------------------------------------------------------------------------
        const refreshDictionaryheader = (status, msg) => {
            consoleLog('Dictionaryheader.vue/refreshDictionaryheader', 2, 'received a request to refresh the dictionaryheaders  from DictionaryheaderList / DictionaryheaderSingle', trace.value)
            consoleLog('Dictionaryheader.vue/refreshDictionaryheader', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadDictionaryheaderData()
        }

        // --------------------------------------------------------------------------
        // DictionaryheaderList emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = (location) => {
            consoleLog('Dictionaryheader.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
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
            consoleLog('Dictionaryheader.vue/handleCancel', 2, 'User Cancel the action from: ' + location.value, trace.value)
            if (location.value.includes('test=')) {
                router.push({ name: 'TestEdit', params: { id: testID.value } })
            } else if (location.value.includes('rule=')) {
                router.push({ name: 'RuleEdit', params: { id: ruleID.value } })
            }
            else {
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
        // Call the API to reorder correctly all the positions of the dictionaryheaders 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let dictionaryheader = []
            consoleLog('Dictionaryheader.vue/doReorder', 2, 'Reorder all the positions of the Dictionaryheaders', trace.value)
            const { error, reorderTheDictionaryheader } = reorderDictionaryheader(projectID.value)
            return await reorderTheDictionaryheader(dictionaryheader, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Dictionaryheader.vue/doReorder', 2, 'Dictionary set reorder status: ' + dictionaryheader.value.success, trace.value)
                    if (dictionaryheader.value.success) {
                        consoleLog('Dictionaryheader.vue/doReorder', 2, dictionaryheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dictionaryheader.vue/doReorder', 2, 'Error during the reorder of the dictionary set position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert a dictionaryheader 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let dictionaryheader = []
            let code = '@New'

            consoleLog('Dictionaryheader.vue/doInsert', 2, 'Insert a new Dictionaryheader', trace.value)
            // projectID, code, comment, position, active
            const { error, addNewDictionaryheader } = addDictionaryheader(projectID.value, code, '', position, 1)
            return await addNewDictionaryheader(dictionaryheader, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Dictionaryheader.vue/doInsert', 2, 'Dictionary set insert status: ' + dictionaryheader.value.success, trace.value)
                    if (dictionaryheader.value.success) {
                        consoleLog('Dictionaryheader.vue/doInsert', 2, dictionaryheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dictionaryheader.vue/doInsert', 2, 'Error during the insert of a dictionary set', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to copy a dictionaryheader 
        // --------------------------------------------------------------------------
        const doCopy = async (dictionaryheaderID, position) => {
            let dictionaryheader = []
            consoleLog('Dictionaryheader.vue/doCopy', 2, 'Copy an existing Dictionaryheader - dictionaryheaderID: ' + dictionaryheaderID + ' at position: ' + position, trace.value)
            const { error, copyTheDictionaryheader } = copyDictionaryheader(dictionaryheaderID, position)
            await copyTheDictionaryheader(dictionaryheader, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Dictionaryheader.vue/doCopy', 2, 'Dictionary status copy status: ' + dictionaryheader.value.success, trace.value)
                    if (dictionaryheader.value.success) {
                        consoleLog('Dictionaryheader.vue/doCopy', 2, dictionaryheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dictionaryheader.vue/doCopy', 2, 'Error during the copy of a dictionary set', trace.value)
                        return (0)
                    }
                })

            // Get the ID of the new copied datasetheader
            let Id = dictionaryheader.value.id
            let dictionary = []

            // Copy all the linked dictionary records
            consoleLog('Dictionaryheader.vue/doCopy', 2, 'Copy all linked dictionary records - dictionaryheaderID: ' + dictionaryheaderID, trace.value)
            const { error2, copyTheDictionary } = copyAllDictionary(Id, dictionaryheaderID)
            return await copyTheDictionary(dictionary, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Dictionaryheader.vue/doCopy', 2, 'Full Dictionary copy status: ' + dictionary.value.success, trace.value)
                    if (dictionary.value.success) {
                        consoleLog('Dictionaryheader.vue/doCopy', 2, dictionary, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dictionaryheader.vue/doCopy', 2, 'Error during the copy of the full dictionary records', trace.value)
                        return (0)
                    }
                })

        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a dictionaryheader 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (dictionaryheaderID, position) => {

            let dictionaryheader = []
            consoleLog('Dictionaryheader.vue/doUpdatePosition', 2, 'Change the position of a Dictionaryheader - dictionaryheaderID: ' + dictionaryheaderID + ', position: ' + position, trace.value)
            const { error, updateThePosition } = updatePositionDictionaryheader(dictionaryheaderID, position)
            return await updateThePosition(dictionaryheader, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('Dictionaryheader.vue/doUpdatePosition', 2, 'Dictionary set status: ' + dictionaryheader.value.success, trace.value)
                    if (dictionaryheader.value.success) {
                        consoleLog('Dictionaryheader.vue/doUpdatePosition', 2, dictionaryheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dictionaryheader.vue/doUpdatePosition', 2, 'Error during the update of the dictionary set position', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete a dictionaryheader 
        // --------------------------------------------------------------------------
        const doDelete = async (dictionaryheaderID) => {
            let dictionaryheader = []
            consoleLog('Dictionaryheader.vue/doDelete', 2, 'Delete an existing Dictionaryheader - projectID: ' + projectID.value + ', dictionaryheaderID: ' + dictionaryheaderID, trace.value)
            const { error, deleteTheDictionaryheader } = deleteDictionaryheader(projectID.value, dictionaryheaderID)
            await deleteTheDictionaryheader(dictionaryheader, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Dictionaryheader.vue/doDelete', 2, 'Dictionary set delete status: ' + dictionaryheader.value.success, trace.value)
                    if (dictionaryheader.value.success) {
                        consoleLog('Dictionaryheader.vue/doDelete', 2, dictionaryheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dictionaryheader.vue/doDelete', 2, 'Error during the delete of a dictionary set', trace.value)
                        return (0)
                    }
                })

            let dictionary = []
            consoleLog('Dictionaryheader.vue/doDelete', 2, 'Delete all linked Dictionary records - dictionaryheaderID: ' + dictionaryheaderID, trace.value)
            const { error2, deleteTheDictionary } = deleteAllDictionary(dictionaryheaderID)
            return await deleteTheDictionary(dictionary, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Dictionaryheader.vue/doDelete', 2, 'Full Dictionary delete status: ' + dictionary.value.success, trace.value)
                    if (dictionary.value.success) {
                        consoleLog('Dictionaryheader.vue/doDelete', 2, dictionary, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dictionaryheader.vue/doDelete', 2, 'No dataset to delete', trace.value)
                        return (1)
                    }
                })
        }



        // --------------------------------------------------------------------------
        // Dictionaryheaders received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (dictionaryheaderID) => {
            consoleLog('Dictionaryheader.vue/selectRecord', 2, 'Received a request to select a record: ' + dictionaryheaderID, trace.value)
            if (!recordSelected.value.includes(dictionaryheaderID)) {
                recordSelected.value.push(dictionaryheaderID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != dictionaryheaderID)
            }
            consoleLog('Dictionaryheader.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('Dictionaryheader.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // Dictionaryheaders received a request to add a new Dictionaryheader
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('Dictionaryheader.vue/handleInsert', 2, 'Add ' + rowToInsert.value + ' new empty dictionaryheader(s) after the Dictionaryheader position: ' + position, trace.value)
            position = position.toString().padStart(6, '0') + 'I'
            let status = 1;
            let err = 1;
            for (let i = 1; i <= rowToInsert.value; i++) {
                //console.log (' ******** 1 ******* Loop: ' + i)
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a dictionary set', 'Alert')
            } else {
                DisplayError('Inserted ' + rowToInsert.value + ' dictionary set(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            //console.log (' ******** 2 ******* reorder')
            await doReorder()
            // Refresh the list
            //console.log (' ******** 3 ******* refresh')
            await loadDictionaryheaderData()

        }


        // --------------------------------------------------------------------------
        // Dictionaryheaders received a request to copy record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('Dictionaryheader.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' dictionaryheader(s) after the Dictionaryheader position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to copy before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.toString().padStart(6, '0') + 'C'
                //console.log (' ******** 1 ******* Loop')
                // Copy all the selected dictionaryheader(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doCopy(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the copy of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected dictionary set(s) copy successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadDictionaryheaderData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Dictionaryheaders received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('Dictionaryheader.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' dictionaryheader(s) after the Dictionaryheader position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.toString().padStart(6, '0') + 'M'
                //console.log (' ******** 1 ******* Loop')
                // Update the position of all the selected dictionaryheader(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected dictionary set(s) reorder successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadDictionaryheaderData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Dictionaryheaders received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (dictionaryheaderID) => {
            consoleLog('Dictionaryheader.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' dictionaryheader(s) and the Dictionaryheader: ' + dictionaryheaderID, trace.value)
            let status = 1;
            //console.log (' ******** 1 ******* Loop')

            // Add the dictionaryheaderID if it's not already in the list
            if (!recordSelected.value.includes(dictionaryheaderID)) {
                recordSelected.value.push(dictionaryheaderID)
            }

            // Delete the selected dictionaryheader(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected dictionary set(s)', 'Alert')
            } else {
                DisplayError('Selected dictionary set(s) deleted successfully', 'Info')
            }
            //console.log (' ******** 2 ******* refresh')
            // Refresh the list
            await loadDictionaryheaderData()
            recordSelected.value = []
        }



        return {
            errorMessage, styleMessage, dictionaryheaders, filteredData, filterValue, filteredRows, workspaceID, workspace,
            superUser, projectID, projectName, subprojectID, subprojectName, userID, displayInfo, trace, rowToInsert,
            handleCancel, refreshDictionaryheader, handleInsert, handleCopy, handleMove, handleDelete, selectRecord,
            handleFocus, handleBlur, handleRowToInsert, storeLocation
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

.entity {
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

button.action {
    background-color: #7cbcbc;
}

button.action:hover {
    background-color: white;
    color: black;
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