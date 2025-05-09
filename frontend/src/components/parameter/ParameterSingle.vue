<template>
    <div v-if="showPopup">
        <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
    </div>

    <div :class="recordSelected ? 'entity selected' : (parameter.active ? 'entity' : 'entity inactive')">

        <div class="actions">

            <h3 @click="showDetails = !showDetails" title="Click to show details" class="data">
                <i class="fa-regular fa-pen-to-square" title="You can edit this value" style="color: blue;"
                    v-if="parameter.code == 'Reference' && parameter.inputoutput == '1'"></i>
                <i class="fa-solid fa-circle-info" title="Just for your information" style="color: blue;"
                    v-if="parameter.code == 'Reference' && parameter.inputoutput == '0'"></i>
                &nbsp;
                {{ parameter.code }} - {{ parameter.paramValue }}
            </h3>

            <div class="actions">

                <div class="actions">
                    <div class="icons" v-if="actionAllowed">
                        <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the parameter"></i>
                    </div>

                    <div class="icons" v-if="actionAllowed">
                        <router-link :to="{ name: 'ParameterEdit', params: { id: parameterID } }">
                            <i class="fa-regular fa-pen-to-square" title="Edit the parameter"></i>
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
            <p>
                {{ parameter.comment }}
            </p>
            <p v-if="parameter.code == 'Reference' && parameter.inputoutput == '1'">Use: Input</p>
            <p v-if="parameter.code == 'Reference' && parameter.inputoutput == '0'">Use: Output</p>
        </div>

    </div>
</template>

<script>
import { ref } from 'vue'
import deleteParameter from '../../composables/parameter/deleteParameter'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'


export default {
    props: ['trace', 'parameter', 'superUser'],
    components: { PopupConfirm },

    setup(props, context) {
        const trace = ref(props.trace)

        displayMsg('ParameterSingle.vue', trace.value)
        consoleLog('ParameterSingle.vue - props', 1, props, trace.value)

        const showDetails = ref(false)
        const showPopup = ref(false)
        const parameter = ref(props.parameter)
        const IamSuperUser = ref(props.superUser)
        const actionAllowed = ref(true)
        const parameterID = ref(parameter.value.parameterID)
        const recordSelected = ref(false)

        //if (parameter.value.code == 'Reference' && parameter.value.inputoutput == '0') actionAllowed.value = (false)


        // -------------------------------------------
        // User asks to delete a parameter
        // -------------------------------------------
        const handelDelete = () => {
            consoleLog('ParameterSingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
            context.emit('handledelete', parameter.value.parameterID)
        }

        // --------------------------------------------------------------------------
        // User cancel the delete action
        // --------------------------------------------------------------------------
        const handleConfirmation = () => {
            consoleLog('ParameterSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
            showPopup.value = true
        }

        // --------------------------------------------------------------------------
        // User cancel the delete action
        // --------------------------------------------------------------------------
        const handleCancelDelete = () => {
            consoleLog('ParameterSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
            showPopup.value = false
        }


        // --------------------------------------------------------------------------
        // User confirm the delete action
        // --------------------------------------------------------------------------
        const handleConfirmDelete = () => {
            consoleLog('ParameterSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
            showPopup.value = false
            handelDelete()
        }

        // --------------------------------------------------------------------------
        // User cancel the delete action
        // --------------------------------------------------------------------------
        const handleSelect = () => {
            consoleLog('ParameterSingle.vue/handleSelect', 2, 'Select a record', trace.value)
            recordSelected.value = !recordSelected.value
            context.emit('selectrecord', parameterID.value)
        }


        // --------------------------------------------------------------------------
        // User want to insert record(s)
        // --------------------------------------------------------------------------
        const handleInsert = () => {
            consoleLog('ParameterSingle.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
            context.emit('handleinsert', parameter.value.position)
        }

        // --------------------------------------------------------------------------
        // User want to copy record(s)
        // --------------------------------------------------------------------------
        const handleCopy = () => {
            consoleLog('ParameterSingle.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
            context.emit('handlecopy', parameter.value.position)
        }

        // --------------------------------------------------------------------------
        // User want to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = () => {
            consoleLog('ParameterSingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
            context.emit('handlemove', parameter.value.position)
        }

        return {
            showDetails, parameterID, parameter, actionAllowed, showPopup, recordSelected,
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