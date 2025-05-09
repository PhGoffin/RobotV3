<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div
    :class="recordSelected ? 'entity selected' : (!dataset.active ? 'entity inactive' : (dataset.active == 1 ? 'entity' : 'entity comment'))">

    <div class="actions">

      <h3 @click="showDetails = !showDetails" title="Click to show details" class="data"  ref="single" v-if="dataset.active < 2">
        {{ dataset.position }} > {{ dataset.headercode }}{{ dataset.code }} - {{ dataset.label }}
      </h3>
      <h3 @click="showDetails = !showDetails" title="Click to show details" class="data"  ref="single" v-else>
        {{ dataset.position }} > {{ dataset.comment }}
      </h3>

      <div class="actions">

        <div class="icons" v-if="importData">
          <router-link :to="{ name: 'TestEdit', params: { id: testID, location: 'dataset' } }" @click="handleImport">
            <i class="fa-solid fa-file-import" :class="classColor" @click="handleImport(0)"
              title="Use this data in your scenario"></i>
          </router-link>
        </div>

        <div class="icons" v-if="importWizard">
          <router-link :to="{ name: 'RuleWizard', params: { id: testID, location: 'dataset' } }" @click="handleImport">
            <i class="fa-solid fa-file-import" :class="classColor" @click="handleImport(1)"
              title="Use this data in your wizard"></i>
          </router-link>
        </div>

        <div class="icons" v-if="importRule">
          <router-link :to="{ name: 'RuleEdit', params: { id: testID, location: 'dataset' } }" @click="handleImport">
            <i class="fa-solid fa-file-import" :class="classColor" @click="handleImport(1)"
              title="Use this data in your Rule"></i>
          </router-link>
        </div>

        <div class="icons">
          <i>&nbsp;</i>
        </div>

        <div class="actions">
          <div class="icons" v-if="actionAllowed && !importSingleData">
            <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the dataset"></i>
          </div>

          <div class="icons" v-if="!importSingleData">
            <router-link :to="{ name: 'DataEdit', params: { id: datasetID } }">
              <i class="fa-regular fa-pen-to-square" title="Edit the dataset"></i>
            </router-link>
          </div>

          <div class="icons" v-if="actionAllowed && !importSingleData">
            <i class="fa-solid fa-plus" @click="handleInsert" title="Insert after this row"></i>
          </div>

          <div class="icons" v-if="actionAllowed && !importSingleData">
            <i>&nbsp;</i>
          </div>


          <div class="icons" v-if="actionAllowed && !importSingleData">
            <i class="fa-solid fa-copy" @click="handleCopy" title="Copy after this row"></i>
          </div>

          <div class="icons" v-if="actionAllowed && !importSingleData">
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
      <p>{{ dataset.comment }}</p>
      <p>Updated by: {{ dataset.updatedby }} on: {{ dataset.updated }}</p>
      <p>ID: {{ dataset.datasetID }}</p>
    </div>

  </div>
</template>

<script>
import { ref, nextTick } from 'vue'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'


