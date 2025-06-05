<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">AI Training</h3>
                <img src="../../assets/AIRobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <form @submit.prevent="">

                    <table>
                        <tbody>
                            <tr>
                                <td class="menu">
                                </td>
                                <td class="menu">
                                    <div class="actions3">
                                        <div class="input-container focus" style="min-width: 30rem; max-width: 30rem">
                                            <input type="text" name="dataFilter" class="input"
                                                @focus="handleFocus($event)"
                                                title="You can filter by the criteria or by #id"
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
                        <AITrainingList :key="filterValue" class="aitrainingList" :aitrainings="filteredData"
                            :workspaceID="workspaceID" :workspace="workspace" :superUser="superUser"
                            :projectID="projectID" :userID="userID" :trace="trace" @refreshtraining="refreshTraining"
                            @selectrecord="selectRecord" @handleinsert="handleInsert" @handlecopy="handleCopy"
                            @handlemove="handleMove" @handledelete="handleDelete" />
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
import AITrainingList from '../../components/ai_training/AITrainingList.vue'
import getAI_TrainingByProject from '../../composables/ai_training/getAI_TrainingByProject'
import updatePositionAI_Training from '../../composables/ai_training/updatePositionAI_Training'
import reorderAI_Training from '../../composables/ai_training/reorderAI_Training'
import addAI_Training from '../../composables/ai_training/addAI_Training'
import copyAI_Training from '../../composables/ai_training/copyAI_Training'
import deleteAI_Training from '../../composables/ai_training/deleteAI_Training'
import deleteAllAI_TagAttribute from '../../composables/ai_tagattribute/deleteAllAI_TagAttribute'
import deleteAllAI_TagElement from '../../composables/ai_tagelement/deleteAllAI_TagElement'


