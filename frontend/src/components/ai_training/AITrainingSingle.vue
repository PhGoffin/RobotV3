<template>
    <div v-if="showPopup">
        <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
    </div>

    <div :class="recordSelected ? 'entity selected' : (aitraining.active ? 'entity' : 'entity inactive')">

        <div class="actions">

            <h3 @click="showDetails = !showDetails" title="Click to show details" class="data">
              {{ aitraining.selector }} = {{ aitraining.criteria }} - {{ aitraining.created }} by {{ aitraining.createdby }}
            </h3>

            <div class="actions">

                <div class="actions">
                    <div class="icons" v-if="actionAllowed">
                        <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the training"></i>
                    </div>

                    <!-- <div class="icons" v-if="actionAllowed">
                        <router-link :to="{ name: 'AITrainingEdit', params: { id: trainingID } }">
                            <i class="fa-regular fa-pen-to-square" title="Edit the training"></i>
                        </router-link>
                    </div> -->


                    <div class="icons" v-if="actionAllowed">
                        <i>&nbsp;</i>
                    </div>

                    <!-- <div class="icons" v-if="actionAllowed">
                        <i class="fa-solid fa-down-left-and-up-right-to-center" @click="handleMove"
                            title="Move after this row"></i>
                    </div> -->

                    <div class="icons" v-if="actionAllowed">
                        <input type="checkbox" name="selection" class="input checkbox" @change="handleSelect"
                            title="Check to indicate the row(s) to Copy or Move" />
                    </div> 

                    <div class="icons" v-if="actionAllowed">
                        <i>&nbsp;</i>
                    </div>

                    <div class="icons" v-if="actionAllowed">
                        <router-link :to="{ name: 'AITagElement', params: { id: trainingID } }">
                            <!-- <i class="fa-solid fa-table-cells" title="Display elements detected during the training session"></i> -->
                            <i class="fa-brands fa-elementor" title="Display elements detected during the training session"></i>
                        </router-link>
                    </div>


                </div>

            </div>

        </div>
        <div class="details" v-if="showDetails">
            <p>ID: {{ aitraining.trainingID }} </p>
        </div>

    </div>
</template>

<script>
import { ref } from 'vue'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'


export default {
    props: ['trace', 'aitraining', 'superUser'],
    components: { PopupConfirm },

    setup(props, context) {
        const trace = ref(props.trace)

        displayMsg('AITrainingSingle.vue', trace.value)
        consoleLog('AITrainingSingle.vue - props', 1, props, trace.value)

        const showDetails = ref(false)
        const showPopup = ref(false)
        const aitraining = ref(props.aitraining)
        const IamSuperUser = ref(props.superUser)
        const actionAllowed = ref(true)
        const trainingID = ref(aitraining.value.trainingID)
        const recordSelected = ref(false)



        // -------------------------------------------
        // User asks to delete a aitraining
        // -------------------------------------------
        const handelDelete = () => {
            consoleLog('AITrainingSingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
            context.emit('handledelete', aitraining.value.trainingID)
        }

        // --------------------------------------------------------------------------
        // User cancel the delete action
        // --------------------------------------------------------------------------
        const handleConfirmation = () => {
            consoleLog('AITrainingSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
            showPopup.value = true
        }

        // --------------------------------------------------------------------------
        // User cancel the delete action
        // --------------------------------------------------------------------------
        const handleCancelDelete = () => {
            consoleLog('AITrainingSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
            showPopup.value = false
        }


        // --------------------------------------------------------------------------
        // User confirm the delete action
        // --------------------------------------------------------------------------
        const handleConfirmDelete = () => {
            consoleLog('AITrainingSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
            showPopup.value = false
            handelDelete()
        }

        // --------------------------------------------------------------------------
        // User cancel the delete action
        // --------------------------------------------------------------------------
        const handleSelect = () => {
            consoleLog('AITrainingSingle.vue/handleSelect', 2, 'Select a record', trace.value)
            recordSelected.value = !recordSelected.value
            context.emit('selectrecord', trainingID.value)
        }


        // --------------------------------------------------------------------------
        // User want to insert record(s)
        // --------------------------------------------------------------------------
        const handleInsert = () => {
            consoleLog('AITrainingSingle.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
            context.emit('handleinsert', aitraining.value.position)
        }

        // --------------------------------------------------------------------------
        // User want to copy record(s)
        // --------------------------------------------------------------------------
        const handleCopy = () => {
            consoleLog('AITrainingSingle.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
            context.emit('handlecopy', aitraining.value.position)
        }

        // --------------------------------------------------------------------------
        // User want to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = () => {
            consoleLog('AITrainingSingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
            context.emit('handlemove', aitraining.value.position)
        }

        return {
            showDetails, trainingID, aitraining, actionAllowed, showPopup, recordSelected,
            handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete,
            handleSelect, handleInsert, handleCopy, handleMove
        }
    }
}
</script>

<style scoped>
.entity {
    position: relative;
    margin: 20px auto;
    background: white;
    padding: 10px 20px;
    border-top-right-radius: 1.5rem;
    box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
    border-left: 4px solid #2300e9;
    width: 80%;
}

.entity.inactive {
    position: relative;
    margin: 20px auto;
    background: white;
    padding: 10px 20px;
    border-radius: 4px;
    box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
    border-left: 4px solid red;
    width: 80%;
}

.entity.selected {
    background: rgb(247, 239, 193);
    border-left: 4px solid #eed811;
}


.input.checkbox {
    height: 1.5rem;
    width: 1.5rem;
}

h3 {
    cursor: pointer;
    width: auto;
}

p {
    text-align: left;
}

.data {
    text-align: left;
    padding-left: 1.5rem;
}

.actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.actions i {
    font-size: 24px;
    margin-left: 10px;
    color: #bbb;
    cursor: pointer;
}

.actions i:hover {
    color: #777;
}
</style>