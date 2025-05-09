<template>

    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">
        <div class="form">

            <div class="banner">
                <h3 class="title">{{ projectName }}<br>{{ subprojectName }}<br>-- Export Dataset --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <div v-if="showPopup">
                    <PopupConfirm @close="handleCancelExport" @confirm="handleConfirmExport" />
                </div>

                <form @submit.prevent="handleConfirmation">

                    <fieldset>
                        <legend>
                            <h3>&nbsp;What to do in case data already exists?&nbsp;</h3>
                        </legend>
                        <div>

                            <label v-for="user in Users" :key="user.name">
                            </label>


                            <div class="radio">
                                <input type="radio" id="ignore" name="option" value="ignore"
                                    @change="handleSelectOption(0)" checked />
                                <label for="ignore" class="radiolabel">Ignore the data</label>
                            </div>

                            <div class="radio">
                                <input type="radio" id="replace" name="option" value="replace"
                                    @change="handleSelectOption(1)" />
                                <label for="replace" class="radiolabel">Replace the value</label>
                            </div>

                        </div>
                    </fieldset>

                    <div class="input-container focus">
                        <input type="text" name="datasetheaderorigin" class="input disabled" title="Original Data set"
                            v-model="headerCodeOrigin" disabled />
                        <label>Original Data set</label>
                        <span>Original Data set</span>
                    </div>


                    <div class="input-container focus">
                        <select id="datasetheader" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            @change="handleDatasetheaderChange" title="Select a dataset"
                            v-model="selectedDatasetheader">
                            <option v-for="data in datasetheader" :key="data.datasetheaderID"
                                v-bind:value="{ id: data.datasetheaderID, label: data.code }">
                                {{ data.code }}</option>
                        </select>
                        <label>Data set</label>
                        <span>Data set</span>
                    </div>


                    <div class="input-container">
                        <button>
                            <i class="fa-solid fa-upload"></i>
                            Export</button>
                        <button @click="handleCancel" class="cancel">
                            <i class="fa-solid fa-ban"></i>
                            Cancel</button>
                    </div>

                </form>

            </div>
        </div>


    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Spinner from '../../components/Spinner.vue'
import PopupConfirm from '../../components/PopupConfirm.vue'
import getDatasetheadersBySubproject from '../../composables/datasetheader/getDatasetheadersBySubproject'
import getDataset from '../../composables/dataset/getDataset'
import getDatasetByCode from '../../composables/dataset/getDatasetByCode'
import addDataset from '../../composables/dataset/addDataset'
import updateDataset from '../../composables/dataset/updateDataset'
import reorderDatasets from '../../composables/dataset/reorderDatasets'



