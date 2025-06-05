<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ projectName }}<br>-- Dictionary --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <button @click="handleInsert('0')" v-if="actionAllowed">
                    <i class="fa-solid fa-circle-plus"></i>
                    Dictionary</button>


                <form @submit.prevent="">

                    <table>
                        <tbody>
                            <tr>
                                <td class="menu">
                                    <div class="input-container focus" style="max-width: 10rem" v-if="actionAllowed">
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
                        <DictionaryList class="dictionariesList" :dictionaries="filteredData" :workspaceID="workspaceID"
                            :workspace="workspace" :superUser="superUser" :projectID="projectID"
                            :subprojectID="subprojectID" :userID="userID" :trace="trace" :location="location"
                            @refreshdictionaries="refreshDictionaries" @selectrecord="selectRecord"
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
import DictionaryList from '../../components/dictionary/DictionaryList.vue'
import getDictionaryByProject from '../../composables/dictionary/getDictionaryByProject'
import unusedDictionary from '../../composables/dictionary/unusedDictionary'
import getDictionaryByHeader from '../../composables/dictionary/getDictionaryByHeader'
import updatePositionDictionary from '../../composables/dictionary/updatePositionDictionary'
import reorderDictionary from '../../composables/dictionary/reorderDictionary'
import addDictionary from '../../composables/dictionary/addDictionary'
import copyDictionary from '../../composables/dictionary/copyDictionary'
import deleteDictionary from '../../composables/dictionary/deleteDictionary'

