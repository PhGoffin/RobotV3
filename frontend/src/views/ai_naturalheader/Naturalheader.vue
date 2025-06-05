<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ projectName }}<br>-- Natural Set --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <button @click="handleInsert('0')">
                    <i class="fa-solid fa-circle-plus"></i>
                    Natural Set</button>


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
                        <NaturalheaderList class="naturalheaderList" :naturalheaders="filteredData"
                            :workspaceID="workspaceID" :workspace="workspace" :superUser="superUser"
                            :projectID="projectID" :subprojectID="subprojectID" :userID="userID" :trace="trace"
                            :location="location" @refreshnaturalheaders="refreshNaturalheader"
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
import NaturalheaderList from '../../components/ai_naturalheader/NaturalheaderList.vue'
import getAllNaturalheader from '../../composables/ai_naturalheader/getAllNaturalheader'
import updatePositionNaturalheader from '../../composables/ai_naturalheader/updatePositionNaturalheader'
import reorderNaturalheader from '../../composables/ai_naturalheader/reorderNaturalheader'
import addNaturalheader from '../../composables/ai_naturalheader/addNaturalheader'
import copyNaturalheader from '../../composables/ai_naturalheader/copyNaturalheader'
import copyAllNatural from '../../composables/ai_natural/copyAllNatural'
import deleteNaturalheader from '../../composables/ai_naturalheader/deleteNaturalheader'
import deleteAllNatural from '../../composables/ai_natural/deleteAllNatural'

