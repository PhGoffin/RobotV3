<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ projectName }}<br>-- Rules set --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <button @click="handleInsert('0')">
                    <i class="fa-solid fa-circle-plus"></i>
                    Rule Set</button>

                <button @click="handleImport()" class="action">
                    <i class="fa-solid fa-download"></i>
                    Import</button>

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
                        <RuleheadersList class="ruleheadersList" :ruleheaders="filteredData" :workspaceID="workspaceID"
                            :workspace="workspace" :superUser="superUser" :projectID="projectID"
                            :subprojectID="subprojectID" :userID="userID" :trace="trace" :location="location"
                            @refreshruleheader="refreshRuleheader" @selectrecord="selectRecord"
                            @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove"
                            @handledelete="handleDelete" @storelocation="storeLocation" />
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
import RuleheadersList from '../../components/ruleheader/RuleheadersList.vue'
import getRuleheadersByProject from '../../composables/ruleheader/getRuleheadersByProject'
import updatePositionRuleheader from '../../composables/ruleheader/updatePositionRuleheader'
import reorderRuleheaders from '../../composables/ruleheader/reorderRuleheaders'
import addRuleheader from '../../composables/ruleheader/addRuleheader'
import copyRuleheader from '../../composables/ruleheader/copyRuleheader'
import copyAllRules from '../../composables/rule/copyAllRules'
import deleteRuleheader from '../../composables/ruleheader/deleteRuleheader'
import deleteAllRules from '../../composables/rule/deleteAllRules'

