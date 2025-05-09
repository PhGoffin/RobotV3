<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div
    :class="recordSelected ? 'entity selected' : (!reference.active ? 'entity inactive' : (reference.active == 1 ? 'entity' : 'entity comment'))">

    <div class="actions">

      <h3 @click="showDetails = !showDetails" title="Click to show details" class="data">
        <i class="fa-regular fa-pen-to-square" title="You can edit this value" style="color: blue;"
          v-if="reference.inputoutput == '1'"></i>
        <i class="fa-solid fa-circle-info" title="Just for your information" style="color: blue;"
          v-if="reference.inputoutput == '0'"></i>
          &nbsp;
        {{ reference.code }} - {{ reference.label }}
      </h3>

      <div class="actions">

        <div class="icons" v-if="importData && display">
          <router-link :to="{ name: 'ParameterEdit', params: { id: parameterID, location: 'reference' } }"
            @click="handleImport">
            <i class="fa-solid fa-file-import" :class="classColor" @click="handleImport()"
              title="Use this reference in your parameter"></i>
          </router-link>
        </div>

        <div class="icons" v-if="testID && display">
          <router-link :to="{ name: 'TestEdit', params: { id: testID, location: 'reference' } }"
            @click="handleImportTest">
            <i class="fa-solid fa-file-import" :class="classColor" @click="handleImportTest()"
              title="Use this reference in your test"></i>
          </router-link>
        </div>



        <div class="actions">
          <div class="icons" v-if="actionAllowed && display">
            <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the reference"></i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <router-link
              :to="{ name: 'ReferenceEdit', params: { id: referenceID, currentuser: currentUser, userName: currentUser } }">
              <i class="fa-regular fa-pen-to-square" title="Edit the reference"></i>
            </router-link>
          </div>

          <div class="icons" v-if="actionAllowed && display">
            <i class="fa-solid fa-plus" @click="handleInsert" title="Insert after this row"></i>
          </div>

          <div class="icons" v-if="actionAllowed && display">
            <i>&nbsp;</i>
          </div>


          <div class="icons" v-if="actionAllowed && display">
            <i class="fa-solid fa-copy" @click="handleCopy" title="Copy after this row"></i>
          </div>

          <div class="icons" v-if="actionAllowed && display">
            <i class="fa-solid fa-down-left-and-up-right-to-center" @click="handleMove" title="Move after this row"></i>
          </div>

          <div class="icons" v-if="actionAllowed && display">
            <input type="checkbox" name="selection" class="input checkbox" @change="handleSelect"
              title="Check to indicate the row(s) to Copy or Move" />
          </div>

        </div>

      </div>

    </div>
    <div class="details" v-if="showDetails">
      <p>{{ reference.comment }}</p>
      <p>ID: {{ reference.referenceID }}</p>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue'
import deleteReference from '../../composables/reference/deleteReference'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'