import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'DatasetExport',
    props: ['trace', 'id', 'projectID', 'projectName', 'subprojectID', 'subprojectName', 'userID', 'currentuser', 'connected', 'location'],
    components: { Spinner, PopupConfirm },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const showPopup = ref(false)

        displayMsg('DatasetExport.vue', trace.value)
        consoleLog('DatasetExport.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }

        const projectName = ref(props.projectName)
        const projectID = ref(props.projectID)
        const subprojectName = ref(props.subprojectName)
        const subprojectID = ref(props.subprojectID)
        const userID = ref(props.userID)
        const location = ref(props.location)

        const datasetheader = ref([])
        const datasetheaderID = ref(0)
        const datasetheaderIDOrigin = ref(0)
        const headerCodeOrigin = ref('')
        const headerCodeDestination = ref('')
        const selectedDatasetheader = ref({ id: datasetheaderID.value, label: headerCodeDestination.value })

        const selectedRadio = ref(0)
        const dataArray = ref([])
        const dataset = ref([])
        const datasetID = ref(0)


        const userName = ref(props.currentuser)
        const createdBy = ref('')
        const updatedBy = ref('')
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
            consoleLog('DatasetExport.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        // extract info from the location:
        // syntax is <dataheader origin>,<data id1>,<data id2>...
        dataArray.value = location.value.split(",");
        datasetheaderIDOrigin.value = dataArray.value[0]
        headerCodeOrigin.value = dataArray.value[1]


        // --------------------------------------------------------------------------
        // Get the datasetheader data
        // --------------------------------------------------------------------------
        const { error, loadDatasetheader } = getDatasetheadersBySubproject(subprojectID.value)
        loadDatasetheader(datasetheader, trace.value)
            .then(function () {
                consoleLog('DatasetExport.vue/loadDatasetheader', 2, 'subprojectID: ' + subprojectID.value, trace.value)
                if (datasetheader.value.success && datasetheader.value.data.length) {
                    datasetheader.value = datasetheader.value.data
                    consoleLog('DatasetExport.vue/loadDatasetheader', 2, datasetheader, trace.value)
                    // filter the dataheader to remove the dataheader origin
                    datasetheader.value = datasetheader.value.filter((ar) => ar.datasetheaderID != datasetheaderIDOrigin.value)
                    datasetheaderID.value = datasetheader.value[0].datasetheaderID
                    headerCodeDestination.value = datasetheader.value[0].code
                    selectedDatasetheader.value = ({ id: datasetheaderID, label: headerCodeDestination.value })
                    return (1)
                } else {
                    consoleLog('DatasetExport.vue/loadDatasetheader', 2, 'No dataset found!', trace.value)
                    return (0)
                }
            })


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
        // User selects another data set
        // --------------------------------------------------------------------------
        const handleDatasetheaderChange = () => {
            consoleLog('DatasetExport.vue/handleDatasetheaderChange', 2, 'Ask selects another data set: ' + selectedDatasetheader.value.id + ' - ' + selectedDatasetheader.value.label, trace.value)
            datasetheaderID.value = selectedDatasetheader.value.id
            headerCodeDestination.value = selectedDatasetheader.value.label
        }


        // --------------------------------------------------------------------------
        // User selects an option in the radio button
        // --------------------------------------------------------------------------
        const handleSelectOption = (optionID) => {
            consoleLog('DatasetExport.vue/handleSelectOption', 2, 'User selects the radio option: ' + optionID, trace.value)
            selectedRadio.value = optionID
        }


        // --------------------------------------------------------------------------
        // User ask to export data
        // --------------------------------------------------------------------------
        const handleExport = () => {
            consoleLog('DatasetExport.vue/handleExport', 2, 'Ask to export data', trace.value)
        }

        // --------------------------------------------------------------------------
        // User ask to rename the code
        // --------------------------------------------------------------------------
        const handleConfirmation = () => {
            consoleLog('DatasetExport.vue/handleConfirmation', 2, 'Ask for a confirmation to rename', trace.value)
            showPopup.value = true
        }

        // --------------------------------------------------------------------------
        // User cancel the rename action
        // --------------------------------------------------------------------------
        const handleCancelExport = () => {
            consoleLog('DatasetExport.vue/handleCancelExport', 2, 'Cancel the rename', trace.value)
            showPopup.value = false
        }

        // --------------------------------------------------------------------------
        // User confirm the rename action
        // --------------------------------------------------------------------------
        const handleConfirmExport = () => {
            consoleLog('DatasetExport.vue/handleConfirmExport', 2, 'Confirm the rename', trace.value)
            showPopup.value = false
            handleSubmit()
        }

        // --------------------------------------------------------------------------
        // User cancel the action, leave the screen and returns to the list
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('DatasetExport.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            //router.push({ name: 'Dictionary', params: { id: dictionaryheaderID.value } })
            router.push({ name: 'Dataset' })
        }

        // -----------------------------------------------------------------------------------
        // leave the screen and go to the Dictionary screen (used by the function DisplayError)
        // -----------------------------------------------------------------------------------
        const gotoDictionary = () => {
            //router.push({ name: 'Dictionary', params: { id: dictionaryheaderID.value } })
        }


        // --------------------------------------------------------------------------
        // Load information on a dataset
        // --------------------------------------------------------------------------
        const loadDatasetData = async (datasetID) => {
            //consoleLog('DatasetExport.vue/loadDatasetData', 2, 'load dataset: ' + datasetID, trace.value)
            const { error, loadDataset } = getDataset(datasetID)
            return await loadDataset(dataset, trace.value)
                .then(function () {
                    if (dataset.value.success && dataset.value.data.length) {
                        dataset.value = dataset.value.data
                        //consoleLog('DatasetExport.vue/loadDatasetData', 2, dataset, trace.value)
                        return (1)
                    } else {
                        consoleLog('DatasetExport.vue/loadDatasetData', 2, 'No dataset found!', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Check if the dataset exist in the datasetheader of the destination
        // --------------------------------------------------------------------------
        const checkDatasetExist = async (fullCode) => {
            const dataset2 = ref([])
            consoleLog('DatasetExport.vue/checkDatasetExist', 2, 'load dataset: ' + fullCode, trace.value)
            const { error, loadDataset } = getDatasetByCode(subprojectID.value, fullCode)
            return await loadDataset(dataset2, trace.value)
                .then(function () {
                    if (dataset2.value.success && dataset2.value.data.length) {
                        dataset2.value = dataset2.value.data
                        consoleLog('DatasetExport.vue/checkDatasetExist', 2, dataset2, trace.value)
                        console.log ('@@@@@@@@@@@ datasetID', dataset2.value[0].datasetID)
                        datasetID.value = dataset2.value[0].datasetID
                        return (1)
                    } else {
                        consoleLog('DatasetExport.vue/checkDatasetExist', 2, 'Code not found!', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to reorder correctly all the positions of the datasets 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let dataset2 = ref([])
            consoleLog('DatasetExport.vue/doReorder', 2, 'Reorder all the positions of the Datasets', trace.value)
            const { error, reorderTheDatasets } = reorderDatasets(datasetheaderID.value)
            return await reorderTheDatasets(dataset2, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('DatasetExport.vue/doReorder', 2, 'Dataset reorder status: ' + dataset2.value.success, trace.value)
                    if (dataset2.value.success) {
                        consoleLog('DatasetExport.vue/doReorder', 2, dataset2, trace.value)
                        return (1)
                    } else {
                        consoleLog('DatasetExport.vue/doReorder', 2, 'Error during the reorder of the datasets position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert a dataset 
        // --------------------------------------------------------------------------
        const doInsert = async () => {
            let dataset2 = ref([])

            consoleLog('DatasetExport.vue/doInsert', 2, 'Insert a new Dataset', trace.value)
            const { error, addNewDataset } = addDataset(subprojectID.value, datasetheaderID.value, dataset.value[0].code, dataset.value[0].label, dataset.value[0].comment,
                dataset.value[0].position, dataset.value[0].active, userName.value, today)
            return await addNewDataset(dataset2, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('DatasetExport.vue/doInsert', 2, 'Dataset insert status: ' + dataset2.value.success, trace.value)
                    if (dataset2.value.success) {
                        consoleLog('DatasetExport.vue/doInsert', 2, dataset2, trace.value)
                        return (1)
                    } else {
                        consoleLog('DatasetExport.vue/doInsert', 2, 'Error during the insert of a dataset', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to update a dataset 
        // --------------------------------------------------------------------------
        const doUpdate = async () => {
            let dataset2 = ref([])

            // code, label, comment, active, datasetheaderID, datasetID
            const { error, updateTheDataset } = updateDataset(dataset.value[0].code, dataset.value[0].label, dataset.value[0].comment, dataset.value[0].active, datasetheaderID.value, datasetID.value, userName.value, today)
            return await updateTheDataset(dataset2, trace.value)
                .then(function () {
                    consoleLog('DatasetExport.vue/handleSubmit', 2, '------ Update a dataset - datasetheaderID: ' + datasetheaderID.value + ', datasetID: ' + datasetID.value + ', code: ' + dataset.value[0].code, trace.value)
                    consoleLog('DatasetExport.vue/handleSubmit', 2, dataset2.value, trace.value)
                    consoleLog('DatasetExport.vue/handleSubmit', 2, 'Success: ' + dataset2.value.success, trace.value)
                    if (dataset2.value.success) {
                        consoleLog('DatasetExport.vue/handleSubmit', 2, 'Message OK: ' + dataset2.value.message, trace.value)
                        return (1)
                    } else {
                        // Error during insert found!
                        consoleLog('DatasetExport.vue/handleSubmit', 2, 'Message KO: ' + dataset2.value.message, trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = async () => {
            //consoleLog('DatasetExport.vue/handleSubmit', 2, 'User Submit the action - datasetheaderID: ' + datasetheaderID.value, trace.value)
            for (let elt = 2; elt < dataArray.value.length; elt++) {
                //consoleLog('DatasetExport.vue/handleSubmit', 3, 'Export the data: ' + dataArray.value[elt], trace.value)
                // get all the information on the dataset
                let ret = await loadDatasetData(dataArray.value[elt])
                if (!ret) {
                    DisplayError('Error during the loading of the dataset info of the export!', 'Alert')
                    return 0
                }
                // extract the code of the dataset
                let code = dataset.value[0].code
                consoleLog('DatasetExport.vue/handleSubmit', 3, 'Dataset code: ' + code, trace.value)
                // Check if this code already exist in the dataset destination
                let fullcode = headerCodeDestination.value + code
                ret = await checkDatasetExist(fullcode)
                if (ret) {
                    if (selectedRadio.value) {
                        // Update the value in the dataset of destination
                        consoleLog('DatasetExport.vue/handleSubmit', 3, 'Update the code in the destination dataset', trace.value)
                        ret = await doUpdate()
                        await doReorder()
                        if (!ret) {
                            DisplayError('Error during the update in the export!', 'Alert')
                            return 0
                        }
                    } else {
                        // do nothing
                        consoleLog('DatasetExport.vue/handleSubmit', 3, 'Skip the export, code already in the destination dataset', trace.value)
                    }
                } else {
                    // Create a new entry in the dataset of destination
                    consoleLog('DatasetExport.vue/handleSubmit', 3, 'Create a new code in the destination dataset', trace.value)
                    ret = await doInsert()
                    await doReorder()
                    if (!ret) {
                        DisplayError('Error during the insert in the export!', 'Alert')
                        return 0
                    }
                }
            }
            DisplayError('Data set successfully exported!', 'Info')
        }


        return {
            errorMessage, styleMessage, projectName, projectID, subprojectName, subprojectID, userID, showPopup,
            datasetheader, selectedDatasetheader, headerCodeOrigin,
            handleCancel, handleFocus, handleBlur, handleConfirmation, handleCancelExport, handleConfirmExport, handleExport,
            handleDatasetheaderChange, handleSelectOption
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
    max-width: 1000px;
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

.actions h3 {
    color: blue
}

.frame {
    position: relative;
    margin: 0.5rem 0;
}

.radio {
    display: flex;
    align-items: left;
    justify-content: left;
    padding-left: 2rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
}

.radiolabel {
    display: flex;
    align-items: left;
    justify-content: left;
    padding-left: 1rem;
}
</style>