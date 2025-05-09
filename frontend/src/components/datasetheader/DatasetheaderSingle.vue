<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div
    :class="recordSelected ? 'entity selected' : (!datasetheader.active ? 'entity inactive' : (datasetheader.active == 1 ? 'entity' : 'entity comment'))">

    <div class="actions">

      <h3 @click="showDetails = !showDetails" title="Click to show details" ref="single" class="data">
        {{ datasetheader.position }} > {{ datasetheader.code }}
      </h3>

      <div class="actions">

        <div class="actions">
          <div class="icons" v-if="actionAllowed && !importData">
            <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the datasetheader"></i>
          </div>

          <div class="icons" v-if="actionAllowed && !importData">
            <router-link :to="{ name: 'DatasetEdit', params: { id: datasetheaderID } }">
              <i class="fa-regular fa-pen-to-square" title="Edit the datasetheader"></i>
            </router-link>
          </div>

          <div class="icons" v-if="actionAllowed && !importData">
            <i class="fa-solid fa-plus" @click="handleInsert" title="Insert after this row"></i>
          </div>

          <div class="icons" v-if="actionAllowed && !importData">
            <i>&nbsp;</i>
          </div>


          <div class="icons" v-if="actionAllowed && !importData">
            <i class="fa-solid fa-copy" @click="handleCopy" title="Copy after this row"></i>
          </div>

          <div class="icons" v-if="actionAllowed && !importData">
            <i class="fa-solid fa-down-left-and-up-right-to-center" @click="handleMove" title="Move after this row"></i>
          </div>

          <div class="icons" v-if="actionAllowed && !importData">
            <input type="checkbox" name="selection" class="input checkbox" @change="handleSelect"
              title="Check to select the row(s) to Copy or Move" />
          </div>

          <div class="icons" v-if="actionAllowed">
            <i>&nbsp;</i>
          </div>


          <div class="icons" v-if="actionAllowed">
            <router-link :to="{ name: 'Data', params: { id: datasetheaderID } }">
              <i class="fa-solid fa-database" title="Goto Dataset data" @click="handleGotoDataset"></i>
            </router-link>
          </div>


        </div>

      </div>

    </div>
    <div class="details" v-if="showDetails">
      <p>
        ID: {{ datasetheader.datasetheaderID }}
        {{ datasetheader.comment }} Position: {{ datasetheader.position }}
      </p>
    </div>

  </div>
</template>

<script>
import { ref, nextTick } from 'vue'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'


export default {
  props: ['trace', 'datasetheader', 'superUser', 'userID', 'projectID', 'subprojectID', 'location'],

  components: { PopupConfirm },

  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('DatasetheaderSingle.vue', trace.value)
    consoleLog('DatasetheaderSingle.vue - props', 1, props, trace.value)

    const showDetails = ref(false)
    const showPopup = ref(false)
    const datasetheader = ref(props.datasetheader)
    const location = ref(props.location)
    const IamSuperUser = ref(props.superUser)
    const actionAllowed = ref(true)
    const datasetheaderID = ref(datasetheader.value.datasetheaderID)
    const projectID = ref(props.projectID)
    const subprojectID = ref(props.subprojectID)
    const userID = ref(props.userID)
    const recordSelected = ref(false)
    const testID = ref(0)
    const importData = ref(false)
    const locationOrigin = ref('')
    const testParamID = ref(0)
    const testParam1 = ref('')
    const testParam2 = ref('')
    const testParam3 = ref('')
    const testParam4 = ref('')
    const single = ref(null)
    const position = ref(datasetheader.value.position)
    const dataPosition = ref(0)


    const classColor = ref('blue')


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
        //importData.value = true
      } else {
        locationOrigin.value = data[0]
      }
    } else if (location.value.includes('dataimport=')) {
      let data = location.value.split("=");
      locationOrigin.value = data[0]
      importData.value = true
    } else if (location.value.includes('controlpanel=')) {
      // Syntax is: controlpanel=<dataPosition>
      let params = location.value.split('=');
      if (params[1] != null && params[1] != undefined) dataPosition.value = params[1]  
    } else locationOrigin.value = "dataset"


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
    // User asks to delete a datasetheader
    // -------------------------------------------
    const handelDelete = () => {
      consoleLog('DatasetheaderSingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
      context.emit('handledelete', datasetheader.value.datasetheaderID,  datasetheader.value.position)
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleConfirmation = () => {
      consoleLog('DatasetheaderSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
      showPopup.value = true
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleCancelDelete = () => {
      consoleLog('DatasetheaderSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
      showPopup.value = false
    }


    // --------------------------------------------------------------------------
    // User confirm the delete action
    // --------------------------------------------------------------------------
    const handleConfirmDelete = () => {
      consoleLog('DatasetheaderSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
      showPopup.value = false
      handelDelete()
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleSelect = () => {
      consoleLog('DatasetheaderSingle.vue/handleSelect', 2, 'Select a record', trace.value)
      recordSelected.value = !recordSelected.value
      context.emit('selectrecord', datasetheaderID.value)
    }


    // --------------------------------------------------------------------------
    // User want to insert record(s)
    // --------------------------------------------------------------------------
    const handleInsert = () => {
      consoleLog('DatasetheaderSingle.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      context.emit('handleinsert', datasetheader.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to copy record(s)
    // --------------------------------------------------------------------------
    const handleCopy = () => {
      consoleLog('DatasetheaderSingle.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', datasetheader.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to move record(s)
    // --------------------------------------------------------------------------
    const handleMove = () => {
      consoleLog('DatasetheaderSingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', datasetheader.value.position)
    }

    // --------------------------------------------------------------------------
    // User wants to goto the dataset
    // --------------------------------------------------------------------------
    const handleGotoDataset = () => {
      consoleLog('DatasetheaderSingle.vue/handleGotoDataset', 2, 'Emit event to update the location (include the datasetheaderID)', trace.value)
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
      if (!location.value.includes('dataimport=')) 
      context.emit('storelocation', locationOrigin.value + '=' + testID.value + '=' + datasetheaderID.value + '=' + testParamID.value + '=' + testParam1.value + '=' + testParam2.value + '=' + testParam3.value + '=' + testParam4.value)
    }



    return {
      showDetails, projectID, userID, datasetheader, datasetheaderID, actionAllowed, showPopup, recordSelected, testID, importData, classColor, single,
      handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete,
      handleSelect, handleInsert, handleCopy, handleMove, handleGotoDataset
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