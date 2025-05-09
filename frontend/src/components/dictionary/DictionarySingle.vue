<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div
    :class="recordSelected ? 'entity selected' : (!dictionary.active ? 'entity inactive' : (dictionary.active == 1 ? 'entity' : 'entity comment'))">

    <div class="actions">

      <h3 @click="showDetails = !showDetails" title="Click to show details" class="data">
        {{ dictionary.position }} > {{ dictionary.headercode }}{{ dictionary.code }} - {{ dictionary.language }}
      </h3>

      <div class="actions">

        <div class="icons" v-if="importWord">
          <router-link :to="{ name: 'TestEdit', params: { id: testID, location: 'dictionary' } }" @click="handleImport">
            <i class="fa-solid fa-file-import" :class="classColor" @click="handleImport(0)"
              title="Use this word in your Scenario"></i>
          </router-link>
        </div>

        <div class="icons" v-if="importWizard">
          <router-link :to="{ name: 'RuleWizard', params: { id: 0, location: 'dictionary' } }" @click="handleImport">
            <i class="fa-solid fa-file-import" :class="classColor" @click="handleImport(1)"
              title="Use this word in your Wizard"></i>
          </router-link>
        </div>

        <div class="icons" v-if="importRule">
          <router-link :to="{ name: 'RuleEdit', params: { id: testID, location: 'dictionary' } }" @click="handleImport">
            <i class="fa-solid fa-file-import" :class="classColor" @click="handleImport(0)"
              title="Use this word in your Rule"></i>
          </router-link>
        </div>



        <div class="icons" v-if="actionAllowed">
          <i>&nbsp;</i>
        </div>

        <div class="actions">
          <div class="icons" v-if="actionAllowed">
            <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the dictionary"></i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <router-link :to="{ name: 'DictionaryEdit', params: { id: dictionaryID } }">
              <i class="fa-regular fa-pen-to-square" title="Edit the dictionary"></i>
            </router-link>
          </div>

          <div class="icons" v-if="actionAllowed">
            <i class="fa-solid fa-plus" @click="handleInsert" title="Insert after this row"></i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <router-link :to="{ name: 'DictionaryRename', params: { id: dictionaryID } }">
              <i class="fa-solid fa-wrench" title="Rename the dictionary"></i>
            </router-link>
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
      <p>{{ dictionary.comment }} - Language: {{ dictionary.language }}</p>
      <p>
        <i class="fa-regular fa-copy" @click="handleClipboard(dictionary.label)" title="Copy to the clipboard" v-if="!clipboard"></i>
        <i class="fa-solid fa-copy" @click="handleClipboard(dictionary.label)" title="Copy to the clipboard" v-else></i>
        &nbsp;{{ dictionary.label }}
      </p>
      <p>Updated by: {{ dictionary.updatedby }} on: {{ dictionary.updated }}</p>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'
import useClipboard from 'vue-clipboard3'


