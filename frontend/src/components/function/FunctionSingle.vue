<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div :class="recordSelected ? 'entity selected' : (!testfunction.active ? 'entity inactive' : (testfunction.active == 1 ? 'entity' : 'entity comment'))">

    <div class="actions">

      <h3 @click="showDetails = !showDetails" title="Click to show details" class="data">
        {{ testfunction.functionName }} - {{ testfunction.comment }}
      </h3>

      <div class="actions">

        <div class="actions">
          <div class="icons" v-if="actionAllowed">
            <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the function"></i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <router-link :to="{ name: 'FunctionEdit', params: { id: testfunction.functionID } }">
              <i class="fa-regular fa-pen-to-square" title="Edit the function"></i>
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
            <i class="fa-solid fa-down-left-and-up-right-to-center" @click="handleMove" title="Move after this row"></i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <input type="checkbox" name="selection" class="input checkbox" @change="handleSelect"
              title="Check to indicate the row(s) to Copy or Move" />
          </div>

        </div>

      </div>

    </div>
    <div class="details" v-if="showDetails">
      <p v-if="testfunction.parameter1">1) {{ testfunction.parameter1 }}: {{ testfunction.tip1 }} > {{
        testfunction.defaultValue1 }} Natural: {{ testfunction.natural1 }}</p>
      <p v-if="testfunction.parameter2">2) {{ testfunction.parameter2 }}: {{ testfunction.tip2 }} > {{
        testfunction.defaultValue2 }} Natural: {{ testfunction.natural2 }}</p>
      <p v-if="testfunction.parameter3">3) {{ testfunction.parameter3 }}: {{ testfunction.tip3 }} > {{
        testfunction.defaultValue3 }} Natural: {{ testfunction.natural3 }}</p>
      <p v-if="testfunction.parameter4">4) {{ testfunction.parameter4 }}: {{ testfunction.tip4 }} > {{
        testfunction.defaultValue4 }} Natural: {{ testfunction.natural4 }}</p>

    </div>

  </div>
</template>
        
<script>
import { ref } from 'vue'
import deleteFunction from '../../composables/function/deleteFunction'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'


export default {
  props: ['trace', 'testfunction', 'superUser', 'userID', 'id'],

  components: { PopupConfirm },

  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('FunctionSingle.vue', trace.value)
    consoleLog('FunctionSingle.vue - props', 1, props, trace.value)

    const showDetails = ref(false)
    const showPopup = ref(false)
    const testfunction = ref(props.testfunction)
    const IamSuperUser = ref(props.superUser)
    const actionAllowed = ref(true)
    const functionID = ref(testfunction.value.functionID)
    const userID = ref(props.userID)
    const recordSelected = ref(false)


    // -------------------------------------------
    // User asks to delete a function
    // -------------------------------------------
    const handelDelete = () => {
      consoleLog('FunctionSingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
      context.emit('handledelete', testfunction.value.functionID)
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleConfirmation = () => {
      consoleLog('FunctionSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
      showPopup.value = true
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleCancelDelete = () => {
      consoleLog('FunctionSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
      showPopup.value = false
    }


    // --------------------------------------------------------------------------
    // User confirm the delete action
    // --------------------------------------------------------------------------
    const handleConfirmDelete = () => {
      consoleLog('FunctionSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
      showPopup.value = false
      handelDelete()
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleSelect = () => {
      consoleLog('FunctionSingle.vue/handleSelect', 2, 'Select a record', trace.value)
      recordSelected.value = !recordSelected.value
      context.emit('selectrecord', functionID.value)
    }


    // --------------------------------------------------------------------------
    // User want to insert record(s)
    // --------------------------------------------------------------------------
    const handleInsert = () => {
      consoleLog('FunctionSingle.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      context.emit('handleinsert', testfunction.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to copy record(s)
    // --------------------------------------------------------------------------
    const handleCopy = () => {
      consoleLog('FunctionSingle.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', testfunction.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to move record(s)
    // --------------------------------------------------------------------------
    const handleMove = () => {
      consoleLog('FunctionSingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', testfunction.value.position)
    }



    return {
      showDetails, userID, testfunction, functionID, actionAllowed, showPopup, recordSelected,
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


.entity.comment {
  position: relative;
  margin: 20px auto;
  background: rgb(238, 237, 226);
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid rgb(204, 202, 71);
  width: 80%;
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
}</style>