export default {
  props: ['trace', 'dataset', 'superUser', 'userID', 'projectID', 'subprojectID', 'location'],

  components: { PopupConfirm },

  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('DatasetSingle.vue', trace.value)
    consoleLog('DatasetSingle.vue - props', 1, props, trace.value)

    const showDetails = ref(false)
    const showPopup = ref(false)
    const dataset = ref(props.dataset)
    const location = ref(props.location)
    const IamSuperUser = ref(props.superUser)
    const actionAllowed = ref(true)
    const datasetID = ref(dataset.value.datasetID)
    const projectID = ref(props.projectID)
    const subprojectID = ref(props.subprojectID)
    const datasetheaderID = ref(0)
    const userID = ref(props.userID)
    const recordSelected = ref(false)
    const testID = ref(0)
    const testParamID = ref(0)
    const testParam1 = ref('')
    const testParam2 = ref('')
    const testParam3 = ref('')
    const testParam4 = ref('')
    const single = ref(null)
    const position = ref(dataset.value.position)
    const dataPosition = ref(0)


    const importData = ref(false)
    const importWizard = ref(false)
    const importRule = ref(false)
    const classColor = ref('blue')
    const importSingleData = ref(false)


    // --------------------------------------------------------------------
    // Check if we come from the test definition or for the control panel
    // Syntax is: test=<testID>=<datasetheaderID>=<parameterID>=<param1>=<param2>=<param3>=<param4>
    // Syntax is: rulewizard=<ruleID>=0=<parameterID>=<param1>=<param2>=<param3>=<param4>
    // --------------------------------------------------------------------
    if (location.value.includes('test=') || location.value.includes('rulewizard=') || location.value.includes('rule=') || location.value.includes('dataset=') || location.value.includes('dataimport=')) {
      // split the location to find the keyword
      let data = location.value.split("=");
      //console.log(data)
      datasetheaderID.value = data[2]
      //console.log('********************** ' + datasetheaderID.value)

      if (data[1] != undefined && data[3] != undefined && dataset.value.active != 2) {
        testID.value = data[1]
        testParamID.value = data[3]
        testParam1.value = data[4]
        testParam2.value = data[5]
        testParam3.value = data[6]
        testParam4.value = data[7]
        importData.value = false
        importWizard.value = false
        importRule.value = false
        if (location.value.includes('test=')) importData.value = true
        if (location.value.includes('rulewizard=')) importWizard.value = true
        if (location.value.includes('rule=')) importRule.value = true
        if (location.value.includes('dataimport=')) importSingleData.value = true
      }
      if (datasetheaderID.value == '0') actionAllowed.value = false
      else actionAllowed.value = true

    } else if (location.value.includes('controlpanel=')) {
      // Syntax is: controlpanel=<dataPosition>
      let params = location.value.split('=');
      if (params[1] != null && params[1] != undefined) dataPosition.value = params[1]
    }


    nextTick().then(() => {
      if (position.value == dataPosition.value) {
        console.log('====> Single: ', single.value)
        if (single.value != null) {
          //useFocus (single.value)
          single.value.scrollIntoView()
        }
      }
    });

    // -------------------------------------------
    // User asks to use this data in the scenario
    // -------------------------------------------
    const handleImport = (includeId) => {
      consoleLog('DatasetSingle.vue/handleImport', 2, 'Emit event to select this data in the scenario in the parameter: ' + testParamID.value, trace.value)
      switch (testParamID.value) {
        case '1':
          testParam1.value = dataset.value.fullcode
          break
        case '2':
          testParam2.value = dataset.value.fullcode
          break
        case '3':
          testParam3.value = dataset.value.fullcode
          break
        case '4':
          testParam4.value = dataset.value.fullcode
          break
      }
      //consoleLog('DatasetSingle.vue/handleImport', 2, 'parameter ID: ' + testParamID.value + ', P1' + testParam1.value + ', P2' + testParam2.value + ', P3' + testParam3.value, trace.value)

      if (includeId) {
        // Syntax is: dataset=<testID>=<parameterID>=<param1>=<param2>=<param3>
        context.emit('storelocation', 'dataset=' + testID.value + "=" + testParamID.value + '=' + testParam1.value + '=' + testParam2.value + '=' + testParam3.value + '=' + testParam4.value)

      } else {
        // Syntax is: dataset=<parameterID>=<param1>=<param2>=<param3>
        context.emit('storelocation', 'dataset=' + testParamID.value + '=' + testParam1.value + '=' + testParam2.value + '=' + testParam3.value + '=' + testParam4.value)
      }

    }



    // -------------------------------------------
    // User asks to delete a dataset
    // -------------------------------------------
    const handelDelete = () => {
      consoleLog('DatasetSingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
      context.emit('handledelete', dataset.value.datasetID, dataset.value.position)
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleConfirmation = () => {
      consoleLog('DatasetSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
      showPopup.value = true
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleCancelDelete = () => {
      consoleLog('DatasetSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
      showPopup.value = false
    }


    // --------------------------------------------------------------------------
    // User confirm the delete action
    // --------------------------------------------------------------------------
    const handleConfirmDelete = () => {
      consoleLog('DatasetSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
      showPopup.value = false
      handelDelete()
    }

    // --------------------------------------------------------------------------
    // User select a record
    // --------------------------------------------------------------------------
    const handleSelect = () => {
      consoleLog('DatasetSingle.vue/handleSelect', 2, 'Select a record', trace.value)
      recordSelected.value = !recordSelected.value
      context.emit('selectrecord', datasetID.value)
    }


    // --------------------------------------------------------------------------
    // User want to insert record(s)
    // --------------------------------------------------------------------------
    const handleInsert = () => {
      consoleLog('DatasetSingle.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      context.emit('handleinsert', dataset.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to copy record(s)
    // --------------------------------------------------------------------------
    const handleCopy = () => {
      consoleLog('DatasetSingle.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', dataset.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to move record(s)
    // --------------------------------------------------------------------------
    const handleMove = () => {
      consoleLog('DatasetSingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', dataset.value.position)
    }



    return {
      showDetails, projectID, userID, dataset, datasetID, actionAllowed, showPopup, recordSelected,
      testID, importData, importWizard, importRule, classColor, importSingleData, single,
      handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete,
      handleSelect, handleInsert, handleCopy, handleMove, handleImport
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