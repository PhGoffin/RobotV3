<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div
    :class="recordSelected ? 'entity selected' : (!dictionaryheader.active ? 'entity inactive' : (dictionaryheader.active == 1 ? 'entity' : 'entity comment'))">

    <div class="actions">

      <h3 @click="showDetails = !showDetails" title="Click to show details" class="data">
        {{ dictionaryheader.code }}
      </h3>

      <div class="actions">

        <div class="actions">
          <div class="icons" v-if="actionAllowed">
            <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the dictionary set"></i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <router-link :to="{ name: 'DictionaryheaderEdit', params: { id: dictionaryheaderID } }">
              <i class="fa-regular fa-pen-to-square" title="Edit the dictionary set"></i>
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

          <div class="icons" v-if="actionAllowed">
            <i>&nbsp;</i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <router-link :to="{ name: 'Dictionary', params: { id: dictionaryheaderID } }">
              <i class="fa-solid fa-spell-check" title="Goto Dictionary" @click="handleGotoDictionary"></i>
            </router-link>
          </div>

        </div>

      </div>

    </div>
    <div class="details" v-if="showDetails">
      <p>
        {{ dictionaryheader.comment }} - Position: {{ dictionaryheader.position }}
      </p>
    </div>

  </div>
</template>
            
<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'


export default {
  props: ['trace', 'dictionaryheader', 'superUser', 'userID', 'currentuser', 'projectID', 'subprojectID', 'location'],

  components: { PopupConfirm },

  setup(props, context) {
    const router = useRouter()
    const trace = ref(props.trace)

    displayMsg('DictionaryheaderSingle.vue', trace.value)
    consoleLog('DictionaryheaderSingle.vue - props', 1, props, trace.value)

    const showDetails = ref(false)
    const showPopup = ref(false)
    const dictionaryheader = ref(props.dictionaryheader)
    const location = ref(props.location)
    const IamSuperUser = ref(props.superUser)
    const actionAllowed = ref(true)
    const dictionaryheaderID = ref(dictionaryheader.value.dictionaryheaderID)
    const projectID = ref(props.projectID)
    const subprojectID = ref(props.subprojectID)
    const userID = ref(props.userID)
    const recordSelected = ref(false)
    const testID = ref(0)
    const locationOrigin = ref('')
    const testParamID = ref(0)
    const testParam1 = ref('')
    const testParam2 = ref('')
    const testParam3 = ref('')
    const testParam4 = ref('')

    // --------------------------------------------------------------------
    // Check if we come from the test definition or for the control panel
    // Syntax is: test=<testID>=<datasetheaderID>=<parameterID>=<param1>=<param2>=<param3>=<param4>
    // --------------------------------------------------------------------
    if (location.value.includes('test=') || location.value.includes('rule=')) {
      // split the location to find the keyword
      let data = location.value.split("=");

      if (data[1] != undefined && data[3] != undefined) {
        testID.value = data[1]
        locationOrigin.value = data[0]
        testParamID.value = data[3]
        testParam1.value = data[4]
        testParam2.value = data[5]
        testParam3.value = data[6]
        testParam4.value = data[7]
      } else {
        locationOrigin.value = data[0]
      }
    }

    // -------------------------------------------
    // User asks to delete a dictionaryheader
    // -------------------------------------------
    const handelDelete = () => {
      consoleLog('DictionaryheaderSingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
      context.emit('handledelete', dictionaryheader.value.dictionaryheaderID)
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleConfirmation = () => {
      consoleLog('DictionaryheaderSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
      showPopup.value = true
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleCancelDelete = () => {
      consoleLog('DictionaryheaderSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
      showPopup.value = false
    }


    // --------------------------------------------------------------------------
    // User confirm the delete action
    // --------------------------------------------------------------------------
    const handleConfirmDelete = () => {
      consoleLog('DictionaryheaderSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
      showPopup.value = false
      handelDelete()
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleSelect = () => {
      consoleLog('DictionaryheaderSingle.vue/handleSelect', 2, 'Select a record', trace.value)
      recordSelected.value = !recordSelected.value
      context.emit('selectrecord', dictionaryheaderID.value)
    }


    // --------------------------------------------------------------------------
    // User want to insert record(s)
    // --------------------------------------------------------------------------
    const handleInsert = () => {
      consoleLog('DictionaryheaderSingle.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      context.emit('handleinsert', dictionaryheader.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to copy record(s)
    // --------------------------------------------------------------------------
    const handleCopy = () => {
      consoleLog('DictionaryheaderSingle.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', dictionaryheader.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to move record(s)
    // --------------------------------------------------------------------------
    const handleMove = () => {
      consoleLog('DictionaryheaderSingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', dictionaryheader.value.position)
    }

    // --------------------------------------------------------------------------
    // User wants to goto the dictionary data
    // --------------------------------------------------------------------------
    const handleGotoDictionary = () => {
      consoleLog('DictionaryheaderSingle.vue/handleGotoDictionary', 2, 'Emit event to update the location (include the dictionaryheaderID)', trace.value)
      switch (testParamID.value) {
        case '1':
          testParam1.value = ''
          break
        case '2':
          testParam2.value = ''
          break
        case '3':
          testParam3.value = ''
          break
        case '4':
          testParam4.value = ''
          break
      }
      context.emit('storelocation', locationOrigin.value + '=' + testID.value + '=' + dictionaryheaderID.value + '=' + testParamID.value + '=' + testParam1.value + '=' + testParam2.value + '=' + testParam3.value + '=' + testParam4.value)
    }


    return {
      showDetails, projectID, userID, dictionaryheader, dictionaryheaderID, actionAllowed, showPopup, recordSelected, testID,
      handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete,
      handleSelect, handleInsert, handleCopy, handleMove, handleGotoDictionary
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