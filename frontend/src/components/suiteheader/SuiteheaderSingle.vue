<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div
    :class="recordSelected ? 'entity selected' : (!suiteheader.active ? 'entity inactive' : (suiteheader.active == 1 ? 'entity' : 'entity comment'))">

    <div class="actions">

      <h3 @click="showDetails = !showDetails" title="Click to show details" class="data">
        {{ suiteheader.label }}
      </h3>

      <div class="actions">

        <div class="icons" v-if="importData">
          <router-link :to="{ name: 'StoryEdit', params: { id: storyID, location: 'suite' } }" @click="handleImport">
            <i class="fa-solid fa-file-import" :class="classColor" @click="handleImport"
              title="Use this suite in your Story"></i>
          </router-link>
        </div>

        <div class="actions">
          <div class="icons" v-if="!importData">
            <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the Suite set"></i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <router-link :to="{ name: 'SuiteheaderEdit', params: { id: suiteheaderID } }">
              <i class="fa-regular fa-pen-to-square" title="Edit the Suite set"></i>
            </router-link>
          </div>

          <div class="icons" v-if="!importData">
            <i class="fa-solid fa-plus" @click="handleInsert" title="Insert after this row"></i>
          </div>

          <div class="icons" v-if="!importData">
            <i>&nbsp;</i>
          </div>


          <div class="icons" v-if="!importData">
            <i class="fa-solid fa-copy" @click="handleCopy" title="Copy after this row"></i>
          </div>

          <div class="icons" v-if="!importData">
            <i class="fa-solid fa-down-left-and-up-right-to-center" @click="handleMove" title="Move after this row"></i>
          </div>

          <div class="icons" v-if="!importData">
            <input type="checkbox" name="selection" class="input checkbox" @change="handleSelect"
              title="Check to indicate the row(s) to Copy or Move" />
          </div>

          <div class="icons" v-if="!importData">
            <i>&nbsp;</i>
          </div>

          <div class="icons" v-if="!importData">
            <router-link :to="{ name: 'Suites', params: { id: suiteheaderID } }">
              <i class="fa-solid fa-map" title="Goto Suite"></i>
            </router-link>
          </div>

          <div class="icons" v-if="!importData">
            <i>&nbsp;</i>
          </div>

          <div class="icons" v-if="!importData && suiteError">
            <i class="fa-solid fa-solid fa-rotate" :class="classColor" @click="handleResetError"
              title="Reset the error, to start the suite from the begining"></i>
          </div>

          <div class="icons" v-if="!importData && !executing">
            <i class="fa-regular fa-circle-play" @click="handleExecute" title="Execute the suite"></i>
          </div>

          <div class="icons" v-if="executing">
            <Spinner />
          </div>


        </div>

      </div>

    </div>
    <div class="details" v-if="showDetails">
      <p>ID: {{ suiteheader.suiteheaderID }}</p>
      <p>{{ suiteheader.comment }} Position: {{ suiteheader.position }}</p>
      <p>Updated by: {{ suiteheader.updatedby }} on: {{ suiteheader.updated }}</p>

    </div>

  </div>
</template>

<script>
import { ref } from 'vue'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'
import executeSuite from '../../composables/selenium/executeSuite'
import getReferenceByCode from '../../composables/reference/getReferenceByCode'
import storeReference from '../../composables/reference/storeReference'

import Spinner from '../../components/Spinner.vue'