import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Function',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'subprojectID', 'subprojectName', 'location'],
    components: { AITrainingList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const recordTarget = ref(0)
        const rowToInsert = ref(1)


        displayMsg('AITraining.vue', trace.value)
        consoleLog('AITraining.vue - props', 1, props, trace.value)

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
        const userName = ref(props.currentuser)
        const superUser = ref(props.superUser)
        const aitrainings = ref([])
        const displayInfo = ref('')
        const location = ref(props.location)
        const filterValue = ref('')

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
            consoleLog('AITraining.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        const loadTrainingData = async () => {
            // -------------------------------------------
            // load all the AI Attributes  
            // -------------------------------------------
            consoleLog('AITraining.vue/loadTrainingData', 2, 'Loading Trainings', trace.value)
            const { error, getTheAI_Training } = getAI_TrainingByProject(subprojectID.value)
            getTheAI_Training(aitrainings, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('AITraining.vue/loadTrainingData', 2, 'Attribute Load status: ' + aitrainings.value.success, trace.value)
                    if (aitrainings.value.success && aitrainings.value.data.length) {
                        aitrainings.value = aitrainings.value.data
                        filteredData.value = aitrainings.value
                        consoleLog('AITraining.vue/loadTrainingData', 2, aitrainings.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('AITraining.vue/loadTrainingData', 2, 'No Attribute found!', trace.value)
                        return (0)
                    }
                })
        }


        // Load attribute data
        loadTrainingData()


        // ---------------------------------------------
        // Compute the functions depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('AITraining.vue/filteredData', 2, 'computed value', trace.value)
            if (aitrainings.value.length) {
                return aitrainings.value.filter((ar) => ar.criteria.toUpperCase().includes(filterValue.value.toUpperCase())
                    || ('#' + ar.trainingID).includes(filterValue.value))
            } else {
                filteredRows.value = ''
                return aitrainings.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })


        // --------------------------------------------------------------------------
        // aitrainingList emits a request to refresh the functions
        // --------------------------------------------------------------------------
        const refreshTraining = (status, msg) => {
            consoleLog('AITraining.vue/refreshTraining', 2, 'received a request to refresh the functions  from aitrainingList / aitrainingSingle', trace.value)
            consoleLog('AITraining.vue/refreshTraining', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadTrainingData()
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
            consoleLog('AITraining.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'AIDashboard' })
        }


        // --------------------------------------------------------------------------
        // Call the API to reorder correctly all the positions of the Attributes 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let aitraining = []
            consoleLog('AITraining.vue/doReorder', 2, 'Reorder all the positions of the References', trace.value)
            const { error, reorderTheAI_Training } = reorderAI_Training(subprojectID.value)
            return await reorderTheAI_Training(aitraining, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('AITraining.vue/doReorder', 2, 'Attribute reorder status: ' + aitraining.value.success, trace.value)
                    if (aitraining.value.success) {
                        consoleLog('AITraining.vue/doReorder', 2, aitraining, trace.value)
                        return (1)
                    } else {
                        consoleLog('AITraining.vue/doReorder', 2, 'Error during the reorder of the Attribute position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert a Attribute 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let aitraining = []
            let name = 'New'
            let comment = 'New'


            consoleLog('AITraining.vue/doInsert', 2, 'Insert a new Attribute - position: ' + position, trace.value)
            // projectID, selectorID, criteria, position, active, createdby, created

            const { error, addNewAI_Training } = addAI_Training(subprojectID.value, 0, '', position, 1, userName.value, today)
            return await addNewAI_Training(aitraining, trace.value)
                .then(function () {
                    // check the status of the insert
                    consoleLog('AITraining.vue/doInsert', 2, 'Attribute insert status: ' + aitraining.value.success, trace.value)
                    if (aitraining.value.success) {
                        consoleLog('AITraining.vue/doInsert', 2, aitraining, trace.value)
                        return (1)
                    } else {
                        consoleLog('AITraining.vue/doInsert', 2, 'Error during the insert of a Attribute', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to copy a Attribute 
        // --------------------------------------------------------------------------
        const doCopy = async (trainingID, position) => {
            let aitraining = []
            consoleLog('AITraining.vue/doCopy', 2, 'Copy an existing Function - trainingID: ' + trainingID + ' at position: ' + position, trace.value)
            const { error, copyTheAI_Training } = copyAI_Training(trainingID, position)
            return await copyTheAI_Training(aitraining, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('AITraining.vue/doCopy', 2, 'Attribute copy status: ' + aitraining.value.success, trace.value)
                    if (aitraining.value.success) {
                        consoleLog('AITraining.vue/doCopy', 2, aitraining, trace.value)
                        return (1)
                    } else {
                        consoleLog('AITraining.vue/doCopy', 2, 'Error during the copy of a Attribute', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a Attribute 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (trainingID, position) => {

            let aitraining = []
            consoleLog('AITraining.vue/doUpdatePosition', 2, 'Change the position of a Attribute - trainingID: ' + trainingID + ', position: ' + position, trace.value)
            const { error, updateTheAI_Training } = updatePositionAI_Training(trainingID, position)
            return await updateTheAI_Training(aitraining, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('AITraining.vue/doUpdatePosition', 2, 'Attribute status: ' + aitraining.value.success, trace.value)
                    if (aitraining.value.success) {
                        consoleLog('AITraining.vue/doUpdatePosition', 2, aitraining, trace.value)
                        return (1)
                    } else {
                        consoleLog('AITraining.vue/doUpdatePosition', 2, 'Error during the update of the Attribute position', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete a Attribute 
        // --------------------------------------------------------------------------
        const doDelete = async (trainingID) => {
            const aitraining = ref([])
            const aitagattribute = ref([])
            const aitagelement = ref([])

            consoleLog('AITraining.vue/doDelete', 2, 'Delete all existing Tag Attributes of the session - trainingID: ' + trainingID, trace.value)
            const { error0, deleteTheAI_TagElement } = deleteAllAI_TagElement(projectID.value, trainingID)
            let ret = await deleteTheAI_TagElement(aitagelement, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('AITraining.vue/deleteTheAI_TagElement', 2, 'Tag Element delete status: ' + aitagelement.value.success, trace.value)
                    if (aitagelement.value.success) {
                        consoleLog('AITraining.vue/deleteTheAI_TagElement', 2, aitagelement.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('AITraining.vue/deleteTheAI_TagElement', 2, 'Error during the delete of a tag element', trace.value)
                        DisplayError('Error during the delete of the Tag Elements of the session', 'Alert')
                        return (0)
                    }
                })

            const { error1, deleteTheAI_TagAttribute } = deleteAllAI_TagAttribute(projectID.value, trainingID)
            ret = await deleteTheAI_TagAttribute(aitagattribute, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('AITraining.vue/deleteTheAI_TagAttribute', 2, 'Tag Attribute delete status: ' + aitagattribute.value.success, trace.value)
                    if (aitagattribute.value.success) {
                        consoleLog('AITraining.vue/deleteTheAI_TagAttribute', 2, aitagattribute, trace.value)
                        return (1)
                    } else {
                        consoleLog('AITraining.vue/deleteTheAI_TagAttribute', 2, 'Error during the delete of a Attribute', trace.value)
                        DisplayError('Error during the delete of the Tag Attributes of the session', 'Alert')
                        return (0)
                    }
                })

            const { error2, deleteTheAI_Training } = deleteAI_Training(trainingID)
            ret = await deleteTheAI_Training(aitraining, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('AITraining.vue/deleteTheAI_Training', 2, 'Training delete status: ' + aitraining.value.success, trace.value)
                    if (aitraining.value.success) {
                        consoleLog('AITraining.vue/deleteTheAI_Training', 2, aitraining, trace.value)
                        return (1)
                    } else {
                        consoleLog('AITraining.vue/deleteTheAI_Training', 2, 'Error during the delete of a training session', trace.value)
                        DisplayError('Error during the delete of the training session', 'Alert')
                        return (0)
                    }
                })
            return ret
        }



        // --------------------------------------------------------------------------
        // aitraining received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (trainingID) => {
            consoleLog('AITraining.vue/selectRecord', 2, 'Received a request to select a record: ' + trainingID, trace.value)
            if (!recordSelected.value.includes(trainingID)) {
                recordSelected.value.push(trainingID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != trainingID)
            }
            consoleLog('AITraining.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('AITraining.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // aitraining received a request to add a new Training
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('AITraining.vue/handleInsert', 2, 'Add ' + rowToInsert.value + ' new empty function(s) after the position: ' + position, trace.value)
            position = position.padStart(6, '0') + 'I'
            let status = 1;
            let err = 1;
            for (let i = 1; i <= rowToInsert.value; i++) {
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a Attribute', 'Alert')
            } else {
                DisplayError('Inserted ' + rowToInsert.value + ' Attribute(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            await doReorder()
            // Refresh the list
            await loadTrainingData()

        }


        // --------------------------------------------------------------------------
        // aitraining received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('AITraining.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' Attribute(s) after the position: ' + position, trace.value)
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
                    DisplayError('Selected Attribute(s) copy successfully', 'Info')
                }
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                // Refresh the list
                await loadTrainingData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // aitraining received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('AITraining.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' Attribute(s) after the position: ' + position, trace.value)
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
                await loadTrainingData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // aitraining received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (trainingID) => {
            consoleLog('AITraining.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' function(s) and the function: ' + trainingID, trace.value)
            let status = 1;

            // Add the trainingID if it's not already in the list
            if (!recordSelected.value.includes(trainingID)) {
                recordSelected.value.push(trainingID)
            }
            // Delete the selected function(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected Attribute(s)', 'Alert')
            } else {
                DisplayError('Selected Attribute(s) deleted successfully', 'Info')
            }
            // Refresh the list
            await loadTrainingData()
            recordSelected.value = []
        }





        return {
            errorMessage, styleMessage, aitrainings, filteredData, filterValue, filteredRows, workspaceID, workspace,
            superUser, projectID, projectName, subprojectID, subprojectName, userID, displayInfo, trace, rowToInsert,
            handleCancel, refreshTraining, handleInsert, handleCopy, handleMove, handleDelete, selectRecord,
            handleFocus, handleBlur, handleCancel
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