import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Naturalheader',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'subprojectID', 'subprojectName', 'location'],
    components: { NaturalheaderList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const rowToInsert = ref(1)


        displayMsg('Naturalheader.vue', trace.value)
        consoleLog('Naturalheader.vue - props', 1, props, trace.value)

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
        const naturalheaders = ref([])
        const displayInfo = ref('')
        const location = ref(props.location)
        const filterValue = ref('')
        const testID = ref(0)
        const ruleID = ref(0)


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
            consoleLog('Naturalheader.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        const loadNaturalheaderData = async () => {
            // -------------------------------------------
            // load all the naturalheaders of the project 
            // -------------------------------------------
            consoleLog('Naturalheader.vue/loadNaturalheaderData', 2, 'Loading naturalheader', trace.value)
            const { error, loadNaturalheader } = getAllNaturalheader()
            loadNaturalheader(naturalheaders, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Naturalheader.vue/loadNaturalheaderData', 2, 'Naturalheader Load status: ' + naturalheaders.value.success, trace.value)
                    if (naturalheaders.value.success && naturalheaders.value.data.length) {
                        naturalheaders.value = naturalheaders.value.data
                        filteredData.value = naturalheaders.value
                        consoleLog('Naturalheader.vue/loadNaturalheaderData', 2, naturalheaders.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('Naturalheader.vue/loadNaturalheaderData', 2, 'No naturalheader found!', trace.value)
                        return (0)
                    }
                })
        }


        // Load projects data
        loadNaturalheaderData()


        // ---------------------------------------------
        // Compute the naturalheaders depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('Naturalheader.vue/filteredData', 2, 'computed value', trace.value)
            if (naturalheaders.value.length) {
                return naturalheaders.value.filter((ar) => ar.code.toUpperCase().includes(filterValue.value.toUpperCase())
                    || ar.comment.toUpperCase().includes(filterValue.value.toUpperCase()))
            } else {
                filteredRows.value = ''
                return naturalheaders.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })


        // --------------------------------------------------------------------------
        // NaturalheaderList emits a request to refresh the naturalheaders
        // --------------------------------------------------------------------------
        const refreshNaturalheader = (status, msg) => {
            consoleLog('Naturalheader.vue/refreshNaturalheader', 2, 'received a request to refresh the naturalheaders  from NaturalheaderList / NaturalheaderSingle', trace.value)
            consoleLog('Naturalheader.vue/refreshNaturalheader', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadNaturalheaderData()
        }

        // --------------------------------------------------------------------------
        // NaturalheaderList emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = (location) => {
            consoleLog('Naturalheader.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
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
            consoleLog('Naturalheader.vue/handleCancel', 2, 'User Cancel the action from: ' + location.value, trace.value)
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
        // Call the API to reorder correctly all the positions of the naturalheaders 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let naturalheader = []
            consoleLog('Naturalheader.vue/doReorder', 2, 'Reorder all the positions of the Naturalheaders', trace.value)
            const { error, reorderTheNaturalheader } = reorderNaturalheader()
            return await reorderTheNaturalheader(naturalheader, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Naturalheader.vue/doReorder', 2, 'Natural set reorder status: ' + naturalheader.value.success, trace.value)
                    if (naturalheader.value.success) {
                        consoleLog('Naturalheader.vue/doReorder', 2, naturalheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Naturalheader.vue/doReorder', 2, 'Error during the reorder of the natural set position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert a naturalheader 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let naturalheader = []
            let code = '@New'

            consoleLog('Naturalheader.vue/doInsert', 2, 'Insert a new Naturalheader', trace.value)
            // projectID, code, comment, position, active
            const { error, addNewNaturalheader } = addNaturalheader(code, '', position, 1)
            return await addNewNaturalheader(naturalheader, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Naturalheader.vue/doInsert', 2, 'Natural set insert status: ' + naturalheader.value.success, trace.value)
                    if (naturalheader.value.success) {
                        consoleLog('Naturalheader.vue/doInsert', 2, naturalheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Naturalheader.vue/doInsert', 2, 'Error during the insert of a natural set', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to copy a naturalheader 
        // --------------------------------------------------------------------------
        const doCopy = async (naturalheaderID, position) => {
            let naturalheader = []
            consoleLog('Naturalheader.vue/doCopy', 2, 'Copy an existing Naturalheader - naturalheaderID: ' + naturalheaderID + ' at position: ' + position, trace.value)
            const { error, copyTheNaturalheader } = copyNaturalheader(naturalheaderID, position)
            await copyTheNaturalheader(naturalheader, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Naturalheader.vue/doCopy', 2, 'Natural status copy status: ' + naturalheader.value.success, trace.value)
                    if (naturalheader.value.success) {
                        consoleLog('Naturalheader.vue/doCopy', 2, naturalheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Naturalheader.vue/doCopy', 2, 'Error during the copy of a natural set', trace.value)
                        return (0)
                    }
                })

            // Get the ID of the new copied datasetheader
            let Id = naturalheader.value.id
            let natural = []

            // Copy all the linked natural records
            consoleLog('Naturalheader.vue/doCopy', 2, 'Copy all linked natural records - naturalheaderID: ' + naturalheaderID, trace.value)
            const { error2, copyTheNatural } = copyAllNatural(Id, naturalheaderID)
            return await copyTheNatural(natural, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Naturalheader.vue/doCopy', 2, 'Full Natural copy status: ' + natural.value.success, trace.value)
                    if (natural.value.success) {
                        consoleLog('Naturalheader.vue/doCopy', 2, natural, trace.value)
                        return (1)
                    } else {
                        consoleLog('Naturalheader.vue/doCopy', 2, 'Error during the copy of the full natural records', trace.value)
                        return (0)
                    }
                })

        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a naturalheader 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (naturalheaderID, position) => {

            let naturalheader = []
            consoleLog('Naturalheader.vue/doUpdatePosition', 2, 'Change the position of a Naturalheader - naturalheaderID: ' + naturalheaderID + ', position: ' + position, trace.value)
            const { error, updateThePosition } = updatePositionNaturalheader(naturalheaderID, position)
            return await updateThePosition(naturalheader, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('Naturalheader.vue/doUpdatePosition', 2, 'Natural set status: ' + naturalheader.value.success, trace.value)
                    if (naturalheader.value.success) {
                        consoleLog('Naturalheader.vue/doUpdatePosition', 2, naturalheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Naturalheader.vue/doUpdatePosition', 2, 'Error during the update of the natural set position', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete a naturalheader 
        // --------------------------------------------------------------------------
        const doDelete = async (naturalheaderID) => {
            let naturalheader = []
            consoleLog('Naturalheader.vue/doDelete', 2, 'Delete an existing Naturalheader - projectID: ' + projectID.value + ', naturalheaderID: ' + naturalheaderID, trace.value)
            const { error, deleteTheNaturalheader } = deleteNaturalheader(projectID.value, naturalheaderID)
            await deleteTheNaturalheader(naturalheader, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Naturalheader.vue/doDelete', 2, 'Natural set delete status: ' + naturalheader.value.success, trace.value)
                    if (naturalheader.value.success) {
                        consoleLog('Naturalheader.vue/doDelete', 2, naturalheader, trace.value)
                        return (1)
                    } else {
                        consoleLog('Naturalheader.vue/doDelete', 2, 'Error during the delete of a natural set', trace.value)
                        return (0)
                    }
                })

            let natural = []
            consoleLog('Naturalheader.vue/doDelete', 2, 'Delete all linked Natural records - naturalheaderID: ' + naturalheaderID, trace.value)
            const { error2, deleteTheNatural } = deleteAllNatural(naturalheaderID)
            return await deleteTheNatural(natural, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Naturalheader.vue/doDelete', 2, 'Full Natural delete status: ' + natural.value.success, trace.value)
                    if (natural.value.success) {
                        consoleLog('Naturalheader.vue/doDelete', 2, natural, trace.value)
                        return (1)
                    } else {
                        consoleLog('Naturalheader.vue/doDelete', 2, 'No dataset to delete', trace.value)
                        return (1)
                    }
                })
        }



        // --------------------------------------------------------------------------
        // Naturalheaders received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (naturalheaderID) => {
            consoleLog('Naturalheader.vue/selectRecord', 2, 'Received a request to select a record: ' + naturalheaderID, trace.value)
            if (!recordSelected.value.includes(naturalheaderID)) {
                recordSelected.value.push(naturalheaderID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != naturalheaderID)
            }
            consoleLog('Naturalheader.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('Naturalheader.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // Naturalheaders received a request to add a new Naturalheader
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('Naturalheader.vue/handleInsert', 2, 'Add ' + rowToInsert.value + ' new empty naturalheader(s) after the Naturalheader position: ' + position, trace.value)
            position = position.toString().padStart(6, '0') + 'I'
            let status = 1;
            let err = 1;
            for (let i = 1; i <= rowToInsert.value; i++) {
                //console.log (' ******** 1 ******* Loop: ' + i)
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a natural set', 'Alert')
            } else {
                DisplayError('Inserted ' + rowToInsert.value + ' natural set(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            //console.log (' ******** 2 ******* reorder')
            await doReorder()
            // Refresh the list
            //console.log (' ******** 3 ******* refresh')
            await loadNaturalheaderData()

        }


        // --------------------------------------------------------------------------
        // Naturalheaders received a request to copy record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('Naturalheader.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' naturalheader(s) after the Naturalheader position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to copy before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.toString().padStart(6, '0') + 'C'
                //console.log (' ******** 1 ******* Loop')
                // Copy all the selected naturalheader(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doCopy(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the copy of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected natural set(s) copy successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadNaturalheaderData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Naturalheaders received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('Naturalheader.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' naturalheader(s) after the Naturalheader position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.toString().padStart(6, '0') + 'M'
                //console.log (' ******** 1 ******* Loop')
                // Update the position of all the selected naturalheader(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected natural set(s) reorder successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadNaturalheaderData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Naturalheaders received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (naturalheaderID) => {
            consoleLog('Naturalheader.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' naturalheader(s) and the Naturalheader: ' + naturalheaderID, trace.value)
            let status = 1;
            //console.log (' ******** 1 ******* Loop')

            // Add the naturalheaderID if it's not already in the list
            if (!recordSelected.value.includes(naturalheaderID)) {
                recordSelected.value.push(naturalheaderID)
            }

            // Delete the selected naturalheader(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected natural set(s)', 'Alert')
            } else {
                DisplayError('Selected natural set(s) deleted successfully', 'Info')
            }
            //console.log (' ******** 2 ******* refresh')
            // Refresh the list
            await loadNaturalheaderData()
            recordSelected.value = []
        }



        return {
            errorMessage, styleMessage, naturalheaders, filteredData, filterValue, filteredRows, workspaceID, workspace,
            superUser, projectID, projectName, subprojectID, subprojectName, userID, displayInfo, trace, rowToInsert,
            handleCancel, refreshNaturalheader, handleInsert, handleCopy, handleMove, handleDelete, selectRecord,
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