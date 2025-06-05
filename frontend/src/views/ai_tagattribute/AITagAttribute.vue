<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">Attribute</h3>
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
                                    <!-- <div class="input-container focus" style="max-width: 10rem">
                                    <input type="text" name="RowNb" class="input" @focus="handleFocus($event)"
                                        @blur="handleBlur($event)" @change="handleRowToInsert" v-model="rowToInsert"
                                        required />
                                    <label>Row(s) to insert</label>
                                    <span>Row(s) to insert</span>
                                </div> -->
                                </td>
                                <td class="menu">
                                    <div class="actions3">
                                        <div class="input-container focus" style="min-width: 30rem; max-width: 30rem">
                                            <input type="text" name="dataFilter" class="input"
                                                @focus="handleFocus($event)"
                                                title="type <ACTIVE> to filter only by active attributes"
                                                @blur="handleBlur($event)" v-model="filterValue" />
                                            <label>Filter {{ filteredRows }}</label>
                                            <span>Filter {{ filteredRows }}</span>
                                        </div>
                                        <i class="fa-regular fa-trash-can" @click="filterValue = ''"
                                            title="Reset the filter"></i>

                                        <i class="fa-regular fa-eye" @click="filterValue = '<ACTIVE>'"
                                            title="Only active attributes"></i>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </form>


                <div class="entities" height="150px">
                    <div v-if="error"> {{ error }}</div>
                    <div v-if="filteredData.length" class="layout">
                        <AITagAttributeList :key="filterValue" class="AITagAttributeList"
                            :aitagattributes="filteredData" :workspaceID="workspaceID" :workspace="workspace"
                            :superUser="superUser" :projectID="projectID" :userID="userID" :trace="trace"
                            @refreshtagattribute="refreshTagAttribute" @selectrecord="selectRecord"
                            @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove"
                            @handledelete="handleDelete" @handlerestore="handleRestore" />
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
import AITagAttributeList from '../../components/ai_tagattribute/AITagAttributeList.vue'
import getAI_TagAttributeByTraining from '../../composables/ai_tagattribute/getAI_TagAttributeByTraining'
import getAI_TagAttributeByTagElement from '../../composables/ai_tagattribute/getAI_TagAttributeByTagElement'
import updatePositionAI_TagAttribute from '../../composables/ai_tagattribute/updatePositionAI_TagAttribute'
import reorderAI_TagAttribute from '../../composables/ai_tagattribute/reorderAI_TagAttribute'
import addAI_TagAttribute from '../../composables/ai_tagattribute/addAI_TagAttribute'
import copyAI_TagAttribute from '../../composables/ai_tagattribute/copyAI_TagAttribute'
import deleteAI_TagAttribute from '../../composables/ai_tagattribute/deleteAI_TagAttribute'
import restoreAI_TagAttribute from '../../composables/ai_tagattribute/restoreAI_TagAttribute'


