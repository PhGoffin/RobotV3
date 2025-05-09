<template>
    <div v-if="showPopup">
        <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
    </div>

    <div :class="recordSelected ? 'entity selected' : (aiselector.active ? 'entity' : 'entity inactive')">

        <div class="actions">

            <h3 @click="showDetails = !showDetails" title="Click to show details" class="data">
                {{ aiselector.name }} - {{ aiselector.endTag }}
            </h3>

            <div class="actions">

                <div class="actions">
                    <div class="icons" v-if="actionAllowed">
                        <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the selector"></i>
                    </div>

                    <div class="icons" v-if="actionAllowed">
                        <router-link :to="{ name: 'AISelectorEdit', params: { id: aiselectorID } }">
                            <i class="fa-regular fa-pen-to-square" title="Edit the selector"></i>
                        </router-link>
                    </div>

                    <div class="icons" v-if="actionAllowed">
                        <i class="fa-solid fa-plus" @click="handleInsert" title="Insert after this row"></i>
                    </div>

                    <div class="icons" v-if="actionAllowed">
                        <i>&nbsp;</i>
                    </div>

                    <div class="icons" v-if="actionAllowed">
                        <i class="fa-solid fa-copy" @click="handleCopy" title="Copy after this row"></i>
                    </div>

                    <div class="icons" v-if="actionAllowed">
                        <i class="fa-solid fa-down-left-and-up-right-to-center" @click="handleMove"
                            title="Move after this row"></i>
                    </div>

                    <div class="icons" v-if="actionAllowed">
                        <input type="checkbox" name="selection" class="input checkbox" @change="handleSelect"
                            title="Check to indicate the row(s) to Copy or Move" />
                    </div>


                </div>

            </div>

        </div>
        <div class="details" v-if="showDetails">
            <p>{{ aiselector.comment }}</p>
            <p>ID: {{ aiselector.selectorID }}</p>
        </div>

    </div>
</template>

<script>
import { ref } from 'vue'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'


export default {
    props: ['trace', 'aiselector', 'superUser'],
    components: { PopupConfirm },

    setup(props, context) {
        const trace = ref(props.trace)

        displayMsg('AISelectorSingle.vue', trace.value)
        consoleLog('AISelectorSingle.vue - props', 1, props, trace.value)

        const showDetails = ref(false)
        const showPopup = ref(false)
        const aiselector = ref(props.aiselector)
        const IamSuperUser = ref(props.superUser)
        const actionAllowed = ref(true)
        const aiselectorID = ref(aiselector.value.selectorID)
        const recordSelected = ref(false)



        // -------------------------------------------
        // User asks to delete a aiselector
        // -------------------------------------------
        const handelDelete = () => {
            consoleLog('AISelectorSingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
            context.emit('handledelete', aiselector.value.aiselectorID)
        }

        // --------------------------------------------------------------------------
        // User cancel the delete action
        // --------------------------------------------------------------------------
        const handleConfirmation = () => {
            consoleLog('AISelectorSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
            showPopup.value = true
        }

        // --------------------------------------------------------------------------
        // User cancel the delete action
        // --------------------------------------------------------------------------
        const handleCancelDelete = () => {
            consoleLog('AISelectorSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
            showPopup.value = false
        }


        // --------------------------------------------------------------------------
        // User confirm the delete action
        // --------------------------------------------------------------------------
        const handleConfirmDelete = () => {
            consoleLog('AISelectorSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
            showPopup.value = false
            handelDelete()
        }

        // --------------------------------------------------------------------------
        // User cancel the delete action
        // --------------------------------------------------------------------------
        const handleSelect = () => {
            consoleLog('AISelectorSingle.vue/handleSelect', 2, 'Select a record', trace.value)
            recordSelected.value = !recordSelected.value
            context.emit('selectrecord', aiselectorID.value)
        }


        // --------------------------------------------------------------------------
        // User want to insert record(s)
        // --------------------------------------------------------------------------
        const handleInsert = () => {
            consoleLog('AISelectorSingle.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
            context.emit('handleinsert', aiselector.value.position)
        }

        // --------------------------------------------------------------------------
        // User want to copy record(s)
        // --------------------------------------------------------------------------
        const handleCopy = () => {
            consoleLog('AISelectorSingle.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
            context.emit('handlecopy', aiselector.value.position)
        }

        // --------------------------------------------------------------------------
        // User want to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = () => {
            consoleLog('AISelectorSingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
            context.emit('handlemove', aiselector.value.position)
        }

        return {
            showDetails, aiselectorID, aiselector, actionAllowed, showPopup, recordSelected,
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