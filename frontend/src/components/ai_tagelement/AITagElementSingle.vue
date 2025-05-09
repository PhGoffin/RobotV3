<template>
    <div v-if="showPopup">
        <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
    </div>
    <div v-if="showPopupGeneric">
        <PopupConfirm @close="handleCancelGeneric" @confirm="handleConfirmGeneric" />
    </div>

    <div :class="recordSelected ? 'entity selected' : (aitagelement.active ? 'entity' : 'entity inactive')">

        <div class="actions">

            <h3 @click="showDetails = !showDetails" title="Click to show details" class="data">
                {{ aitagelement.fullPath }} - {{ aitagelement.selectorName }}
            </h3>

            <div class="actions">

                <div class="icons">
                    <i class="fa-solid fa-file-import" :class="classColor" @click="handleConfirmationGeneric"
                        title="Select this Element for the generic pattern and remove the other ones"></i>
                </div>


                <div class="actions">
                    <div class="icons" v-if="actionAllowed">
                        <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the element"></i>
                    </div>
                </div>

                <div class="icons" v-if="actionAllowed">
                    <i>&nbsp;</i>
                </div>

                <div class="icons" v-if="actionAllowed">
                    <router-link :to="{ name: 'AITagAttribute', params: { id: aitagelement.tagelementID } }"
                        @click="handleTagAttribute">
                        <i class="fa-solid fa-table-cells"
                            title="Display attributes detected during the training session"></i>
                    </router-link>
                </div>

            </div>

        </div>
        <div class="details" v-if="showDetails">
            <p>ID: {{ aitagelement.tagelementID }} </p>
            <p>PathID: {{ aitagelement.pathID }}</p>
        </div>

    </div>
</template>

<script>
import { ref } from 'vue'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'
import getAI_TagElementByPattern from '../../composables/ai_tagelement/getAI_TagElementByPattern'


export default {
    props: ['trace', 'id', 'aitagelement', 'superUser'],
    components: { PopupConfirm },

    setup(props, context) {
        const trace = ref(props.trace)

        displayMsg('AITagElementSingle.vue', trace.value)
        consoleLog('AITagElementSingle.vue - props', 1, props, trace.value)

        const showDetails = ref(false)
        const showPopup = ref(false)
        const showPopupGeneric = ref(false)
        const aitagelement = ref(props.aitagelement)
        const IamSuperUser = ref(props.superUser)
        const actionAllowed = ref(true)
        const tagelementID = ref(aitagelement.value.tagelementID)
        const recordSelected = ref(false)
        const classColor = ref('')
        const pattern = ref([])


        // ----------------------------------------------------------
        // Check if the tagelement is linked to an existing pattern
        // ----------------------------------------------------------
        const { error, getTheAI_TagElement } = getAI_TagElementByPattern(tagelementID.value)
        getTheAI_TagElement(pattern)
            .then(function () {
                // check the status of the load
                consoleLog('AITagElementSingle.vue/getAI_TagElementByPattern', 2, 'Tag Element Load status: ' + pattern.value.success, trace.value)
                if (pattern.value.data.length) {
                    consoleLog('AITagElementSingle.vue/getAI_TagElementByPattern', 2, 'Pattern found', trace.value)
                    classColor.value = 'blue'
                    return (1)
                } else {
                    consoleLog('AITagElementSingle.vue/getAI_TagElementByPattern', 2, 'No Pattern found!', trace.value)
                    classColor.value = ''
                    return (0)
                }
            })

        // -------------------------------------------
        // User asks to delete a aitagelement
        // -------------------------------------------
        const handelDelete = () => {
            consoleLog('AITagElementSingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
            context.emit('handledelete', aitagelement.value.tagelementID)
        }

        // --------------------------------------------------------------------------
        // User cancel the delete action
        // --------------------------------------------------------------------------
        const handleConfirmation = () => {
            consoleLog('AITagElementSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
            showPopup.value = true
        }

        // --------------------------------------------------------------------------
        // User cancel the delete action
        // --------------------------------------------------------------------------
        const handleCancelDelete = () => {
            consoleLog('AITagElementSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
            showPopup.value = false
        }


        // --------------------------------------------------------------------------
        // User confirm the delete action
        // --------------------------------------------------------------------------
        const handleConfirmDelete = () => {
            consoleLog('AITagElementSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
            showPopup.value = false
            handelDelete()
        }

        // --------------------------------------------------------------------------
        // User asks to go to the tag attributes
        // --------------------------------------------------------------------------
        const handleTagAttribute = () => {
            consoleLog('AITagElementSingle.vue/handleTagAttribute', 2, 'User asks to go to the tag attributes', trace.value)
            // Syntax is: tagelement=<tagelementID>
            context.emit('storelocation', 'tagelement=' + aitagelement.value.trainingID)
        }

        // --------------------------------------------------------------------------
        // Process the tag element as a generic pattern
        // --------------------------------------------------------------------------
        const handleGeneric = () => {
            consoleLog('AITagElementSingle.vue/handleGeneric', 2, 'Process the tag element as a generic pattern', trace.value)
            context.emit('handlegeneric', aitagelement.value.tagelementID)
        }

        // -------------------------------------------------------------------------------
        // User aks to select the tag elements a generic pattern, ask for a confirmation
        // -------------------------------------------------------------------------------
        const handleConfirmationGeneric = () => {
            consoleLog('AITagElementSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to generic pattern', trace.value)
            showPopupGeneric.value = true
        }

        // --------------------------------------------------------------------------
        // User cancel the selection of a generic pattern action
        // --------------------------------------------------------------------------
        const handleCancelGeneric = () => {
            consoleLog('AITagElementSingle.vue/handleCancelDelete', 2, 'Cancel the generic pattern', trace.value)
            showPopupGeneric.value = false
        }


        // --------------------------------------------------------------------------
        // User confirm the selection of a generic pattern action
        // --------------------------------------------------------------------------
        const handleConfirmGeneric = () => {
            consoleLog('AITagElementSingle.vue/handleConfirmDelete', 2, 'Confirm the generic pattern', trace.value)
            showPopupGeneric.value = false
            handleGeneric()
        }



        return {
            showDetails, tagelementID, aitagelement, actionAllowed, showPopup, showPopupGeneric, recordSelected, classColor,
            handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete, handleTagAttribute,
            handleGeneric, handleCancelGeneric, handleConfirmGeneric, handleConfirmationGeneric
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

.actions i.blue {
    font-size: 24px;
    margin-left: 10px;
    color: #072af5;
    cursor: pointer;
}

.actions i:hover {
    color: #777;
}
</style>