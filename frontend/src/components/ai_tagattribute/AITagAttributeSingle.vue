<template>
    <div v-if="showPopup">
        <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
    </div>

    <div :class="recordSelected ? 'entity selected' : (aitagattribute.value == '??' ? 'entity inactive' : (aitagattribute.active ? 'entity' : 'entity inactive'))">

        <div class="actions">

            <h3 @click="showDetails = !showDetails" title="Click to show details" class="data">
                Level: {{ aitagattribute.level }} - {{ aitagattribute.name }} = '{{ aitagattribute.value }}'
            </h3>

            <div class="actions">

                <div class="actions">
                    <div class="icons" v-if="actionAllowed">
                        <i class="fa-regular fa-eye-slash" @click="handleConfirmation" title="Disable the attribute"></i>
                    </div>

                    <div class="icons" v-if="actionAllowed">
                        <i class="fa-regular fa-eye" @click="handleRestore" title="Restore original attribute"></i>
                    </div>


                    <div class="icons" v-if="actionAllowed">
                        <router-link :to="{ name: 'AITagAttributeEdit', params: { id: tagattributeID } }">
                            <i class="fa-regular fa-pen-to-square" title="Edit the attribute"></i>
                        </router-link>
                    </div>

                    <!-- <div class="icons" v-if="actionAllowed">
                        <i class="fa-solid fa-plus" @click="handleInsert" title="Insert after this row"></i>
                    </div> -->

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
            <p> ID: {{ aitagattribute.tagattributeID }} </p>
            <p>Path: ({{ aitagattribute.pathID }}) - {{ aitagattribute.fullPath }}</p>
            <p>Path value: {{ aitagattribute.pathValue }}</p>
            <p>Original value: {{ aitagattribute.original }}</p>
            <p>Current value: {{ aitagattribute.value }}</p>
            <p>Active: {{ aitagattribute.active }}</p>
        </div>

    </div>
</template>

<script>
import { ref } from 'vue'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'


export default {
    props: ['trace', 'aitagattribute', 'superUser'],
    components: { PopupConfirm },

    setup(props, context) {
        const trace = ref(props.trace)

        displayMsg('AITagAttributeSingle.vue', trace.value)
        consoleLog('AITagAttributeSingle.vue - props', 1, props, trace.value)

        const showDetails = ref(false)
        const showPopup = ref(false)
        const aitagattribute = ref(props.aitagattribute)
        const IamSuperUser = ref(props.superUser)
        const actionAllowed = ref(true)
        const tagattributeID = ref(aitagattribute.value.tagattributeID)
        const recordSelected = ref(false)



        // -------------------------------------------
        // User asks to restore original aitagattribute 
        // -------------------------------------------
        const handleRestore = () => {
            consoleLog('AITagAttributeSingle.vue/handleRestore', 2, 'Emit event to restore original record', trace.value)
            context.emit('handlerestore', aitagattribute.value.tagattributeID)
        }

        // -------------------------------------------
        // User asks to delete a aitagattribute (replace the attribute by ??)
        // -------------------------------------------
        const handelDelete = () => {
            consoleLog('AITagAttributeSingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
            context.emit('handledelete', aitagattribute.value.tagattributeID)
        }

        // --------------------------------------------------------------------------
        // User cancel the delete action
        // --------------------------------------------------------------------------
        const handleConfirmation = () => {
            consoleLog('AITagAttributeSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
            showPopup.value = true
        }

        // --------------------------------------------------------------------------
        // User cancel the delete action
        // --------------------------------------------------------------------------
        const handleCancelDelete = () => {
            consoleLog('AITagAttributeSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
            showPopup.value = false
        }


        // --------------------------------------------------------------------------
        // User confirm the delete action
        // --------------------------------------------------------------------------
        const handleConfirmDelete = () => {
            consoleLog('AITagAttributeSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
            showPopup.value = false
            handelDelete()
        }

        // --------------------------------------------------------------------------
        // User cancel the delete action
        // --------------------------------------------------------------------------
        const handleSelect = () => {
            consoleLog('AITagAttributeSingle.vue/handleSelect', 2, 'Select a record', trace.value)
            recordSelected.value = !recordSelected.value
            context.emit('selectrecord', tagattributeID.value)
        }


        // --------------------------------------------------------------------------
        // User want to insert record(s)
        // --------------------------------------------------------------------------
        const handleInsert = () => {
            consoleLog('AITagAttributeSingle.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
            context.emit('handleinsert', aitagattribute.value.position)
        }

        // --------------------------------------------------------------------------
        // User want to copy record(s)
        // --------------------------------------------------------------------------
        const handleCopy = () => {
            consoleLog('AITagAttributeSingle.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
            context.emit('handlecopy', aitagattribute.value.position)
        }

        // --------------------------------------------------------------------------
        // User want to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = () => {
            consoleLog('AITagAttributeSingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
            context.emit('handlemove', aitagattribute.value.position)
        }



        return {
            showDetails, tagattributeID, aitagattribute, actionAllowed, showPopup, recordSelected,
            handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete,
            handleSelect, handleInsert, handleCopy, handleMove, handleRestore
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