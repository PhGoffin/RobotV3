<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ subprojectName }}<br>-- Suite Set --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">
                
                <button @click="handleInsert('0')">
                    <i class="fa-solid fa-circle-plus"></i>                    
                    Suite Set</button>
                <button @click="handleLogfile">
                    <i class="fa-regular fa-eye"></i>
                    Logfile</button>


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
                                    <i class="fa-regular fa-trash-can" @click="filterValue=''" title="Reset the filter"></i>
                                </div>
                            </td>
                        </tr>

                    </table>

                </form>


                <div class="entities"  height="150px">
                    <div v-if="error"> {{ error }}</div>
                    <div v-if="filteredData.length" class="layout">
                        <SuiteheaderList class="suiteheadersList" :suiteheaders="filteredData" :workspaceID="workspaceID"
                            :workspace="workspace" :superUser="superUser" :projectID="projectID" :currentuser="userName"
                            :subprojectID="subprojectID" :userID="userID" :trace="trace" :location="location"
                            @refreshsuiteheaders="refreshSuiteheaders" @selectrecord="selectRecord" @handleinsert="handleInsert"
                            @handlecopy="handleCopy" @handlemove="handleMove" @handledelete="handleDelete"  @storelocation="storeLocation" />
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


import SuiteheaderList from '../../components/suiteheader/SuiteheaderList.vue'
import getSuiteheadersBySubproject from '../../composables/suiteheader/getSuiteheadersBySubproject'
import updatePositionSuiteheaders from '../../composables/suiteheader/updatePositionSuiteheaders'
import reorderSuiteheaders from '../../composables/suiteheader/reorderSuiteheaders'
import addSuiteheader from '../../composables/suiteheader/addSuiteheader'
import copySuiteheader from '../../composables/suiteheader/copySuiteheader'
import copyAllSuite from '../../composables/suite/copyAllSuite'
import deleteSuiteheader from '../../composables/suiteheader/deleteSuiteheader'
import deleteAllSuite from '../../composables/suite/deleteAllSuite'