export default {
  props: ['trace', 'dictionary', 'superUser', 'userID', 'projectID', 'subprojectID', 'location'],

  components: { PopupConfirm },

  setup(props, context) {
    const router = useRouter()
    const { toClipboard } = useClipboard()
    const trace = ref(props.trace)

    displayMsg('DictionarySingle.vue', trace.value)
    consoleLog('DictionarySingle.vue - props', 1, props, trace.value)

    const showDetails = ref(false)
    const showPopup = ref(false)
    const dictionary = ref(props.dictionary)
    const location = ref(props.location)
    const IamSuperUser = ref(props.superUser)
    const actionAllowed = ref(true)
    const dictionaryID = ref(dictionary.value.dictionaryID)
    const projectID = ref(props.projectID)
    const subprojectID = ref(props.subprojectID)
    const userID = ref(props.userID)
    const recordSelected = ref(false)
    const testID = ref(0)
    const testParamID = ref(0)
    const testParam1 = ref('')
    const testParam2 = ref('')
    const testParam3 = ref('')
    const testParam4 = ref('')

    const importWord = ref(false)
    const importWizard = ref(false)
    const importRule = ref(false)
    const classColor = ref('blue')
    const clipboard = ref(0)


    // --------------------------------------------------------------------
    // Check if we come from the test definition or for the control panel
    // Syntax is: test=<testID>=<parameterID>=<param1>=<param2>=<param3>=<param4>
    // --------------------------------------------------------------------
    if (location.value.includes('test=') || location.value.includes('rulewizard=') || location.value.includes('rule=')) {
      // split the location to find the keyword
      let data = location.value.split("=");
      console.log('Data: ', data)

      if (data[1] != undefined && data[3] != undefined) {
        testID.value = data[1]
        testParamID.value = data[3]
        testParam1.value = data[4]
        testParam2.value = data[5]
        testParam3.value = data[6]
        testParam4.value = data[7]
        importWord.value = false
        importWizard.value = false
        importRule.value = false
        if (location.value.includes('test=')) importWord.value = true
        if (location.value.includes('rulewizard=')) importWizard.value = true
        if (location.value.includes('rule=')) importRule.value = true
      }
    }

    // -------------------------------------------
    // User asks to use this word in the scenario
    // -------------------------------------------
    const handleImport = (includeId) => {
      consoleLog('DictionarySingle.vue/handleImport', 2, 'Emit event to select this word in the scenario in the parameter: ' + testParamID.value, trace.value)
      switch (testParamID.value) {
        case '1':
          testParam1.value = dictionary.value.fullcode
          break
        case '2':
          testParam2.value = dictionary.value.fullcode
          break
        case '3':
          testParam3.value = dictionary.value.fullcode
          break
        case '4':
          testParam4.value = dictionary.value.fullcode
          break
      }

      if (includeId) {
        // Syntax is: dictionary=<testID>=<parameterID>=<param1>=<param2>=<param3>
        context.emit('storelocation', 'dictionary=' + testID.value + "=" + testParamID.value + '=' + testParam1.value + '=' + testParam2.value + '=' + testParam3.value + '=' + testParam4.value)

      } else {
        // Syntax is: dictionary=<parameterID>=<param1>=<param2>=<param3>
        context.emit('storelocation', 'dictionary=' + testParamID.value + '=' + testParam1.value + '=' + testParam2.value + '=' + testParam3.value + '=' + testParam4.value)
      }


    }


    // -------------------------------------------
    // User asks to delete a dictionary
    // -------------------------------------------
    const handelDelete = () => {
      consoleLog('DictionarySingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
      context.emit('handledelete', dictionary.value.dictionaryID)
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleConfirmation = () => {
      consoleLog('DictionarySingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
      showPopup.value = true
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleCancelDelete = () => {
      consoleLog('DictionarySingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
      showPopup.value = false
    }


    // --------------------------------------------------------------------------
    // User confirm the delete action
    // --------------------------------------------------------------------------
    const handleConfirmDelete = () => {
      consoleLog('DictionarySingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
      showPopup.value = false
      handelDelete()
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleSelect = () => {
      consoleLog('DictionarySingle.vue/handleSelect', 2, 'Select a record', trace.value)
      recordSelected.value = !recordSelected.value
      context.emit('selectrecord', dictionaryID.value)
    }


    // --------------------------------------------------------------------------
    // User want to insert record(s)
    // --------------------------------------------------------------------------
    const handleInsert = () => {
      consoleLog('DictionarySingle.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      context.emit('handleinsert', dictionary.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to copy record(s)
    // --------------------------------------------------------------------------
    const handleCopy = () => {
      consoleLog('DictionarySingle.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', dictionary.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to move record(s)
    // --------------------------------------------------------------------------
    const handleMove = () => {
      consoleLog('DictionarySingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', dictionary.value.position)
    }

    // --------------------------------------------------------------------------
    // User wants to copy a value into the clipboard
    // --------------------------------------------------------------------------
    const handleClipboard = async (value) => {
      consoleLog('DictionarySingle.vue/handleClipboard', 2, 'value: ' + value, trace.value)
      try {
        await toClipboard(value)
        consoleLog('DictionarySingle.vue/handleClipboard', 2, 'Copy to the clipboard!', trace.value)
        clipboard.value = !clipboard.value
        setTimeout(() => clipboard.value = 0, 2000)
      } catch (e) {
        consoleLog('DictionarySingle.vue/handleClipboard', 2, e, trace.value)
      }
    }



    return {
      showDetails, projectID, userID, dictionary, dictionaryID, actionAllowed, showPopup,
      recordSelected, testID, importWord, importWizard, importRule, classColor, clipboard,
      handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete,
      handleSelect, handleInsert, handleCopy, handleMove, handleImport, handleClipboard
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