import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Dictionary',
    props: ['id', 'trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'subprojectID', 'subprojectName', 'location'],
    components: { DictionaryList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const recordTarget = ref(0)
        const rowToInsert = ref(1)
        const actionAllowed = ref(true)

        const userName = ref(props.currentuser)
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
        const year = currentDate.getFullYear();
        let today = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year


        displayMsg('Dictionary.vue', trace.value)
        consoleLog('Dictionary.vue - props', 1, props, trace.value)

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
        const dictionaries = ref([])
        const dictionaryheaderID = ref(props.id)
        const displayInfo = ref('')
        const location = ref(props.location)
        const filterValue = ref('')
        const loadByProject = ref(false)

        // -----------------------------------------------------------------------
        // Check if we come from the test vue
        //              0      1            2                 3                     4            5              6
        // Syntax is: test=<testID>=<datasetheaderID>=<parameter 1, 2 or 3>=<filter data1>=<filter data2>=<filter data3>
        // -----------------------------------------------------------------------
        if (location.value.includes('test=') || location.value.includes('rulewizard=')) {
            // split the location to find the keyword
            let data = location.value.split("=");
            if (data[3] != undefined) {
                let i = data[3] * 1
                filterValue.value = data[3 + i]
                if (filterValue.value == undefined) filterValue.value = ""
            }
            if (data[2] == '0') {
                actionAllowed.value = false
                loadByProject.value = true
            } else {
                actionAllowed.value = true
                loadByProject.value = false
            }

        } else {
            loadByProject.value = false
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
            consoleLog('Dictionary.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        const loadDictionaryData = async () => {

            if (dictionaryheaderID.value < 0) {
                // ----------------------------------------------------
                // load all the unused dictionary words of the project 
                // ----------------------------------------------------
                consoleLog('Dictionary.vue/loadDictionaryData', 2, 'Loading unused dictionary by project', trace.value)
                const { error, loadDictionary } = unusedDictionary(projectID.value)
                loadDictionary(dictionaries, trace.value)
                    .then(function () {
                        // check the status of the load
                        consoleLog('Dictionary.vue/loadDictionaryData', 2, 'Unused Dictionary Load by project status: ' + dictionaries.value.success, trace.value)
                        if (dictionaries.value.success && dictionaries.value.data.length) {
                            dictionaries.value = dictionaries.value.data
                            filteredData.value = dictionaries.value
                            consoleLog('Dictionary.vue/loadDictionaryData', 2, dictionaries.value, trace.value)
                            return (1)
                        } else {
                            consoleLog('Dictionary.vue/loadDictionaryData', 2, 'No dictionary found!', trace.value)
                            return (0)
                        }
                    })

            } else if (loadByProject.value) {

                // -------------------------------------------
                // load all the dictionaries of the project 
                // -------------------------------------------
                consoleLog('Dictionary.vue/loadDictionaryData', 2, 'Loading dictionary by project', trace.value)
                const { error, loadDictionary } = getDictionaryByProject(projectID.value)
                loadDictionary(dictionaries, trace.value)
                    .then(function () {
                        // check the status of the load
                        consoleLog('Dictionary.vue/loadDictionaryData', 2, 'Dictionary Load by project status: ' + dictionaries.value.success, trace.value)
                        if (dictionaries.value.success && dictionaries.value.data.length) {
                            dictionaries.value = dictionaries.value.data
                            filteredData.value = dictionaries.value
                            consoleLog('Dictionary.vue/loadDictionaryData', 2, dictionaries.value, trace.value)
                            return (1)
                        } else {
                            consoleLog('Dictionary.vue/loadDictionaryData', 2, 'No dictionary found!', trace.value)
                            return (0)
                        }
                    })
            } else {
                // ---------------------------------------------------
                // load all the dictionaries of the dictionaryheader 
                // ---------------------------------------------------
                consoleLog('Dictionary.vue/loadDictionaryData', 2, 'Loading dictionary by header', trace.value)
                const { error, loadDictionary } = getDictionaryByHeader(dictionaryheaderID.value)
                loadDictionary(dictionaries, trace.value)
                    .then(function () {
                        // check the status of the load
                        consoleLog('Dictionary.vue/loadDictionaryData', 2, 'Dictionary Load by header status: ' + dictionaries.value.success, trace.value)
                        if (dictionaries.value.success && dictionaries.value.data.length) {
                            dictionaries.value = dictionaries.value.data
                            filteredData.value = dictionaries.value
                            consoleLog('Dictionary.vue/loadDictionaryData', 2, dictionaries.value, trace.value)
                            return (1)
                        } else {
                            consoleLog('Dictionary.vue/loadDictionaryData', 2, 'No dictionary found!', trace.value)
                            return (0)
                        }
                    })
            }

        }


        // Load projects data
        loadDictionaryData()


        // ---------------------------------------------
        // Compute the dictionaries depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('Dictionary.vue/filteredData', 2, 'computed value', trace.value)
            if (dictionaries.value.length) {
                return dictionaries.value.filter((ar) => ar.fullcode.toUpperCase().includes(filterValue.value.toUpperCase())
                    || ar.label.toUpperCase().includes(filterValue.value.toUpperCase()) || ar.comment.toUpperCase().includes(filterValue.value.toUpperCase()))
            } else {
                filteredRows.value = ''
                return dictionaries.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })


        // --------------------------------------------------------------------------
        // DictionaryList emits a request to refresh the dictionaries
        // --------------------------------------------------------------------------
        const refreshDictionaries = (status, msg) => {
            consoleLog('Dictionary.vue/refreshDictionaries', 2, 'received a request to refresh the dictionaries  from DictionaryList / DictionarySingle', trace.value)
            consoleLog('Dictionary.vue/refreshDictionaries', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadDictionaryData()
        }

        // --------------------------------------------------------------------------
        // DictionaryList emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = (location) => {
            consoleLog('Dictionary.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
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
            consoleLog('Dictionary.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            // if (location.value.includes('test=')) {
            //     router.go(-1)
            // } else {
            //     router.push({ name: 'ControlPanel' })
            // }
            router.push({ name: 'Dictionary Set' })
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
        // Call the API to reorder correctly all the positions of the dictionaries 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let dictionary = []
            consoleLog('Dictionary.vue/doReorder', 2, 'Reorder all the positions of the Dictionaries', trace.value)
            const { error, reorderTheDictionary } = reorderDictionary(dictionaryheaderID.value)
            return await reorderTheDictionary(dictionary, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Dictionary.vue/doReorder', 2, 'Dictionary reorder status: ' + dictionary.value.success, trace.value)
                    if (dictionary.value.success) {
                        consoleLog('Dictionary.vue/doReorder', 2, dictionary, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dictionary.vue/doReorder', 2, 'Error during the reorder of the dictionaries position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert a dictionary 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let dictionary = []
            const now = new Date();
            const currentDateTime = now.toLocaleString();
            let code = '_New'
            let label = 'New' // + currentDateTime

            consoleLog('Dictionary.vue/doInsert', 2, 'Insert a new Dictionary', trace.value)
            const { error, addNewDictionary } = addDictionary(projectID.value, dictionaryheaderID.value, code, label, '', '*', position, 1, userName.value, today)
            return await addNewDictionary(dictionary, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Dictionary.vue/doInsert', 2, 'Dictionary insert status: ' + dictionary.value.success, trace.value)
                    if (dictionary.value.success) {
                        consoleLog('Dictionary.vue/doInsert', 2, dictionary, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dictionary.vue/doInsert', 2, 'Error during the insert of a dictionary', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to copy a dictionary 
        // --------------------------------------------------------------------------
        const doCopy = async (dictionaryID, position) => {
            let dictionary = []
            consoleLog('Dictionary.vue/doCopy', 2, 'Copy an existing Dictionary - dictionaryID: ' + dictionaryID + ' at position: ' + position, trace.value)
            const { error, copyTheDictionary } = copyDictionary(dictionaryID, position, userName.value, today)
            return await copyTheDictionary(dictionary, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Dictionary.vue/doCopy', 2, 'Dictionary copy status: ' + dictionary.value.success, trace.value)
                    if (dictionary.value.success) {
                        consoleLog('Dictionary.vue/doCopy', 2, dictionary, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dictionary.vue/doCopy', 2, 'Error during the copy of a dictionary', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a dictionary 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (dictionaryID, position) => {

            let dictionary = []
            consoleLog('Dictionary.vue/doUpdatePosition', 2, 'Change the position of a Dictionary - dictionaryID: ' + dictionaryID + ', position: ' + position, trace.value)
            const { error, updateThePosition } = updatePositionDictionary(dictionaryID, position)
            return await updateThePosition(dictionary, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('Dictionary.vue/doUpdatePosition', 2, 'Dictionary status: ' + dictionary.value.success, trace.value)
                    if (dictionary.value.success) {
                        consoleLog('Dictionary.vue/doUpdatePosition', 2, dictionary, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dictionary.vue/doUpdatePosition', 2, 'Error during the update of the dictionary position', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete a dictionary 
        // --------------------------------------------------------------------------
        const doDelete = async (dictionaryID) => {
            let dictionary = []
            consoleLog('Dictionary.vue/doDelete', 2, 'Delete an existing Dictionary - projectID: ' + projectID.value + ', dictionaryID: ' + dictionaryID, trace.value)
            const { error, deleteTheDictionary } = deleteDictionary(dictionaryheaderID.value, dictionaryID)
            return await deleteTheDictionary(dictionary, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Dictionary.vue/doDelete', 2, 'Dictionary delete status: ' + dictionary.value.success, trace.value)
                    if (dictionary.value.success) {
                        consoleLog('Dictionary.vue/doDelete', 2, dictionary, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dictionary.vue/doDelete', 2, 'Error during the delete of a dictionary', trace.value)
                        return (0)
                    }
                })
        }



        // --------------------------------------------------------------------------
        // Dictionarys received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (dictionaryID) => {
            consoleLog('Dictionary.vue/selectRecord', 2, 'Received a request to select a record: ' + dictionaryID, trace.value)
            if (!recordSelected.value.includes(dictionaryID)) {
                recordSelected.value.push(dictionaryID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != dictionaryID)
            }
            consoleLog('Dictionary.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('Dictionary.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // Dictionarys received a request to add a new Dictionary
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('Dictionary.vue/handleInsert', 2, 'Add ' + rowToInsert.value + ' new empty dictionary(s) after the Dictionary position: ' + position, trace.value)
            position = position.toString().padStart(6, '0') + 'I'
            let status = 1;
            let err = 1;
            for (let i = 1; i <= rowToInsert.value; i++) {
                //console.log (' ******** 1 ******* Loop: ' + i)
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a dictionary', 'Alert')
            } else {
                DisplayError('Inserted ' + rowToInsert.value + ' dictionary(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            //console.log (' ******** 2 ******* reorder')
            await doReorder()
            // Refresh the list
            //console.log (' ******** 3 ******* refresh')
            await loadDictionaryData()

        }


        // --------------------------------------------------------------------------
        // Dictionarys received a request to copy record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('Dictionary.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' dictionary(s) after the Dictionary position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to copy before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.toString().padStart(6, '0') + 'C'
                //console.log (' ******** 1 ******* Loop')
                // Copy all the selected dictionary(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doCopy(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the copy of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected dictionary(s) copy successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadDictionaryData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Dictionarys received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('Dictionary.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' dictionary(s) after the Dictionary position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.toString().padStart(6, '0') + 'M'
                //console.log (' ******** 1 ******* Loop')
                // Update the position of all the selected dictionary(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected dictionary(s) reorder successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadDictionaryData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Dictionarys received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (dictionaryID) => {
            consoleLog('Dictionary.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' dictionary(s) and the Dictionary: ' + dictionaryID, trace.value)
            let status = 1;
            //console.log (' ******** 1 ******* Loop')

            // Add the dictionaryID if it's not already in the list
            if (!recordSelected.value.includes(dictionaryID)) {
                recordSelected.value.push(dictionaryID)
            }

            // Delete the selected dictionary(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected dictionary(s)', 'Alert')
            } else {
                DisplayError('Selected dictionary(s) deleted successfully', 'Info')
            }
            //console.log (' ******** 2 ******* refresh')
            // Refresh the list
            await loadDictionaryData()
            recordSelected.value = []
        }



        return {
            errorMessage, styleMessage, dictionaries, filteredData, filterValue, filteredRows, workspaceID, workspace,
            superUser, projectID, projectName, subprojectID, subprojectName, userID, displayInfo, trace, rowToInsert,
            handleCancel, refreshDictionaries, handleInsert, handleCopy, handleMove, handleDelete, selectRecord, actionAllowed,
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
    /* grid-template-columns: repeat(2, 1fr); */
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