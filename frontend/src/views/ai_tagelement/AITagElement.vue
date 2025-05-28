<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">Element</h3>
                <img src="../../assets/AIRobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <form @submit.prevent="">

                    <table>
                        <tr>
                            <td class="menu">
                            </td>
                            <td class="menu">
                                <div class="actions3">
                                    <div class="input-container focus" style="min-width: 30rem; max-width: 30rem">
                                        <input type="text" name="dataFilter" class="input" @focus="handleFocus($event)"
                                            title="You can filter by the Path" @blur="handleBlur($event)"
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
                    <div class="layout"  v-if="refresh">
                        <AITagElementList  class="AITagElementList" :aitagelements="filteredData"
                            :workspaceID="workspaceID" :workspace="workspace" :superUser="superUser"
                            :projectID="projectID" :userID="userID" :trace="trace"
                            @refreshtagelement="refreshTagElement" @selectrecord="selectRecord"
                            @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove"
                            @handledelete="handleDelete" @handlegeneric="handleGeneric"
                            @storelocation="storeLocation" />
                    </div>
                </div>
                <div class="input-group">
                    <button @click="handleCancel" class="cancel">
                        <i class="fa-solid fa-ban"></i>
                        Ok</button>
                </div>

            </div>
        </div>


    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AITagElementList from '../../components/ai_tagelement/AITagElementList.vue'
import getAI_TagElementByTraining from '../../composables/ai_tagelement/getAI_TagElementByTraining'
import deleteAI_TagElement from '../../composables/ai_tagelement/deleteAI_TagElement'
import deleteByTagElement from '../../composables/ai_tagattribute/deleteByTagElement'
import updateActiveAI_Training from '../../composables/ai_training/updateActiveAI_Training'


