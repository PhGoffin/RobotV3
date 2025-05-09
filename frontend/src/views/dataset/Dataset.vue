<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ projectName }}<br>{{ subprojectName }}<br>-- Data --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <button @click="handleInsert('0')" v-if="actionAllowed && !backToDataHeaderID">
                    <i class="fa-solid fa-circle-plus"></i>
                    Data</button>

                <button @click="processImport()" title="Import selected test(s)" v-if="backToDataHeaderID">
                    <i class="fa-solid fa-download"></i>
                    Import Selected Row(s)</button>

                <button @click="handleExport()" class="action" v-if="actionAllowed && !backToDataHeaderID">
                    <i class="fa-solid fa-upload"></i>
                    Export</button>


                <button @click="handleExportJSON" class="action" title="Export current dataset into a .json file"
                    v-if="actionAllowed && !backToDataHeaderID">
                    <i class="fa-solid fa-file-code"></i>
                    JSON Export</button>
                <a :href="URL + jsonFile" :key="jsonFile" v-if="viewLink">{{ jsonFile }}</a>

                <button @click="handleImport()" class="action" title="Import a data from your project"
                    v-if="!backToDataHeaderID">
                    <i class="fa-solid fa-download"></i>
                    Import</button>

                <form @submit.prevent="">

                    <table>
                        <tr>
                            <td class="menu">
                                <div class="input-container focus" style="max-width: 10rem"
                                    v-if="actionAllowed && !backToDataHeaderID">
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
                    <h3 class="subtitle" v-if="backToDataHeaderID">Select the data to import</h3>

                </form>


                <div class="entities" height="150px">
                    <div v-if="error"> {{ error }}</div>
                    <div v-if="filteredData.length" class="layout">
                        <DatasetsList class="datasetsList" :datasets="filteredData" :workspaceID="workspaceID"
                            :workspace="workspace" :superUser="superUser" :projectID="projectID"
                            :datasetheaderID="datasetheaderID" :userID="userID" :trace="trace" :location="location"
                            @refreshdatasets="refreshDatasets" @selectrecord="selectRecord" @handleinsert="handleInsert"
                            @handlecopy="handleCopy" @handlemove="handleMove" @handledelete="handleDelete"
                            @storelocation="storeLocation" />
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
import DatasetsList from '../../components/dataset/DatasetsList.vue'
import getDatasetsByHeader from '../../composables/dataset/getDatasetsByHeader'
import getDatasetsBySubproject from '../../composables/dataset/getDatasetsBySubproject'
import updatePositionDataset from '../../composables/dataset/updatePositionDataset'
import reorderDatasets from '../../composables/dataset/reorderDatasets'
import addDataset from '../../composables/dataset/addDataset'
import copyDataset from '../../composables/dataset/copyDataset'
import deleteDataset from '../../composables/dataset/deleteDataset'
import exportDataset from '../../composables/dataset/exportDataset'
import importData from '../../composables/dataset/importDataset'
import consoleAPI from '../../composables/selenium/consoleAPI'