import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Suiteheader',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'subprojectID', 'subprojectName', 'location'],
    components: { SuiteheaderList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const recordTarget = ref(0)
        const rowToInsert = ref(1)


        displayMsg('Suiteheader.vue', trace.value)
        consoleLog('Suiteheader.vue - props', 1, props, trace.value)

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
        const suiteheaders = ref([])
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


        // -----------------------------------------------------------------------
        // Check if we come from the test vue
        //              0      1            2                 3                     4            5              6
        // Syntax is: story=<storyID>=<datasetheaderID>=<parameter 1, 2 or 3>=<filter data1>=<filter data2>=<filter data3>
        // -----------------------------------------------------------------------
        if (location.value.includes('story=')) {
            // split the location to find the keyword
            let data = location.value.split("=");
            if (data[3] != undefined) {
                let i = data[3] * 1
                filterValue.value = data[3+i]
                if (filterValue.value == undefined) filterValue.value = ""
            }
            storyID.value = data[1]
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
            consoleLog('Suiteheader.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }
      

        const loadSuiteheaderData = async () => {
            // -------------------------------------------
            // load all the suiteheaders of the subproject 
            // -------------------------------------------
            consoleLog('Suiteheader.vue/loadSuiteheaderData', 2, 'Loading suiteheader by subproject', trace.value)
            const { error, loadSuiteheader } = getSuiteheadersBySubproject(subprojectID.value)
            loadSuiteheader(suiteheaders, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Suiteheader.vue/loadSuiteheaderData', 2, 'Suiteheaders status: ' + suiteheaders.value.success, trace.value)
                    if (suiteheaders.value.success && suiteheaders.value.data.length) {
                        suiteheaders.value = suiteheaders.value.data
                        filteredData.value = suiteheaders.value
                        consoleLog('Suiteheader.vue/loadSuiteheaderData', 2, suiteheaders.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('Suiteheader.vue/loadSuiteheaderData', 2, 'No suiteheader found!', trace.value)
                        return (0)
                    }
                })
        }


        // Load projects data
        loadSuiteheaderData()


        // ---------------------------------------------
        // Compute the suiteheaders depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('Suiteheader.vue/filteredData', 2, 'computed value', trace.value)
            if (suiteheaders.value.length) {
                return suiteheaders.value.filter((ar) => ar.label.toUpperCase().includes(filterValue.value.toUpperCase())
                    || ar.comment.toUpperCase().includes(filterValue.value.toUpperCase()))
            } else {
                filteredRows.value = ''
                return suiteheaders.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })


        // --------------------------------------------------------------------------
        // SuiteheaderSingle emits a request to refresh the suiteheaders
        // --------------------------------------------------------------------------
        const refreshSuiteheaders = (status, msg, reload) => {
            consoleLog('Suiteheader.vue/refreshSuiteheaders', 2, 'received a request to refresh the suiteheaders  from SuiteheadersList / SuiteheaderSingle', trace.value)
            consoleLog('Suiteheader.vue/refreshSuiteheaders', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            if (reload) loadSuiteheaderData()
        }


        // --------------------------------------------------------------------------
        // SuiteheaderSingle emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = (location) => {
            consoleLog('Suiteheader.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
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
            consoleLog('Suiteheader.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            if (location.value.includes('story=')) {
                router.push({ name: 'StoryEdit', params: { id: storyID.value } })                
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
        // Call the API to reorder correctly all the positions of the suiteheaders 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let suiteheader = []
            consoleLog('Suiteheader.vue/doReorder', 2, 'Reorder all the positions of the Suiteheaders', trace.value)
            const { error, reorderTheSuiteheaders } = reorderSuiteheaders(subprojectID.value)
            return await reorderTheSuiteheaders(suiteheader, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Suiteheader.vue/doReorder', 2, 'Suiteheader reorder status: ' + suiteheader.value.success, trace.value)
                    if (suiteheader.value.success) {
                        consoleLog('Suiteheader.vue/doReorder', 2, suiteheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Suiteheader.vue/doReorder', 2, 'Error during the reorder of the suiteheaders position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert a suiteheader 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let suiteheader = []
            let label = 'New'

            // subprojectID, label, comment, position, active
            consoleLog('Suiteheader.vue/doInsert', 2, 'Insert a new Suiteheader', trace.value)
            const { error, addNewSuiteheader } = addSuiteheader(subprojectID.value, label, '', position, 1, userName.value, today)
            return await addNewSuiteheader(suiteheader, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Suiteheader.vue/doInsert', 2, 'Suiteheader insert status: ' + suiteheader.value.success, trace.value)
                    if (suiteheader.value.success) {
                        consoleLog('Suiteheader.vue/doInsert', 2, suiteheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Suiteheader.vue/doInsert', 2, 'Error during the insert of a suiteheader', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to copy a suiteheader 
        // --------------------------------------------------------------------------
        const doCopy = async (suiteheaderID, position) => {
            let suiteheader = []
            consoleLog('Suiteheader.vue/doCopy', 2, 'Copy an existing Suiteheader - suiteheaderID: ' + suiteheaderID + ' at position: ' + position, trace.value)
            const { error1, copyTheSuiteheader } = copySuiteheader(suiteheaderID, position, userName.value, today)
            await copyTheSuiteheader(suiteheader, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Suiteheader.vue/doCopy', 2, 'Suiteheader copy status: ' + suiteheader.value.success, trace.value)
                    if (suiteheader.value.success) {
                        consoleLog('Suiteheader.vue/doCopy', 2, suiteheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Suiteheader.vue/doCopy', 2, 'Error during the copy of a suiteheader', trace.value)
                        return (0)
                    }
                })

            // Get the ID of the new copied datasetheader
            let Id = suiteheader.value.id
            let suites = []

            // Copy all the linked rules
            consoleLog('Suiteheader.vue/doCopy', 2, 'Copy all linked suites - suiteheaderID: ' + suiteheaderID, trace.value)
            const { error2, copyTheSuite } = copyAllSuite(Id, suiteheaderID)
            return await copyTheSuite(suites, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Suiteheader.vue/doCopy', 2, 'Full Suites copy status: ' + suites.value.success, trace.value)
                    if (suites.value.success) {
                        consoleLog('Suiteheader.vue/doCopy', 2, suites, trace.value)
                        return (1)
                    } else {
                        consoleLog('Suiteheader.vue/doCopy', 2, 'Error during the copy of the full rules', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a suiteheader 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (suiteheaderID, position) => {

            let suiteheader = []
            consoleLog('Suiteheader.vue/doUpdatePosition', 2, 'Change the position of a Suiteheader - suiteheaderID: ' + suiteheaderID + ', position: ' + position, trace.value)
            const { error, updateThePosition } = updatePositionSuiteheaders(suiteheaderID, position)
            return await updateThePosition(suiteheader, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('Suiteheader.vue/doUpdatePosition', 2, 'Suiteheader status: ' + suiteheader.value.success, trace.value)
                    if (suiteheader.value.success) {
                        consoleLog('Suiteheader.vue/doUpdatePosition', 2, suiteheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Suiteheader.vue/doUpdatePosition', 2, 'Error during the update of the suiteheader position', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete a suiteheader 
        // --------------------------------------------------------------------------
        const doDelete = async (suiteheaderID) => {
            let suiteheader = []
            consoleLog('Suiteheader.vue/doDelete', 2, 'Delete an existing Suiteheader ' + suiteheaderID, trace.value)
            const { error, deleteTheSuiteheader } = deleteSuiteheader(subprojectID.value, suiteheaderID)
            await deleteTheSuiteheader(suiteheader, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Suiteheader.vue/doDelete', 2, 'Suiteheader delete status: ' + suiteheader.value.success, trace.value)
                    if (suiteheader.value.success) {
                        consoleLog('Suiteheader.vue/doDelete', 2, suiteheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Suiteheader.vue/doDelete', 2, 'Error during the delete of a suiteheader', trace.value)
                        return (0)
                    }
                })

            let rules = []
            consoleLog('Suiteheader.vue/doDelete', 2, 'Delete all linked Suites - suiteheaderID: ' + suiteheaderID, trace.value)
            const { error2, deleteTheSuite } = deleteAllSuite(suiteheaderID)
            return await deleteTheSuite(rules, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Suiteheader.vue/doDelete', 2, 'Full Suites delete status: ' + rules.value.success, trace.value)
                    if (rules.value.success) {
                        consoleLog('Suiteheader.vue/doDelete', 2, rules, trace.value)
                        return (1)
                    } else {
                        consoleLog('Suiteheader.vue/doDelete', 2, 'No Suite to delete', trace.value)
                        return (1)
                    }
                })
        }



        // --------------------------------------------------------------------------
        // Suiteheaders received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (suiteheaderID) => {
            consoleLog('Suiteheader.vue/selectRecord', 2, 'Received a request to select a record: ' + suiteheaderID, trace.value)
            if (!recordSelected.value.includes(suiteheaderID)) {
                recordSelected.value.push(suiteheaderID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != suiteheaderID)
            }
            consoleLog('Suiteheader.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('Suiteheader.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // Suiteheaders received a request to add a new Suiteheader
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('Suiteheader.vue/handleInsert', 2, 'Add ' + rowToInsert.value + ' new empty suiteheader(s) after the Suiteheader position: ' + position, trace.value)
            position = position.toString().padStart(6, '0') + 'I'
            let status = 1;
            let err = 1;
            for (let i = 1; i <= rowToInsert.value; i++) {
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a suiteheader', 'Alert')
            } else {
                DisplayError('Inserted ' + rowToInsert.value + ' rule set(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            await doReorder()
            // Refresh the list
            await loadSuiteheaderData()

        }


        // --------------------------------------------------------------------------
        // Suiteheaders received a request to copy record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('Suiteheader.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' suiteheader(s) after the Suiteheader position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to copy before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.toString().padStart(6, '0') + 'C'
                //console.log (' ******** 1 ******* Loop')
                // Copy all the selected suiteheader(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doCopy(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the copy of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected Suite set(s) copy successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadSuiteheaderData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Suiteheaders received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('Suiteheader.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' suiteheader(s) after the Suiteheader position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.toString().padStart(6, '0') + 'M'
                //console.log (' ******** 1 ******* Loop')
                // Update the position of all the selected suiteheader(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected Suite set(s) reorder successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadSuiteheaderData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Suiteheaders received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (suiteheaderID) => {
            consoleLog('Suiteheader.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' suiteheader(s) and the Suiteheader: ' + suiteheaderID, trace.value)
            let status = 1;
            //console.log (' ******** 1 ******* Loop')

            // Add the suiteheaderID if it's not already in the list
            if (!recordSelected.value.includes(suiteheaderID)) {
                recordSelected.value.push(suiteheaderID)
            }

            // Delete the selected suiteheader(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected suiteheader(s)', 'Alert')
            } else {
                DisplayError('Selected Suite set(s) deleted successfully', 'Info')
            }
            //console.log (' ******** 2 ******* refresh')
            // Refresh the list
            await loadSuiteheaderData()
            recordSelected.value = []
        }

        // --------------------------------------------------------------------------
        // User ask to go to the logfile
        // --------------------------------------------------------------------------
        const handleLogfile = () => {
            consoleLog('Dashboard.vue/handleLogfile', 2, 'User want to view the Logfile', trace.value)
            context.emit('storelocation', 'suite')
            router.push({ name: 'Logfiles' })
        }



        return {
            errorMessage, styleMessage, suiteheaders, filteredData, filterValue, filteredRows, workspaceID, workspace,
            superUser, projectID, projectName, subprojectID, subprojectName, userID, userName, displayInfo, trace, rowToInsert,
            handleCancel, refreshSuiteheaders, handleInsert, handleCopy, handleMove, handleDelete, selectRecord,
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
    /* scrollbar-color: red orange; */
    scrollbar-width: thin;
    height: 50rem;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>