import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Ruleheader',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'subprojectID', 'subprojectName', 'location'],
    components: { RuleheadersList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const recordTarget = ref(0)
        const rowToInsert = ref(1)


        displayMsg('Ruleheader.vue', trace.value)
        consoleLog('Ruleheader.vue - props', 1, props, trace.value)

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
        const ruleheaders = ref([])
        const displayInfo = ref('')
        const location = ref(props.location)
        const filterValue = ref('')
        const testID = ref(0)

        const userName = ref(props.currentuser)
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
        const year = currentDate.getFullYear();
        let today = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year


        // -----------------------------------------------------------------------
        // Check if we come from the test vue
        //              0      1            2                 3                     4            5              6
        // Syntax is: test=<testID>=<datasetheaderID>=<parameter 1, 2 or 3>=<filter data1>=<filter data2>=<filter data3>
        // -----------------------------------------------------------------------
        if (location.value.includes('test=')) {
            // split the location to find the keyword
            let data = location.value.split("=");
            if (data[3] != undefined) {
                let i = data[3] * 1
                filterValue.value = data[3 + i]
                if (filterValue.value == undefined) filterValue.value = ""
            }
            testID.value = data[1]
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
            consoleLog('Ruleheader.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        const loadRuleheaderData = async () => {
            // -------------------------------------------
            // load all the ruleheaders of the project 
            // -------------------------------------------
            consoleLog('Ruleheader.vue/loadRuleheaderData', 2, 'Loading ruleheader by project', trace.value)
            const { error, loadRuleheader } = getRuleheadersByProject(projectID.value)
            loadRuleheader(ruleheaders, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Ruleheader.vue/loadRuleheaderData', 2, 'Ruleheaders status: ' + ruleheaders.value.success, trace.value)
                    if (ruleheaders.value.success && ruleheaders.value.data.length) {
                        ruleheaders.value = ruleheaders.value.data
                        filteredData.value = ruleheaders.value
                        consoleLog('Ruleheader.vue/loadRuleheaderData', 2, ruleheaders.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('Ruleheader.vue/loadRuleheaderData', 2, 'No ruleheader found!', trace.value)
                        return (0)
                    }
                })
        }


        // Load projects data
        loadRuleheaderData()


        // ---------------------------------------------
        // Compute the ruleheaders depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('Ruleheader.vue/filteredData', 2, 'computed value', trace.value)
            if (ruleheaders.value.length) {
                return ruleheaders.value.filter((ar) => ar.rule.toUpperCase().includes(filterValue.value.toUpperCase())
                    || ar.comment.toUpperCase().includes(filterValue.value.toUpperCase()))
            } else {
                filteredRows.value = ''
                return ruleheaders.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })


        // --------------------------------------------------------------------------
        // RuleheaderSingle emits a request to refresh the ruleheaders
        // --------------------------------------------------------------------------
        const refreshRuleheader = (status, msg) => {
            consoleLog('Ruleheader.vue/refreshRuleheader', 2, 'received a request to refresh the ruleheaders  from RuleheadersList / RuleheaderSingle', trace.value)
            consoleLog('Ruleheader.vue/refreshRuleheader', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadRuleheaderData()
        }


        // --------------------------------------------------------------------------
        // RuleheaderSingle emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = (location) => {
            consoleLog('Ruleheader.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
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
            consoleLog('Ruleheader.vue/handleImport', 2, 'User asks to go to the Import screen', trace.value)
            router.push({ name: 'RuleImport' })
        }

        // --------------------------------------------------------------------------
        // User cancel the action, Back to the control panel
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('Ruleheader.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            if (location.value.includes('test=')) {
                router.push({ name: 'TestEdit', params: { id: testID.value } })
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
        // Call the API to reorder correctly all the positions of the ruleheaders 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let ruleheader = []
            consoleLog('Ruleheader.vue/doReorder', 2, 'Reorder all the positions of the Ruleheaders', trace.value)
            const { error, reorderTheRuleheaders } = reorderRuleheaders(projectID.value)
            return await reorderTheRuleheaders(ruleheader, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Ruleheader.vue/doReorder', 2, 'Ruleheader reorder status: ' + ruleheader.value.success, trace.value)
                    if (ruleheader.value.success) {
                        consoleLog('Ruleheader.vue/doReorder', 2, ruleheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Ruleheader.vue/doReorder', 2, 'Error during the reorder of the ruleheaders position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert a ruleheader 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let ruleheader = []
            const now = new Date();
            let ruleheaderName = 'New'

            // projectID, ruleName, comment, position, active
            consoleLog('Ruleheader.vue/doInsert', 2, 'Insert a new Ruleheader', trace.value)
            const { error, addNewRuleheader } = addRuleheader(projectID.value, ruleheaderName, '', position, 1, userName.value, today)
            return await addNewRuleheader(ruleheader, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Ruleheader.vue/doInsert', 2, 'Ruleheader insert status: ' + ruleheader.value.success, trace.value)
                    if (ruleheader.value.success) {
                        consoleLog('Ruleheader.vue/doInsert', 2, ruleheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Ruleheader.vue/doInsert', 2, 'Error during the insert of a ruleheader', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to copy a ruleheader 
        // --------------------------------------------------------------------------
        const doCopy = async (ruleheaderID, position) => {
            let ruleheader = []
            consoleLog('Ruleheader.vue/doCopy', 2, 'Copy an existing Ruleheader - ruleheaderID: ' + ruleheaderID + ' at position: ' + position, trace.value)
            const { error1, copyTheRuleheader } = copyRuleheader(ruleheaderID, position, userName.value, today)
            await copyTheRuleheader(ruleheader, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Ruleheader.vue/doCopy', 2, 'Ruleheader copy status: ' + ruleheader.value.success, trace.value)
                    if (ruleheader.value.success) {
                        consoleLog('Ruleheader.vue/doCopy', 2, ruleheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Ruleheader.vue/doCopy', 2, 'Error during the copy of a ruleheader', trace.value)
                        return (0)
                    }
                })

            // Get the ID of the new copied datasetheader
            let Id = ruleheader.value.id
            let rules = []

            // Copy all the linked rules
            consoleLog('Ruleheader.vue/doCopy', 2, 'Copy all linked rules - ruleheaderID: ' + ruleheaderID, trace.value)
            const { error2, copyTheRule } = copyAllRules(Id, ruleheaderID)
            return await copyTheRule(rules, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Ruleheader.vue/doCopy', 2, 'Full Rules copy status: ' + rules.value.success, trace.value)
                    if (rules.value.success) {
                        consoleLog('Ruleheader.vue/doCopy', 2, rules, trace.value)
                        return (1)
                    } else {
                        consoleLog('Ruleheader.vue/doCopy', 2, 'Error during the copy of the full rules', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a ruleheader 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (ruleheaderID, position) => {

            let ruleheader = []
            consoleLog('Ruleheader.vue/doUpdatePosition', 2, 'Change the position of a Ruleheader - ruleheaderID: ' + ruleheaderID + ', position: ' + position, trace.value)
            const { error, updateThePosition } = updatePositionRuleheader(ruleheaderID, position)
            return await updateThePosition(ruleheader, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('Ruleheader.vue/doUpdatePosition', 2, 'Ruleheader status: ' + ruleheader.value.success, trace.value)
                    if (ruleheader.value.success) {
                        consoleLog('Ruleheader.vue/doUpdatePosition', 2, ruleheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Ruleheader.vue/doUpdatePosition', 2, 'Error during the update of the ruleheader position', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete a ruleheader 
        // --------------------------------------------------------------------------
        const doDelete = async (ruleheaderID) => {
            let ruleheader = []
            consoleLog('Ruleheader.vue/doDelete', 2, 'Delete an existing Ruleheader ' + ruleheaderID, trace.value)
            const { error, deleteTheRuleheader } = deleteRuleheader(ruleheaderID)
            await deleteTheRuleheader(ruleheader, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Ruleheader.vue/doDelete', 2, 'Ruleheader delete status: ' + ruleheader.value.success, trace.value)
                    if (ruleheader.value.success) {
                        consoleLog('Ruleheader.vue/doDelete', 2, ruleheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Ruleheader.vue/doDelete', 2, 'Error during the delete of a ruleheader', trace.value)
                        return (0)
                    }
                })

            let rules = []
            consoleLog('Ruleheader.vue/doDelete', 2, 'Delete all linked Rules - ruleheaderID: ' + ruleheaderID, trace.value)
            const { error2, deleteTheRule } = deleteAllRules(ruleheaderID)
            return await deleteTheRule(rules, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Ruleheader.vue/doDelete', 2, 'Full Rules delete status: ' + rules.value.success, trace.value)
                    if (rules.value.success) {
                        consoleLog('Ruleheader.vue/doDelete', 2, rules, trace.value)
                        return (1)
                    } else {
                        consoleLog('Ruleheader.vue/doDelete', 2, 'No dataset to delete', trace.value)
                        return (1)
                    }
                })

        }



        // --------------------------------------------------------------------------
        // Ruleheaders received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (ruleheaderID) => {
            consoleLog('Ruleheader.vue/selectRecord', 2, 'Received a request to select a record: ' + ruleheaderID, trace.value)
            if (!recordSelected.value.includes(ruleheaderID)) {
                recordSelected.value.push(ruleheaderID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != ruleheaderID)
            }
            consoleLog('Ruleheader.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('Ruleheader.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // Ruleheaders received a request to add a new Ruleheader
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('Ruleheader.vue/handleInsert', 2, 'Add ' + rowToInsert.value + ' new empty ruleheader(s) after the Ruleheader position: ' + position, trace.value)
            position = position.toString().padStart(6, '0') + 'I'
            let status = 1;
            let err = 1;
            for (let i = 1; i <= rowToInsert.value; i++) {
                //console.log (' ******** 1 ******* Loop: ' + i)
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a ruleheader', 'Alert')
            } else {
                DisplayError('Inserted ' + rowToInsert.value + ' rule set(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            //console.log (' ******** 2 ******* reorder')
            await doReorder()
            // Refresh the list
            //console.log (' ******** 3 ******* refresh')
            await loadRuleheaderData()

        }


        // --------------------------------------------------------------------------
        // Ruleheaders received a request to copy record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('Ruleheader.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' ruleheader(s) after the Ruleheader position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to copy before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                let originalPosition = position
                position = position.toString().padStart(6, '0') + 'C'
                //console.log (' ******** 1 ******* Loop')
                // Copy all the selected ruleheader(s)
                for (let recordID of recordSelected.value) {
                    position = originalPosition.toString().padStart(6, '0') + 'C'
                    position = position + counter
                    counter = counter + 1
                    if (await doCopy(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the copy of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected Rule set(s) copy successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadRuleheaderData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Ruleheaders received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('Ruleheader.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' ruleheader(s) after the Ruleheader position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                let originalPosition = position
                position = position.toString().padStart(6, '0') + 'M'
                //console.log (' ******** 1 ******* Loop')
                // Update the position of all the selected ruleheader(s)
                for (let recordID of recordSelected.value) {
                    position = originalPosition.toString().padStart(6, '0') + 'M'
                    position = position + counter
                    counter = counter + 1
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected Rule set(s) reorder successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadRuleheaderData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Ruleheaders received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (ruleheaderID) => {
            consoleLog('Ruleheader.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' ruleheader(s) and the Ruleheader: ' + ruleheaderID, trace.value)
            let status = 1;
            //console.log (' ******** 1 ******* Loop')

            // Add the ruleheaderID if it's not already in the list
            if (!recordSelected.value.includes(ruleheaderID)) {
                recordSelected.value.push(ruleheaderID)
            }

            // Delete the selected ruleheader(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected ruleheader(s)', 'Alert')
            } else {
                DisplayError('Selected Rule set(s) deleted successfully', 'Info')
            }
            //console.log (' ******** 2 ******* refresh')
            // Refresh the list
            await loadRuleheaderData()
            recordSelected.value = []
        }



        return {
            errorMessage, styleMessage, ruleheaders, filteredData, filterValue, filteredRows, workspaceID, workspace,
            superUser, projectID, projectName, subprojectID, subprojectName, userID, displayInfo, trace, rowToInsert,
            handleCancel, refreshRuleheader, handleInsert, handleCopy, handleMove, handleDelete, selectRecord,
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