import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Dataset',
    props: ['id', 'trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'subprojectID', 'subprojectName', 'location'],
    components: { DatasetsList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const recordTarget = ref(0)
        const rowToInsert = ref(1)
        const actionAllowed = ref(true)



        displayMsg('Datasets.vue', trace.value)
        consoleLog('Datasets.vue - props', 1, props, trace.value)

        const workspaceID = ref(props.workspaceID)
        const workspace = ref(props.workspace)
        const projectID = ref(props.projectID)
        const projectName = ref(props.projectName)
        const subprojectID = ref(props.subprojectID)
        const subprojectName = ref(props.subprojectName)
        const userID = ref(props.userID)
        const superUser = ref(props.superUser)
        const datasets = ref([])
        const datasetheaderID = ref(props.id)
        const backToDataHeaderID = ref(0)

        const headerCode = ref('')
        const displayInfo = ref('')
        const location = ref(props.location)
        const filterValue = ref('')
        const loadBySubproject = ref(false)

        const userName = ref(props.currentuser)
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
        const year = currentDate.getFullYear();
        let today = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year

        const URL = ref(process.env.VUE_APP_MYSQL_API + 'dataset/download/')
        const jsonFile = ref(userName.value + '_dataset.json')
        const viewLink = ref(false)


        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }

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
                loadBySubproject.value = true
            } else {
                actionAllowed.value = true
                loadBySubproject.value = false
            }

        } else if (location.value.includes('dataimport=')) {
            // split the location to find the keyword
            let data = location.value.split("=");
            backToDataHeaderID.value = data[1]
            loadBySubproject.value = false
        } else {
            loadBySubproject.value = false
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
            consoleLog('Datasets.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }



        // --------------------------------------------------------------------------
        // Display a lessage on the console
        // --------------------------------------------------------------------------
        const displayConsole = async (myTitle, myValue, myLevel, myIdent) => {
            const debug = ref([])

            const { error, consoleMsg } = consoleAPI(myTitle, myValue, myLevel, myIdent)
            await consoleMsg(debug, trace.value)
                .then(function () {
                    consoleLog('Datasets.vue/displayConsole', 2, myTitle + myValue, trace.value)
                })
        }


        // --------------------------------------------------------------------------
        // Load dataset
        // --------------------------------------------------------------------------
        const loadDatasetData = async () => {

            if (loadBySubproject.value) {
                // -------------------------------------------
                // load all the datasets of the subproject 
                // -------------------------------------------
                consoleLog('Datasets.vue/loadDatasetData', 2, 'Loading dataset by subproject: ' + subprojectID.value, trace.value)
                const { error, loadDataset } = getDatasetsBySubproject(subprojectID.value)
                loadDataset(datasets, trace.value)
                    .then(function () {
                        // check the status of the load
                        consoleLog('Datasets.vue/loadDatasetData', 2, 'Dataset Load by subproject status: ' + datasets.value.success, trace.value)
                        if (datasets.value.success && datasets.value.data.length) {
                            datasets.value = datasets.value.data
                            filteredData.value = datasets.value
                            headerCode.value = datasets.value[0].headercode
                            consoleLog('Datasets.vue/loadDatasetData', 2, datasets.value, trace.value)
                            return (1)
                        } else {
                            consoleLog('Datasets.vue/loadDatasetData', 2, 'No dataset found!', trace.value)
                            return (0)
                        }
                    })
            } else {
                // -------------------------------------------
                // load all the datasets of the datasetheader 
                // -------------------------------------------
                consoleLog('Datasets.vue/loadDatasetData', 2, 'Loading dataset by header: ' + datasetheaderID.value, trace.value)
                const { error, loadDataset } = getDatasetsByHeader(datasetheaderID.value)
                loadDataset(datasets, trace.value)
                    .then(function () {
                        // check the status of the load
                        consoleLog('Datasets.vue/loadDatasetData', 2, 'Dataset Load by header status: ' + datasets.value.success, trace.value)
                        if (datasets.value.success && datasets.value.data.length) {
                            datasets.value = datasets.value.data
                            filteredData.value = datasets.value
                            headerCode.value = datasets.value[0].headercode
                            consoleLog('Datasets.vue/loadDatasetData', 2, datasets.value, trace.value)
                            return (1)
                        } else {
                            consoleLog('Datasets.vue/loadDatasetData', 2, 'No dataset found!', trace.value)
                            return (0)
                        }
                    })
            }
        }


        // Load projects data
        loadDatasetData()


        // ---------------------------------------------
        // Compute the datasets depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('Datasets.vue/filteredData', 2, 'computed value', trace.value)
            if (datasets.value.length) {
                return datasets.value.filter((ar) => ar.fullcode.toUpperCase().includes(filterValue.value.toUpperCase())
                    || ar.label.toUpperCase().includes(filterValue.value.toUpperCase()) || ar.comment.toUpperCase().includes(filterValue.value.toUpperCase()))
            } else {
                filteredRows.value = ''
                return datasets.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })


        // --------------------------------------------------------------------------
        // DatasetsList emits a request to refresh the datasets
        // --------------------------------------------------------------------------
        const refreshDatasets = (status, msg) => {
            consoleLog('Datasets.vue/refreshDatasets', 2, 'received a request to refresh the datasets  from DatasetList / DatasetSingle', trace.value)
            consoleLog('Datasets.vue/refreshDatasets', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadDatasetData()
        }

        // --------------------------------------------------------------------------
        // DatasetsList emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = (location) => {
            consoleLog('Datasets.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
            context.emit('storelocation', location)
        }

        // --------------------------------------------------------------------------
        // Call the API to import a data 
        // --------------------------------------------------------------------------
        const doImport = async (position, recordID) => {
            let data = []

            consoleLog('Datasets.vue/doImport', 2, 'Import a Data from ' + backToDataHeaderID.value, trace.value)
            const { error, importTheDataset } = importData(backToDataHeaderID.value, position, recordID, userName.value, today)
            return await importTheDataset(data, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Datasets.vue/doImport', 2, 'Datast import status: ' + data.value.success, trace.value)
                    if (data.value.success) {
                        consoleLog('Datasets.vue/doImport', 2, data, trace.value)
                        return (1)
                    } else {
                        consoleLog('Datasets.vue/doImport', 2, 'Error during the import of a data', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to export the dataset into a json file 
        // --------------------------------------------------------------------------
        const doExportJSON = async () => {
            let dataset = []
            let filename = './data/' + jsonFile.value

            consoleLog('Datasets.vue/doExport', 2, 'Export dataset in ' + filename, trace.value)
            const { error, exportTheDataset } = exportDataset(datasetheaderID.value, filename)
            return await exportTheDataset(dataset, trace.value)
                .then(function () {
                    // check the status of the export
                    consoleLog('Datasets.vue/doExport', 2, 'Dataset export status: ' + dataset.value.success, trace.value)
                    if (dataset.value.success) {
                        consoleLog('Datasets.vue/doExport', 2, dataset, trace.value)
                        return (1)
                    } else {
                        consoleLog('Datasets.vue/doExport', 2, 'Error during the export of the datasets', trace.value)
                        return (0)
                    }
                })
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
        // User ask to export data
        // --------------------------------------------------------------------------
        const handleExport = () => {
            consoleLog('Datasets.vue/handleExport', 2, 'User asks for exporting data', trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to export before...', 'Warning')
            } else {
                location.value = datasetheaderID.value + ',' + headerCode.value
                for (let recordID of recordSelected.value) {
                    location.value = location.value + ',' + recordID
                }
                context.emit('storelocation', location.value)
                router.push({ name: 'DataExport' })
            }
        }

        // --------------------------------------------------------------------------
        // User asks to Export dataset into a json file
        // --------------------------------------------------------------------------
        const handleExportJSON = async (event) => {
            let ret = await doExportJSON()
            if (ret) viewLink.value = true
        }

        // --------------------------------------------------------------------------
        // User asks to go to the Import screen to import
        // --------------------------------------------------------------------------
        const handleImport = () => {
            consoleLog('Datasets.vue/handleImport', 2, 'User asks to go to the Import screen', trace.value)
            context.emit('storelocation', 'dataimport=' + datasetheaderID.value)
            router.push({ name: 'Dataset' })
        }

        // --------------------------------------------------------------------------
        // Process Import
        // --------------------------------------------------------------------------
        const processImport = async () => {
            consoleLog('Datasets.vue/processImport', 2, 'User asks to Import selected row(s)', trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to import...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                let position = 99999
                // Import all the selected reference(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doImport(position, recordID) == 0) status = 0
                }

                consoleLog('Datasets.vue/processImport', 2, 'Reorder the Data', trace.value)
                datasetheaderID.value = backToDataHeaderID.value
                await doReorder()
                recordSelected.value = []

                if (status == 0) {
                    DisplayError('Error during the import of the selected record(s)', 'Alert')
                } else {
                    context.emit('storelocation', 'backtodata=' + backToDataHeaderID.value)
                    router.push({ name: 'Dataset' })
                }
            }
        }


        // --------------------------------------------------------------------------
        // User cancel the action, Back to the control panel or the dashboard
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('Datasets.vue/handleCancel', 2, 'User Cancel the action', trace.value)

            // if (location.value.includes('test=')) {
            //     //router.go(-1)
            //     router.push({ name: 'Datasetheader' })
            // } else if (location.value == 'dashboard') {
            //     router.push({ name: 'Dashboard' })
            // } else {
            //     router.push({ name: 'ControlPanel' })
            // }

            router.push({ name: 'Dataset' })
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
        // Call the API to reorder correctly all the positions of the datasets 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let dataset = []
            consoleLog('Datasets.vue/doReorder', 2, 'Reorder all the positions of the Datasets', trace.value)
            const { error, reorderTheDatasets } = reorderDatasets(datasetheaderID.value)
            return await reorderTheDatasets(dataset, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Datasets.vue/doReorder', 2, 'Dataset reorder status: ' + dataset.value.success, trace.value)
                    if (dataset.value.success) {
                        consoleLog('Datasets.vue/doReorder', 2, dataset, trace.value)
                        return (1)
                    } else {
                        consoleLog('Datasets.vue/doReorder', 2, 'Error during the reorder of the datasets position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert a dataset 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let dataset = []
            const now = new Date();
            const currentDateTime = now.toLocaleString();
            let code = '_New'
            let label = 'New' // + currentDateTime

            consoleLog('Datasets.vue/doInsert', 2, 'Insert a new Dataset', trace.value)
            const { error, addNewDataset } = addDataset(subprojectID.value, datasetheaderID.value, code, label, '', position, 1, userName.value, today)
            return await addNewDataset(dataset, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Datasets.vue/doInsert', 2, 'Dataset insert status: ' + dataset.value.success, trace.value)
                    if (dataset.value.success) {
                        consoleLog('Datasets.vue/doInsert', 2, dataset, trace.value)
                        return (1)
                    } else {
                        consoleLog('Datasets.vue/doInsert', 2, 'Error during the insert of a dataset', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to copy a dataset 
        // --------------------------------------------------------------------------
        const doCopy = async (datasetID, position) => {
            let dataset = []
            consoleLog('Datasets.vue/doCopy', 2, 'Copy an existing Dataset - datasetID: ' + datasetID + ' at position: ' + position, trace.value)
            const { error, copyTheDataset } = copyDataset(datasetID, position, userName.value, today)
            return await copyTheDataset(dataset, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Datasets.vue/doCopy', 2, 'Dataset copy status: ' + dataset.value.success, trace.value)
                    if (dataset.value.success) {
                        consoleLog('Datasets.vue/doCopy', 2, dataset, trace.value)
                        return (1)
                    } else {
                        consoleLog('Datasets.vue/doCopy', 2, 'Error during the copy of a dataset', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a dataset 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (datasetID, position) => {

            let dataset = []
            consoleLog('Datasets.vue/doUpdatePosition', 2, 'Change the position of a Dataset - datasetID: ' + datasetID + ', position: ' + position, trace.value)
            const { error, updateThePosition } = updatePositionDataset(datasetID, position)
            return await updateThePosition(dataset, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('Datasets.vue/doUpdatePosition', 2, 'Dataset status: ' + dataset.value.success, trace.value)
                    if (dataset.value.success) {
                        consoleLog('Datasets.vue/doUpdatePosition', 2, dataset, trace.value)
                        return (1)
                    } else {
                        consoleLog('Datasets.vue/doUpdatePosition', 2, 'Error during the update of the dataset position', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete a dataset 
        // --------------------------------------------------------------------------
        const doDelete = async (datasetID) => {
            let dataset = []
            consoleLog('Datasets.vue/doDelete', 2, 'Delete an existing Dataset - datasetheaderID: ' + datasetheaderID.value + ', datasetID: ' + datasetID, trace.value)
            const { error, deleteTheDataset } = deleteDataset(datasetheaderID.value, datasetID)
            return await deleteTheDataset(dataset, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Datasets.vue/doDelete', 2, 'Dataset delete status: ' + dataset.value.success, trace.value)
                    if (dataset.value.success) {
                        consoleLog('Datasets.vue/doDelete', 2, dataset, trace.value)
                        return (1)
                    } else {
                        consoleLog('Datasets.vue/doDelete', 2, 'Error during the delete of a dataset', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Datasets received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (datasetID) => {
            consoleLog('Datasets.vue/selectRecord', 2, 'Received a request to select a record: ' + datasetID, trace.value)
            if (!recordSelected.value.includes(datasetID)) {
                recordSelected.value.push(datasetID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != datasetID)
            }
            consoleLog('Datasets.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('Datasets.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // Datasets received a request to add a new Dataset
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('Datasets.vue/handleInsert', 2, 'Add ' + rowToInsert.value + ' new empty dataset(s) after the Dataset position: ' + position, trace.value)
            let originalPosition = position
            position = position.padStart(6, '0') + 'I'
            let status = 1;
            let err = 1;
            for (let i = 1; i <= rowToInsert.value; i++) {
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a dataset', 'Alert')
            } else {
                DisplayError('Inserted ' + rowToInsert.value + ' dataset(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            await doReorder()
            // Refresh the list
            context.emit('storelocation', 'controlpanel=' + originalPosition)
            location.value = 'controlpanel=' + originalPosition
            await loadDatasetData()

        }


        // --------------------------------------------------------------------------
        // Datasets received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('Datasets.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' dataset(s) after the Dataset position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to copy before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                let originalPosition = position
                position = position.padStart(6, '0') + 'C'
                // Copy all the selected dataset(s)
                for (let recordID of recordSelected.value) {
                    position = originalPosition.padStart(6, '0') + 'C'
                    position = position + counter.toString().padStart(3, '0')
                    counter = counter + 1
                    consoleLog('Datasets.vue/handleCopy', 2, 'doCopy ' + recordID + ', position: ' + position, trace.value)
                    if (await doCopy(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the copy of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected dataset(s) copy successfully', 'Info')
                }
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                context.emit('storelocation', 'controlpanel=' + originalPosition)
                location.value = 'controlpanel=' + originalPosition
                // Refresh the list
                await loadDatasetData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Datasets received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('Datasets.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' dataset(s) after the Dataset position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                let originalPosition = position
                position = position.padStart(6, '0') + 'M'
                // Update the position of all the selected dataset(s)
                for (let recordID of recordSelected.value) {
                    position = originalPosition.padStart(6, '0') + 'M'
                    position = position + counter.toString().padStart(3, '0')
                    counter = counter + 1
                    //await displayConsole('handle move:', recordID + ', ' + position)
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected dataset(s) reorder successfully', 'Info')
                }
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                context.emit('storelocation', 'controlpanel=' + originalPosition)
                location.value = 'controlpanel=' + originalPosition
                
                // Refresh the list
                await loadDatasetData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Datasets received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (datasetID, position) => {
            consoleLog('Datasets.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' dataset(s) and the Dataset: ' + datasetID, trace.value)
            let status = 1;
            let originalPosition = position - 1

            // Add the datasetID if it's not already in the list
            if (!recordSelected.value.includes(datasetID)) {
                recordSelected.value.push(datasetID)
            }

            // Delete the selected dataset(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected dataset(s)', 'Alert')
            } else {
                DisplayError('Selected dataset(s) deleted successfully', 'Info')
            }
            // Refresh the list
            context.emit('storelocation', 'controlpanel=' + originalPosition)
            location.value = 'controlpanel=' + originalPosition
            await loadDatasetData()
            recordSelected.value = []
        }



        return {
            errorMessage, styleMessage, datasets, filteredData, filterValue, filteredRows, workspaceID, workspace, actionAllowed, backToDataHeaderID,
            superUser, projectID, projectName, datasetheaderID, subprojectName, userID, displayInfo, trace, rowToInsert, URL, jsonFile, viewLink,
            handleCancel, refreshDatasets, handleInsert, handleCopy, handleMove, handleDelete, selectRecord, processImport,
            handleFocus, handleBlur, handleCancel, handleRowToInsert, storeLocation, handleExport, handleExportJSON, handleImport
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
    display: flex;
    justify-content: center;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.2);
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
    padding: 0 2.3rem 2.2rem;
    color: #fff;
    font-weight: bold;
    font-size: 1.5rem;
    line-height: 1;
    margin-bottom: 0.7rem;
}

.subtitle {
    padding: 1rem 1rem;
    background-color: #cfc9c9;
    color: #1abc9c;
    border-radius: 25px;
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
    /* scrollbar-color: red orange; */
    scrollbar-width: thin;
    height: 50rem;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>