import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Tag Attribute',
    props: ['trace', 'id', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'location'],
    components: { AITagAttributeList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const recordTarget = ref(0)
        const rowToInsert = ref(1)


        displayMsg('AI_TagAttribute.vue', trace.value)
        consoleLog('AI_TagAttribute.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }


        const tagelementID = ref(props.id)
        const workspaceID = ref(props.workspaceID)
        const workspace = ref(props.workspace)
        const projectID = ref(props.projectID)
        const projectName = ref(props.projectName)
        const userID = ref(props.userID)
        const superUser = ref(props.superUser)
        const aitagattributes = ref([])
        const displayInfo = ref('')
        const location = ref(props.location)
        const filterValue = ref('<ACTIVE>') // filter on active record only, by default
        const trainingID = ref(0)


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
            consoleLog('AI_TagAttribute.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        // -----------------------------------------------------------------------
        // Check if we come from the tagelement vue
        // Syntax is: tagelement=<tagelementID>
        // -----------------------------------------------------------------------
        if (location.value.includes('tagelement=')) {
            // split the location to find the keyword
            let data = location.value.split("=");
            trainingID.value = data[1]
        }

        const loadTagAttributeData = async () => {
            // -------------------------------------------
            // load all the AI Tag Attributes  
            // -------------------------------------------
            consoleLog('AI_TagAttribute.vue/loadTagAttributeData', 2, 'Loading Tag Attributes', trace.value)
            const { error, getTheAI_TagAttribute } = getAI_TagAttributeByTagElement(projectID.value, tagelementID.value)
            getTheAI_TagAttribute(aitagattributes, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('AI_TagAttribute.vue/loadTagAttributeData', 2, 'Tag Attribute Load status: ' + aitagattributes.value.success, trace.value)
                    if (aitagattributes.value.success && aitagattributes.value.data.length) {
                        aitagattributes.value = aitagattributes.value.data
                        filteredData.value = aitagattributes.value
                        consoleLog('AI_TagAttribute.vue/loadTagAttributeData', 2, aitagattributes.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('AI_TagAttribute.vue/loadTagAttributeData', 2, 'No Attribute found!', trace.value)
                        return (0)
                    }
                })
        }

        // Load attribute data
        loadTagAttributeData()


        // ---------------------------------------------
        // Compute the functions depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('AI_TagAttribute.vue/filteredData', 2, 'computed value', trace.value)
            if (aitagattributes.value.length) {
                if (filterValue.value != '<ACTIVE>')
                    return aitagattributes.value.filter((ar) => ('#' + ar.tagattributeID).includes(filterValue.value) || ('=' + ar.active) == filterValue.value)
                else
                    return aitagattributes.value.filter((ar) => !(ar.active == 0 || ar.value == '??'))
            } else {
                filteredRows.value = ''
                return aitagattributes.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })




        // --------------------------------------------------------------------------
        // AITagAttributeList emits a request to refresh the functions
        // --------------------------------------------------------------------------
        const refreshTagAttribute = (status, msg) => {
            consoleLog('AI_TagAttribute.vue/refreshTagAttribute', 2, 'received a request to refresh the Tag Attribute  from AITagAttributeList / aitagattributesingle', trace.value)
            consoleLog('AI_TagAttribute.vue/refreshTagAttribute', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadTagAttributeData()
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
            consoleLog('AI_TagAttribute.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            context.emit('storelocation', 'controlpanel')
            router.push({ name: 'AITagElement', params: { id: trainingID.value } })
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
        // Call the API to reorder correctly all the positions of the Attributes 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let aitagattribute = []
            consoleLog('AI_TagAttribute.vue/doReorder', 2, 'Reorder all the positions of the References', trace.value)
            const { error, reorderTheAI_TagAttribute } = reorderAI_TagAttribute(projectID.value)
            return await reorderTheAI_TagAttribute(aitagattribute, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('AI_TagAttribute.vue/doReorder', 2, 'Attribute reorder status: ' + aitagattribute.value.success, trace.value)
                    if (aitagattribute.value.success) {
                        consoleLog('AI_TagAttribute.vue/doReorder', 2, aitagattribute, trace.value)
                        return (1)
                    } else {
                        consoleLog('AI_TagAttribute.vue/doReorder', 2, 'Error during the reorder of the Attribute position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert a Attribute 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let aitagattribute = []

            consoleLog('AI_TagAttribute.vue/doInsert', 2, 'Insert a new Attribute - position: ' + position, trace.value)
            // projectID, tagelementID, level, pathID, pathValue, name, value, position, active
            const { error, addNewAI_TagAttribute } = addAI_TagAttribute(projectID.value, tagelementID.value, 0, 0, '', 0, '', position, 1)
            return await addNewAI_TagAttribute(aitagattribute, trace.value)
                .then(function () {
                    // check the status of the insert
                    consoleLog('AI_TagAttribute.vue/doInsert', 2, 'Tag Attribute insert status: ' + aitagattribute.value.success, trace.value)
                    if (aitagattribute.value.success) {
                        consoleLog('AI_TagAttribute.vue/doInsert', 2, aitagattribute, trace.value)
                        return (1)
                    } else {
                        consoleLog('AI_TagAttribute.vue/doInsert', 2, 'Error during the insert of a Attribute', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to copy a Attribute 
        // --------------------------------------------------------------------------
        const doCopy = async (tagattributeID, position) => {
            let aitagattribute = []
            consoleLog('AI_TagAttribute.vue/doCopy', 2, 'Copy an existing Tag Attribute - tagattributeID: ' + tagattributeID + ' at position: ' + position, trace.value)
            const { error, copyTheAI_TagAttribute } = copyAI_TagAttribute(tagattributeID, position)
            return await copyTheAI_TagAttribute(aitagattribute, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('AI_TagAttribute.vue/doCopy', 2, 'Attribute copy status: ' + aitagattribute.value.success, trace.value)
                    if (aitagattribute.value.success) {
                        consoleLog('AI_TagAttribute.vue/doCopy', 2, aitagattribute, trace.value)
                        return (1)
                    } else {
                        consoleLog('AI_TagAttribute.vue/doCopy', 2, 'Error during the copy of a Attribute', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a Attribute 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (tagattributeID, position) => {

            let aitagattribute = []
            consoleLog('AI_TagAttribute.vue/doUpdatePosition', 2, 'Change the position of a Tag Attribute - tagattributeID: ' + tagattributeID + ', position: ' + position, trace.value)
            const { error, updateTheAI_TagAttribute } = updatePositionAI_TagAttribute(tagattributeID, position)
            return await updateTheAI_TagAttribute(aitagattribute, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('AI_TagAttribute.vue/doUpdatePosition', 2, 'Tag Attribute status: ' + aitagattribute.value.success, trace.value)
                    if (aitagattribute.value.success) {
                        consoleLog('AI_TagAttribute.vue/doUpdatePosition', 2, aitagattribute, trace.value)
                        return (1)
                    } else {
                        consoleLog('AI_TagAttribute.vue/doUpdatePosition', 2, 'Error during the update of the Tag Attribute position', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to delete a Attribute 
        // --------------------------------------------------------------------------
        const doDelete = async (tagattributeID) => {
            let aitagattribute = []
            consoleLog('AI_TagAttribute.vue/doDelete', 2, 'Delete an existing Tag Attribute - tagattributeID: ' + tagattributeID, trace.value)
            const { error, deleteTheAI_TagAttribute } = deleteAI_TagAttribute(tagattributeID)
            return await deleteTheAI_TagAttribute(aitagattribute, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('AI_TagAttribute.vue/doDelete', 2, 'Tag Attribute delete status: ' + aitagattribute.value.success, trace.value)
                    if (aitagattribute.value.success) {
                        consoleLog('AI_TagAttribute.vue/doDelete', 2, aitagattribute, trace.value)
                        return (1)
                    } else {
                        consoleLog('AI_TagAttribute.vue/doDelete', 2, 'Error during the delete of a Tag Attribute', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // aitagattribute received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (tagattributeID) => {
            consoleLog('AI_TagAttribute.vue/selectRecord', 2, 'Received a request to select a record: ' + tagattributeID, trace.value)
            if (!recordSelected.value.includes(tagattributeID)) {
                recordSelected.value.push(tagattributeID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != tagattributeID)
            }
            consoleLog('AI_TagAttribute.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('AI_TagAttribute.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // aitagattribute received a request to add a new Reference
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('AI_TagAttribute.vue/handleInsert', 2, 'Add ' + rowToInsert.value + ' new empty Tag Attribute(s) after the position: ' + position, trace.value)
            position = position.padStart(6, '0') + 'I'
            let status = 1;
            let err = 1;
            for (let i = 1; i <= rowToInsert.value; i++) {
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a Tag Attribute', 'Alert')
            } else {
                DisplayError('Inserted ' + rowToInsert.value + ' Tag Attribute(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            await doReorder()
            // Refresh the list
            await loadTagAttributeData()

        }


        // --------------------------------------------------------------------------
        // aitagattribute received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('AI_TagAttribute.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' Tag Attribute(s) after the position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to copy before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.padStart(6, '0') + 'C'
                // Copy all the selected Tag Attribute(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doCopy(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the copy of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected Tag Attribute(s) copy successfully', 'Info')
                }
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                // Refresh the list
                await loadTagAttributeData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // aitagattribute received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('AI_TagAttribute.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' Tag Attribute(s) after the position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.padStart(6, '0') + 'M'
                // Update the position of all the selected Tag Attribute(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected Tag Attribute(s) reorder successfully', 'Info')
                }
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                // Refresh the list
                await loadTagAttributeData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // aitagattribute received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (tagattributeID) => {
            consoleLog('AI_TagAttribute.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' Tag Attribute(s) and the Tag Attribute: ' + tagattributeID, trace.value)
            let status = 1;

            // Add the tagattributeID if it's not already in the list
            if (!recordSelected.value.includes(tagattributeID)) {
                recordSelected.value.push(tagattributeID)
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
            await loadTagAttributeData()
            recordSelected.value = []
        }


        // --------------------------------------------------------------------------
        // aitagattribute received a request to restore original record
        // --------------------------------------------------------------------------
        const handleRestore = async (tagattributeID) => {
            let aitagattribute = []
            let ret = 1

            consoleLog('AI_TagAttribute.vue/handleRestore', 2, 'Restore Original Tag Attribute - tagattributeID: ' + tagattributeID, trace.value)
            const { error, restoreTheAI_TagAttribute } = restoreAI_TagAttribute(tagattributeID)
            await restoreTheAI_TagAttribute(aitagattribute, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('AI_TagAttribute.vue/handleRestore', 2, 'Tag Attribute restore status: ' + aitagattribute.value.success, trace.value)
                    if (aitagattribute.value.success) {
                        consoleLog('AI_TagAttribute.vue/handleRestore', 2, aitagattribute, trace.value)
                        //return (1)
                        ret = 1
                    } else {
                        consoleLog('AI_TagAttribute.vue/handleRestore', 2, 'Error during the restore of a Tag Attribute', trace.value)
                        //return (0)
                        ret = 0
                    }
                })

            // Refresh the list
            await loadTagAttributeData()
            recordSelected.value = []
            return ret
        }




        return {
            errorMessage, styleMessage, aitagattributes, filteredData, filterValue, filteredRows, workspaceID, workspace,
            superUser, projectID, projectName, userID, displayInfo, trace, rowToInsert,
            handleCancel, refreshTagAttribute, handleInsert, handleCopy, handleMove, handleDelete, handleRestore, selectRecord,
            handleFocus, handleBlur, handleRowToInsert
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