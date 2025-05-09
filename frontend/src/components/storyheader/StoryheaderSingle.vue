<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div
    :class="recordSelected ? 'entity selected' : (!storyheader.active ? 'entity inactive' : (storyheader.active == 1 ? 'entity' : 'entity publish'))">

    <div class="actions">

      <h3 @click="showDetails = !showDetails" title="Click to show details" class="data">
        {{ storyheader.label }}
      </h3>

      <div class="actions">


        <div class="actions">
          <div class="icons" v-if="actionAllowed">
            <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the Story set"></i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <router-link :to="{ name: 'StoryheaderEdit', params: { id: storyheaderID } }">
              <i class="fa-regular fa-pen-to-square" title="Edit the Story set"></i>
            </router-link>
          </div>

          <div class="icons" v-if="actionAllowed">
            <i class="fa-solid fa-plus" @click="handleInsert" title="Insert after this row"></i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <i class="fa-solid fa-hammer" @click="handleParameter" title="Parameters"></i>
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


          <div class="icons" v-if="actionAllowed">
            <i>&nbsp;</i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <router-link :to="{ name: 'Stories', params: { id: storyheaderID } }">
              <i class="fa-solid fa-list-check" title="Goto Stories" @click="handleGotoStory"></i>
            </router-link>
          </div>

          <div class="icons" v-if="actionAllowed">
            <i>&nbsp;</i>
          </div>

          <div class="icons" v-if="!importData && storyErrorID">
            <i class="fa-solid fa-solid fa-rotate" :class="classColor" @click="handleResetError"
              title="Reset the error, to start the story from the begining"></i>
          </div>

          <div class="icons" v-if="actionAllowed && !executing">
            <i class="fa-regular fa-circle-play" @click="handleExecute" title="Execute the story"></i>
          </div>

          <div class="icons" v-if="executing">
            <Spinner />
          </div>


        </div>

      </div>

    </div>
    <div class="details" v-if="showDetails">
      <p> ID: {{ storyheader.storyheaderID }}</p>
      <p> {{ storyheader.comment }}</p>
      <p>Updated by: {{ storyheader.updatedby }} on: {{ storyheader.updated }}</p>
      <p v-if="storyheader.active == 2">Published</p>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'
import executeAllStories from '../../composables/selenium/executeAllStories'
import getReferenceByCode from '../../composables/reference/getReferenceByCode'
import storeReference from '../../composables/reference/storeReference'
import Spinner from '../../components/Spinner.vue'