export default {
  props: ['trace', 'suiteheader', 'superUser', 'userID', 'currentuser', 'projectID', 'subprojectID', 'location'],

  components: { Spinner, PopupConfirm },

  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('SuiteheaderSingle.vue', trace.value)
    consoleLog('SuiteheaderSingle.vue - props', 1, props, trace.value)

    const showDetails = ref(false)
    const showPopup = ref(false)
    const suiteheader = ref(props.suiteheader)
    const suiteName = ref(suiteheader.value.label)
    const location = ref(props.location)
    const IamSuperUser = ref(props.superUser)
    const actionAllowed = ref(true)
    const suiteheaderID = ref(suiteheader.value.suiteheaderID)
    const projectID = ref(props.projectID)
    const subprojectID = ref(props.subprojectID)
    const userID = ref(props.userID)
    const userName = ref(props.currentuser)
    const recordSelected = ref(false)
    const storyID = ref(0)
    const importData = ref(false)
    const comment = ref(suiteheader.value.comment)

    const code = 'Suite Error ' + suiteheaderID.value
    const suiteError = ref('')
    const selenium = ref([])
    const suiteID = ref(suiteheader.value.suiteheaderID)
    const executing = ref(0)
    const reference = ref([])

    const classColor = ref('blue')

    // --------------------------------------------------------------------
    // Check if we come from the story screen or for the control panel
    // format: story=<storyID> 
    // --------------------------------------------------------------------
    if (location.value != undefined) {
      if (location.value.includes('story=')) {
        // split the location to find the keywords
        let data = location.value.split("=");
        //console.log(data)
        if (data[0] != undefined) {
          storyID.value = data[1]
          importData.value = true
        }
      }
    }

    // ------------------------------------------------------------
    // Read the status of the suite
    // ------------------------------------------------------------
    const { error1, loadReference } = getReferenceByCode(projectID.value, userID.value, code)
    loadReference(reference, trace.value)
      .then(function () {
        consoleLog('SuiteSingle.vue/loadReference', 2, 'Code: ' + code, trace.value)
        if (reference.value.success && reference.value.data.length) {
          reference.value = reference.value.data
          suiteError.value = reference.value[0].label
          consoleLog('SuiteSingle/loadReference', 2, 'Label: ' + suiteError.value, trace.value)
          if (suiteError.value == '<N/A>') suiteError.value = ''
        } else {
          consoleLog('SuiteSingle/loadReference', 2, 'No reference found!', trace.value)
          suiteError.value = ''
        }
      })


    // ------------------------------------------------------------
    // User asks to reset the error to fully execute the suite
    // ------------------------------------------------------------
    const handleResetError = async () => {
      consoleLog('SuiteSingle.vue/handleResetError', 2, 'User asks to reset the suite error', trace.value)
      // code, label, comment, projectID, userID
      // const { error1, storeTheReference } = storeReference(code, '<N/A>', '', projectID.value, userID.value)
      // storeTheReference(reference, trace.value)
      //   .then(function () {
      //     consoleLog('SuiteSingle.vue/handleResetError', 2, 'Code: ' + code, trace.value)
      //     if (reference.value.success) {
      //       consoleLog('SuiteSingle/handleResetError', 2, 'Label: ' + suiteError.value, trace.value)
      //       context.emit('refreshsuiteheaders', 1, 'Suite Reset!', 1)
      //       suiteError.value  = ''            
      //     } else {
      //       consoleLog('SuiteSingle/handleResetError', 2, 'No reference found!', trace.value)
      //       context.emit('refreshsuiteheaders', 0, 'Error during the suite reset!', 1)            
      //     }
      //   })
      let success = storeReference(code, '<N/A>', '', projectID.value, userID.value, trace.value)
      if (success) {
        consoleLog('SuiteSingle/handleResetError', 2, 'Label: ' + suiteError.value, trace.value)
        context.emit('refreshsuiteheaders', 1, 'Suite Reset!', 1)
        suiteError.value = ''
      } else {
        consoleLog('SuiteSingle/handleResetError', 2, 'No reference found!', trace.value)
        context.emit('refreshsuiteheaders', 0, 'Error during the suite reset!', 1)
      }
    }


    // ------------------------------------------------------------
    // User asks to use this suite in the story
    // ------------------------------------------------------------
    const handleImport = () => {
      consoleLog('SuiteSingle.vue/handleImport', 2, 'Emit event to select this suite in the story: ' + storyID.value, trace.value)
      // Syntax is: suite=<storyID>=<suiteID>=<comment>
      context.emit('storelocation', 'suite=' + storyID.value + '=' + suiteheaderID.value + '=' + comment.value)
    }



    // --------------------------------------------------------------------------
    // User wants to execute a suite
    // --------------------------------------------------------------------------
    const handleExecute = async () => {

      consoleLog('SuiteheaderSingle.vue/handleExecute', 2, 'User want to execute a suite: ' + suiteName.value, trace.value)
      // Display an info message in the Scenarios.vue
      context.emit('refreshsuiteheaders', 1, "let's start a test!", 0)
      executing.value = 1 // Show the spinner
      const { error, execSuite } = executeSuite(suiteName.value, suiteID.value, projectID.value, subprojectID.value, userID.value, userName.value)
      await execSuite(selenium, trace.value)
        .then(function () {
          consoleLog('SuiteheaderSingle.vue/handleExecute', 2, '------ suiteID: ' + suiteID.value + ', userID: ' + userID.value, trace.value)
          consoleLog('SuiteheaderSingle.vue/handleExecute', 2, selenium, trace.value)
          consoleLog('SuiteheaderSingle.vue/handleExecute', 2, 'Status: ' + selenium.value.success, trace.value)
          executing.value = 0 // Hide the spinner
          if (selenium.value.success) {
            context.emit('refreshsuiteheaders', 1, selenium.value.message, 1)
            consoleLog('SuiteheaderSingle.vue/handleExecute', 2, 'Ok: ' + selenium.value.message, trace.value)
          } else {
            context.emit('refreshsuiteheaders', 0, selenium.value.message, 1)
            consoleLog('SuiteheaderSingle.vue/handleExecute', 2, 'KO: ' + selenium.value.message, trace.value)
          }
        })
    }



    // -------------------------------------------
    // User asks to delete a suiteheader
    // -------------------------------------------
    const handelDelete = () => {
      consoleLog('SuiteheaderSingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
      context.emit('handledelete', suiteheader.value.suiteheaderID)
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleConfirmation = () => {
      consoleLog('SuiteheaderSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
      showPopup.value = true
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleCancelDelete = () => {
      consoleLog('SuiteheaderSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
      showPopup.value = false
    }


    // --------------------------------------------------------------------------
    // User confirm the delete action
    // --------------------------------------------------------------------------
    const handleConfirmDelete = () => {
      consoleLog('SuiteheaderSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
      showPopup.value = false
      handelDelete()
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleSelect = () => {
      consoleLog('SuiteheaderSingle.vue/handleSelect', 2, 'Select a record', trace.value)
      recordSelected.value = !recordSelected.value
      context.emit('selectrecord', suiteheaderID.value)
    }


    // --------------------------------------------------------------------------
    // User want to insert record(s)
    // --------------------------------------------------------------------------
    const handleInsert = () => {
      consoleLog('SuiteheaderSingle.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      context.emit('handleinsert', suiteheader.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to copy record(s)
    // --------------------------------------------------------------------------
    const handleCopy = () => {
      consoleLog('SuiteheaderSingle.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', suiteheader.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to move record(s)
    // --------------------------------------------------------------------------
    const handleMove = () => {
      consoleLog('SuiteheaderSingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', suiteheader.value.position)
    }



    return {
      showDetails, projectID, userID, suiteheader, suiteheaderID, actionAllowed, showPopup,
      recordSelected, storyID, importData, classColor, importData, executing, suiteError,
      handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete,
      handleSelect, handleInsert, handleCopy, handleMove, handleImport, handleExecute, handleResetError
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