export default {
  props: ['trace', 'reference', 'superUser', 'userID', 'projectID', 'currentuser', 'location'],

  components: { PopupConfirm },

  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('ReferenceSingle.vue', trace.value)
    consoleLog('ReferenceSingle.vue - props', 1, props, trace.value)

    const location = ref(props.location)
    const showDetails = ref(false)
    const showPopup = ref(false)
    const reference = ref(props.reference)
    const IamSuperUser = ref(props.superUser)
    const currentUser = ref(props.currentuser)
    const actionAllowed = ref(true)
    const referenceID = ref(reference.value.referenceID)
    const referenceCode = ref(reference.value.code)
    const projectID = ref(props.projectID)
    const userID = ref(props.userID)
    const recordSelected = ref(false)
    const importData = ref(false)
    const importTest = ref(false)
    const storyheaderID = ref(0)
    const parameterID = ref(0)
    const testID = ref(0)
    const testParamID = ref(0)
    const testParam1 = ref('')
    const testParam2 = ref('')
    const testParam3 = ref('')
    const testParam4 = ref('')
    const display = ref(true)

    if (reference.value.inputoutput == '0') actionAllowed.value = false
    if (reference.value.inputoutput == '0' || reference.value.inputoutput == '1') display.value = false

    if (location.value.includes('parameter=')) {
      let data = location.value.split("=");
      storyheaderID.value = data[1]
      parameterID.value = data[2]
      actionAllowed.value = false
      importData.value = true

    } else if (location.value.includes('test=')) {
      // split the location to find the keyword
      let data = location.value.split("=");
      //console.log('Data: ', data)

      if (data[1] != undefined && data[3] != undefined) {
        testID.value = data[1]
        testParamID.value = data[3]
        testParam1.value = data[4]
        testParam2.value = data[5]
        testParam3.value = data[6]
        testParam4.value = data[7]
      }
    }


    // -------------------------------------------
    // User asks to delete a reference
    // -------------------------------------------
    const handelDelete = () => {
      consoleLog('ReferenceSingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
      context.emit('handledelete', reference.value.referenceID)
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleConfirmation = () => {
      consoleLog('ReferenceSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
      showPopup.value = true
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleCancelDelete = () => {
      consoleLog('ReferenceSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
      showPopup.value = false
    }


    // --------------------------------------------------------------------------
    // User confirm the delete action
    // --------------------------------------------------------------------------
    const handleConfirmDelete = () => {
      consoleLog('ReferenceSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
      showPopup.value = false
      handelDelete()
    }

    // --------------------------------------------------------------------------
    // User selects a record
    // --------------------------------------------------------------------------
    const handleSelect = () => {
      consoleLog('ReferenceSingle.vue/handleSelect', 2, 'Select a record', trace.value)
      recordSelected.value = !recordSelected.value
      context.emit('selectrecord', referenceID.value)
    }


    // --------------------------------------------------------------------------
    // User want to insert record(s)
    // --------------------------------------------------------------------------
    const handleInsert = () => {
      consoleLog('ReferenceSingle.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      context.emit('handleinsert', reference.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to copy record(s)
    // --------------------------------------------------------------------------
    const handleCopy = () => {
      consoleLog('ReferenceSingle.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', reference.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to move record(s)
    // --------------------------------------------------------------------------
    const handleMove = () => {
      consoleLog('ReferenceSingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', reference.value.position)
    }

    // -------------------------------------------------
    // User asks to use this reference in the parameter
    // -------------------------------------------------
    const handleImport = () => {
      consoleLog('ReferenceSingle.vue/handleImport', 2, 'Emit event to select this reference in the the parameter of the storyheader ' + storyheaderID.value, trace.value)
      context.emit('storelocation', 'reference=' + referenceCode.value + '=' + storyheaderID.value)
    }


    // -------------------------------------------------
    // User asks to use this reference in the test
    // -------------------------------------------------
    const handleImportTest = () => {
      consoleLog('ReferenceSingle.vue/handleImportTest', 2, 'Emit event to reference in the test scenario: ' + testID.value + ' paramID: ' + testParamID.value, trace.value)
      switch (testParamID.value) {
        case '1':
          testParam1.value = reference.value.code
          break
        case '2':
          testParam2.value = reference.value.code
          break
        case '3':
          testParam3.value = reference.value.code
          break
        case '4':
          testParam4.value = reference.value.code
          break
      }

      // Syntax is: dictionary=<testID>=<parameterID>=<param1>=<param2>=<param3>
      context.emit('storelocation', 'reference=' + testID.value + "=" + testParamID.value + '=' + testParam1.value + '=' + testParam2.value + '=' + testParam3.value + '=' + testParam4.value)
    }


    return {
      showDetails, projectID, userID, currentUser, reference, referenceID, actionAllowed,
      showPopup, recordSelected, importData, parameterID, testID, display,
      handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete,
      handleSelect, handleInsert, handleCopy, handleMove, handleImport, handleImportTest
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
}
</style>