export default {
  props: ['trace', 'storyheader', 'superUser', 'userID', 'currentuser', 'projectID', 'subprojectID', 'location'],

  components: { Spinner, PopupConfirm },

  setup(props, context) {
    const router = useRouter()
    const trace = ref(props.trace)

    displayMsg('StoryheaderSingle.vue', trace.value)
    consoleLog('StoryheaderSingle.vue - props', 1, props, trace.value)

    const showDetails = ref(false)
    const showPopup = ref(false)
    const storyheader = ref(props.storyheader)
    const storyName = ref(storyheader.value.label)
    const location = ref(props.location)
    const IamSuperUser = ref(props.superUser)
    const actionAllowed = ref(true)
    const storyheaderID = ref(storyheader.value.storyheaderID)
    const projectID = ref(props.projectID)
    const subprojectID = ref(props.subprojectID)
    const userID = ref(props.userID)
    const userName = ref(props.currentuser)
    const recordSelected = ref(false)

    const selenium = ref([])
    const executing = ref(0)
    const code = 'Story Status ' + subprojectID.value + '/' + storyheaderID.value
    const storyErrorID = ref('')
    const storyStatus = ref('')
    const reference = ref([])

    const classColor = ref('blue')

    // ------------------------------------------------------------
    // Read the status of the suite
    // ------------------------------------------------------------
    const { error1, loadReference } = getReferenceByCode(projectID.value, userID.value, code)
    loadReference(reference, trace.value)
      .then(function () {
        consoleLog('StoryheaderSingle.vue/loadReference', 2, 'Code: ' + code, trace.value)
        if (reference.value.success && reference.value.data.length) {
          reference.value = reference.value.data
          let dataRef = reference.value[0].label.split("=");
          storyStatus.value = dataRef[0]
          storyErrorID.value = dataRef[1]
          consoleLog('StoryheaderSingle/loadReference', 2, 'Status:' + storyStatus.value + 'Label: ' + storyErrorID.value, trace.value)
          if (storyStatus.value == 'OK') storyErrorID.value = ''
        } else {
          consoleLog('StoryheaderSingle/loadReference', 2, 'No reference found!', trace.value)
          storyErrorID.value = ''
        }
      })


    // ------------------------------------------------------------
    // User asks to reset the error to fully execute the suite
    // ------------------------------------------------------------
    const handleResetError = async () => {
      consoleLog('StoryheaderSingle.vue/handleResetError', 2, 'User asks to reset the suite error', trace.value)
      let success = storeReference(code, '<N/A>', '', projectID.value, userID.value, trace.value)
      if (success) {
        //consoleLog('StoryheaderSingle/handleResetError', 2, 'Label: ' + suiteError.value, trace.value)
        context.emit('refreshsuiteheaders', 1, 'Suite Reset!', 1)
        storyErrorID.value = ''
      } else {
        consoleLog('StoryheaderSingle/handleResetError', 2, 'No reference found!', trace.value)
        context.emit('refreshsuiteheaders', 0, 'Error during the suite reset!', 1)
      }
    }




    // --------------------------------------------------------------------------
    // User wants to execute a suite
    // --------------------------------------------------------------------------
    const handleExecute = async () => {

      consoleLog('StoryheaderSingle.vue/handleExecute', 2, 'User want to execute a story: ' + storyName.value, trace.value)
      // Display an info message in the Scenarios.vue
      context.emit('refreshstoryheaders', 1, "let's start a test!", 0)
      executing.value = 1 // Show the spinner
      // storyName, storyID, projectID, subprojectID, userID
      const { error, execStory } = executeAllStories(storyName.value, storyheaderID.value, projectID.value, subprojectID.value, userID.value, userName.value)
      await execStory(selenium, trace.value)
        .then(function () {
          consoleLog('StoryheaderSingle.vue/handleExecute', 2, '------ storyheaderID: ' + storyheaderID.value + ', userID: ' + userID.value, trace.value)
          consoleLog('StoryheaderSingle.vue/handleExecute', 2, selenium, trace.value)
          consoleLog('StoryheaderSingle.vue/handleExecute', 2, 'Status: ' + selenium.value.success, trace.value)
          executing.value = 0 // Hide the spinner
          if (selenium.value.success) {
            context.emit('refreshstoryheaders', 1, selenium.value.message, 1)
            consoleLog('StoryheaderSingle.vue/handleExecute', 2, 'Ok: ' + selenium.value.message, trace.value)
          } else {
            context.emit('refreshstoryheaders', 0, selenium.value.message, 1)
            consoleLog('StoryheaderSingle.vue/handleExecute', 2, 'KO: ' + selenium.value.message, trace.value)
          }
        })
    }

    // -------------------------------------------
    // User asks to delete a storyheader
    // -------------------------------------------
    const handelDelete = () => {
      consoleLog('StoryheaderSingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
      context.emit('handledelete', storyheader.value.storyheaderID)
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleConfirmation = () => {
      consoleLog('StoryheaderSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
      showPopup.value = true
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleCancelDelete = () => {
      consoleLog('StoryheaderSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
      showPopup.value = false
    }


    // --------------------------------------------------------------------------
    // User confirm the delete action
    // --------------------------------------------------------------------------
    const handleConfirmDelete = () => {
      consoleLog('StoryheaderSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
      showPopup.value = false
      handelDelete()
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleSelect = () => {
      consoleLog('StoryheaderSingle.vue/handleSelect', 2, 'Select a record', trace.value)
      recordSelected.value = !recordSelected.value
      context.emit('selectrecord', storyheaderID.value)
    }


    // --------------------------------------------------------------------------
    // User want to insert record(s)
    // --------------------------------------------------------------------------
    const handleInsert = () => {
      consoleLog('StoryheaderSingle.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      context.emit('handleinsert', storyheader.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to copy record(s)
    // --------------------------------------------------------------------------
    const handleCopy = () => {
      consoleLog('StoryheaderSingle.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', storyheader.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to move record(s)
    // --------------------------------------------------------------------------
    const handleMove = () => {
      consoleLog('StoryheaderSingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', storyheader.value.position)
    }


    // --------------------------------------------------------------------------
    // User want to manage the project parameter
    // --------------------------------------------------------------------------
    const handleParameter = () => {
      consoleLog('StoryheaderSingle.vue/handleParameter', 2, 'Ask for story parameters', trace.value)
      context.emit('storelocation', 'story=' + storyheaderID.value)
      router.push({ name: 'Parameters'})

    }


    return {
      showDetails, projectID, userID, storyheader, storyheaderID, actionAllowed,
      showPopup, recordSelected, storyErrorID, classColor, executing,
      handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete,
      handleSelect, handleInsert, handleCopy, handleMove, handleExecute, handleResetError, handleParameter
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

.entity.publish {
  position: relative;
  margin: 20px auto;
  background: rgb(226, 231, 238);
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #2300e9;
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