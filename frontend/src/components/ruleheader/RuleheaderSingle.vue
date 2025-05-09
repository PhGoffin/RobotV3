<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div
    :class="recordSelected ? 'entity selected' : (!ruleheader.active ? 'entity inactive' : (ruleheader.active == 1 ? 'entity' : 'entity comment'))">

    <div class="actions">

      <h3 @click="showDetails = !showDetails" title="Click to show details" class="data">
        {{ ruleheader.rule }} - {{ ruleheader.comment }}
      </h3>

      <div class="actions">

        <div class="icons" v-if="importData">
          <router-link :to="{ name: 'TestEdit', params: { id: testID, location: 'rule' } }" @click="handleImport">
            <i class="fa-solid fa-file-import" :class="classColor" @click="handleImport"
              title="Use this data in your scenario"></i>
          </router-link>
        </div>

        <div class="icons">
          <i>&nbsp;</i>
        </div>

        <div class="actions">
          <div class="icons" v-if="actionAllowed">
            <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the rule"></i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <router-link :to="{ name: 'RuleheaderEdit', params: { id: ruleheader.ruleheaderID } }">
              <i class="fa-regular fa-pen-to-square" title="Edit the rule"></i>
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
            <router-link :to="{ name: 'Rules', params: { id: ruleheaderID, location: 'ruleset' } }">
              <i class="fa-solid fa-database" title="Goto Rules" @click="handleGotoRule"></i>
            </router-link>
          </div>

        </div>

      </div>

    </div>
    <div class="details" v-if="showDetails">
      <p>ID: {{ ruleheader.ruleheaderID }}</p>
      <p>Updated by: {{ ruleheader.updatedby }} on: {{ ruleheader.updated }}</p>
    </div>

  </div>
</template>
          
<script>
import { ref } from 'vue'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'


export default {
  props: ['trace', 'ruleheader', 'superUser', 'userID', 'projectID', 'projectName', 'subprojectID', 'location'],

  components: { PopupConfirm },

  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('RuleheaderSingle.vue', trace.value)
    consoleLog('RuleheaderSingle.vue - props', 1, props, trace.value)

    const showDetails = ref(false)
    const showPopup = ref(false)
    const ruleheader = ref(props.ruleheader)
    const IamSuperUser = ref(props.superUser)
    const actionAllowed = ref(true)
    const ruleheaderID = ref(ruleheader.value.ruleheaderID)
    const projectID = ref(props.projectID)
    const projectName = ref(props.projectName)
    const subprojectID = ref(props.subprojectID)
    const userID = ref(props.userID)
    const recordSelected = ref(false)
    const location = ref(props.location)
    const testID = ref(0)
    const importData = ref(false)
    const testParamID = ref(0)
    const testParam1 = ref('')
    const testParam2 = ref('')
    const testParam3 = ref('')
    const testParam4 = ref('')

    const classColor = ref('blue')

    // --------------------------------------------------------------------
    // Check if we come from the test definition or for the control panel
    // Syntax is: test=<testID>=<ruleheaderID>=<parameterID>=<param1>=<param2>=<param3>=<param4>
    // --------------------------------------------------------------------
    if (location.value.includes('test=')) {
      // split the location to find the keyword
      let data = location.value.split("=");
      //console.log(data)

      if (data[1] != undefined && data[3] != undefined && ruleheader.value.active != 2) {
        testID.value = data[1]
        testParamID.value = data[3]
        testParam1.value = data[4]
        testParam2.value = data[5]
        testParam3.value = data[6]
        testParam4.value = data[7]
        importData.value = true
      }
    }

    // -------------------------------------------
    // User asks to use this word in the scenario
    // -------------------------------------------
    const handleImport = () => {
      consoleLog('RuleheaderSingle.vue/handleImport', 2, 'Emit event to select this data in the scenario in the parameter: ' + testParamID.value, trace.value)
      switch (testParamID.value) {
        case '1':
          testParam1.value = ruleheader.value.rule
          break
        case '2':
          testParam2.value = ruleheader.value.rule
          break
        case '3':
          testParam3.value = ruleheader.value.rule
          break
          case '4':
          testParam4.value = ruleheader.value.rule
          break
      }
      consoleLog('RuleheaderSingle.vue/handleImport', 2, 'parameter ID: ' + testParamID.value + ', P1: ' + testParam1.value + ', P2: ' + testParam2.value + ', P3: ' + testParam3.value + ', P4: ' + testParam4.value, trace.value)

      // Syntax is: dictionary=<parameterID>=<param1>=<param2>=<param3>
      context.emit('storelocation', 'rule=' + testParamID.value + '=' + testParam1.value + '=' + testParam2.value + '=' + testParam3.value + '=' + testParam4.value)

    }

    // -------------------------------------------
    // User asks to delete a rule
    // -------------------------------------------
    const handelDelete = () => {
      consoleLog('RuleheaderSingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
      context.emit('handledelete', ruleheader.value.ruleheaderID)
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleConfirmation = () => {
      consoleLog('RuleheaderSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
      showPopup.value = true
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleCancelDelete = () => {
      consoleLog('RuleheaderSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
      showPopup.value = false
    }


    // --------------------------------------------------------------------------
    // User confirm the delete action
    // --------------------------------------------------------------------------
    const handleConfirmDelete = () => {
      consoleLog('RuleheaderSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
      showPopup.value = false
      handelDelete()
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleSelect = () => {
      consoleLog('RuleheaderSingle.vue/handleSelect', 2, 'Select a record', trace.value)
      recordSelected.value = !recordSelected.value
      context.emit('selectrecord', ruleheaderID.value)
    }


    // --------------------------------------------------------------------------
    // User want to insert record(s)
    // --------------------------------------------------------------------------
    const handleInsert = () => {
      consoleLog('RuleheaderSingle.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      context.emit('handleinsert', ruleheader.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to copy record(s)
    // --------------------------------------------------------------------------
    const handleCopy = () => {
      consoleLog('RuleheaderSingle.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', ruleheader.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to move record(s)
    // --------------------------------------------------------------------------
    const handleMove = () => {
      consoleLog('RuleheaderSingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', ruleheader.value.position)
    }

    // --------------------------------------------------------------------------
    // User wants to goto the rules
    // --------------------------------------------------------------------------
    const handleGotoRule = () => {
      consoleLog('RuleheaderSingle.vue/handleGotoRule', 2, 'Emit event to update the location', trace.value)
      context.emit('storelocation', 'ruleset')
    }

    return {
      showDetails, projectID, userID, ruleheader, ruleheaderID, actionAllowed, showPopup, recordSelected, testID, importData, classColor,
      handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete,
      handleSelect, handleInsert, handleCopy, handleMove, handleImport, handleGotoRule
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