import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Tag Element',
    props: ['trace', 'id', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'location'],
    components: { AITagElementList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const recordTarget = ref(0)
        const refresh = ref(0)

        displayMsg('AI_TagElement.vue', trace.value)
        consoleLog('AI_TagElement.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }


        const trainingID = ref(props.id)
        const workspaceID = ref(props.workspaceID)
        const workspace = ref(props.workspace)
        const projectID = ref(props.projectID)
        const projectName = ref(props.projectName)
        const userID = ref(props.userID)
        const superUser = ref(props.superUser)
        const aitagelements = ref([])
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
            consoleLog('AI_TagElement.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        const loadTagElementData = async () => {
            // -------------------------------------------
            // load all the AI Tag Elements  
            // -------------------------------------------
            consoleLog('AI_TagElement.vue/loadTagElementData', 2, 'Loading Tag Elements', trace.value)
            const { error, getTheAI_TagElement } = getAI_TagElementByTraining(projectID.value, trainingID.value)
            await getTheAI_TagElement(aitagelements, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('AI_TagElement.vue/loadTagElementData', 2, 'Tag Element Load status: ' + aitagelements.value.success, trace.value)
                    if (aitagelements.value.success && aitagelements.value.data.length) {
                        aitagelements.value = aitagelements.value.data
                        filteredData.value = aitagelements.value
                        consoleLog('AI_TagElement.vue/loadTagElementData', 2, aitagelements.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('AI_TagElement.vue/loadTagElementData', 2, 'No Tag Element found!', trace.value)
                        return (0)
                    }
                })
            refresh.value = 1
        }


        // Load attribute data
        loadTagElementData()


        // ---------------------------------------------
        // Compute the functions depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('AI_TagElement.vue/filteredData', 2, 'computed value', trace.value)
            if (aitagelements.value.length) {
                console.log ('Refresh', refresh.value)
                // 28/05 - the following line crashes the refresh !!! no idea why
                //refresh.value = !refresh.value
                return aitagelements.value.filter((ar) => ('#' + ar.tagelementID).includes(filterValue.value) ||
                    ar.fullPath.toUpperCase().includes(filterValue.value.toUpperCase()))
            } else {
                filteredRows.value = ''
                return aitagelements.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })

        // --------------------------------------------------------------------------
        // AITagElementList emits a request to refresh the functions
        // --------------------------------------------------------------------------
        const refreshTagElement = (status, msg) => {
            consoleLog('AI_TagElement.vue/refreshTagElement', 2, 'received a request to refresh the Tag Element  from AITagElementList / AITagElementSingle', trace.value)
            consoleLog('AI_TagElement.vue/refreshTagElement', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadTagElementData()
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
            consoleLog('AI_TagElement.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'AITraining' })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete all the Attributes of a Tag Element
        // --------------------------------------------------------------------------
        const doDeleteByTagElement = async (tagelementID) => {
            let aitagattribute = []
            consoleLog('AI_TagElement.vue/doDeleteByTagElement', 2, 'Delete all Tag Attributes for tagelementID: ' + tagelementID, trace.value)
            const { error, deleteTheAI_TagAttribute } = deleteByTagElement(projectID.value, tagelementID)
            return await deleteTheAI_TagAttribute(aitagattribute, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('AI_TagElement.vue/doDeleteByTagElement', 2, 'Tag Attribute delete status: ' + aitagattribute.value.success, trace.value)
                    if (aitagattribute.value.success) {
                        consoleLog('AI_TagElement.vue/doDeleteByTagElement', 2, aitagattribute, trace.value)
                        return (1)
                    } else {
                        consoleLog('AI_TagElement.vue/doDeleteByTagElement', 2, 'Error during the delete of the Tag Attributes', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to delete a Tag element 
        // --------------------------------------------------------------------------
        const doDelete = async (tagelementID) => {
            let aitagelement = []
            consoleLog('AI_TagElement.vue/doDelete', 2, 'Delete an existing Tag Element - tagelementID: ' + tagelementID, trace.value)

            // Delete the attributes of the tag element
            let ret = await doDeleteByTagElement(tagelementID)
            if (!ret) {
                consoleLog('AI_TagElement.vue/doDelete', 2, 'Error during the delete of the Tag Attributes', trace.value)
            }
            const { error, deleteTheAI_TagElement } = deleteAI_TagElement(tagelementID)
            return await deleteTheAI_TagElement(aitagelement, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('AI_TagElement.vue/doDelete', 2, 'Tag Element delete status: ' + aitagelement.value.success, trace.value)
                    if (aitagelement.value.success) {
                        consoleLog('AI_TagElement.vue/doDelete', 2, aitagelement, trace.value)
                        return (1)
                    } else {
                        consoleLog('AI_TagElement.vue/doDelete', 2, 'Error during the delete of a Tag Element', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to update the acive code of AI_Training 
        // --------------------------------------------------------------------------
        const doActiveTraining = async () => {
            let aittraining = []
            consoleLog('AI_TagElement.vue/doActiveTraining', 2, 'Activate the training: ' + trainingID.value, trace.value)

            // Update the active attributes of the straining
            const { error, updateTheAI_Training } = updateActiveAI_Training(trainingID.value, 1)
            return await updateTheAI_Training(aittraining, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('AI_TagElement.vue/doActiveTraining', 2, 'Training status: ' + aittraining.value.success, trace.value)
                    if (aittraining.value.success) {
                        consoleLog('AI_TagElement.vue/doActiveTraining', 2, aittraining, trace.value)
                        return (1)
                    } else {
                        consoleLog('AI_TagElement.vue/doActiveTraining', 2, 'Error during the update of the active Training!', trace.value)
                        return (0)
                    }
                })
        }



        // --------------------------------------------------------------------------
        // aitagelement received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (tagelementID) => {
            consoleLog('AI_TagElement.vue/selectRecord', 2, 'Received a request to select a record: ' + tagelementID, trace.value)
            if (!recordSelected.value.includes(tagelementID)) {
                recordSelected.value.push(tagelementID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != tagelementID)
            }
            consoleLog('AI_TagElement.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('AI_TagElement.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // aitagelement received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (tagelementID) => {
            consoleLog('AI_TagElement.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' Tag Attribute(s) and the Tag Attribute: ' + tagelementID, trace.value)
            let status = 1;

            // Add the tagelementID if it's not already in the list
            if (!recordSelected.value.includes(tagelementID)) {
                recordSelected.value.push(tagelementID)
            }
            // Delete the selected Tag Attribute(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected Tag Attribute(s)', 'Alert')
            } else {
                DisplayError('Selected Tag Attribute(s) deleted successfully', 'Info')
            }
            // Refresh the list
            await loadTagElementData()
            recordSelected.value = []
        }


        // --------------------------------------------------------------------------
        // aitagelement received a request to select the record as a generic element
        // --------------------------------------------------------------------------
        const handleGeneric = async (tagelementID) => {
            consoleLog('AI_TagElement.vue/handleGeneric', 2, 'Process Generic ' + tagelementID, trace.value)
            // Filter the tagElement to keep the selected record
            const myArray = ref([])
            myArray.value = aitagelements.value.filter((ar) => !('#' + ar.tagelementID).includes('#' + tagelementID))
            console.log('Array: ', myArray.value)
            // Delete the unused tag elements
            for (let elt = 0; elt < myArray.value.length; elt++) {
                // Delete all the attributes of the tag elements + the Tag element
                await doDelete(myArray.value[elt].tagelementID)
            }
            await loadTagElementData()
            let ret = await doActiveTraining()
            if (ret == 0) {
                DisplayError('Error during the selection of the generic element', 'Alert')
            } else {
                DisplayError('Generic element is selected successfully', 'Info')
                router.push({ name: 'AIDashboard' })
            }

        }


        // --------------------------------------------------------------------------
        // AITagElementList emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = (location) => {
            consoleLog('AI_TagElement.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
            context.emit('storelocation', location)
        }


        return {
            errorMessage, styleMessage, aitagelements, workspaceID, workspace, filteredData, filterValue, filteredRows,
            superUser, projectID, projectName, userID, displayInfo, trace, refresh,
            handleCancel, refreshTagElement, handleDelete, handleGeneric, selectRecord,
            handleFocus, handleBlur, storeLocation
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
    padding: 2.3rem 2.2rem;
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