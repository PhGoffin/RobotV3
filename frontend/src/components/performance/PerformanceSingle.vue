<template>

  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>  

  <div :class="recordSelected ? 'entity selected' : 'entity'">

    <div class="actions">

      <table>
        <tbody>
          <tr>
            <td>
              <span>&nbsp;</span>
            </td>
            <td>
              <div class="actions">



                <div class="icons" v-if="actionAllowed">
                  <input type="checkbox" name="selection" class="input checkbox" @change="handleSelect"
                    title="Check to select the record" />
                </div>

                <div class="icons" v-if="actionAllowed">
                  <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the performance"></i>
                </div>
              </div>
            </td>
            <td>
              <h3 @click="showDetails = !showDetails" title="Click to show details" class="data" ref="single">
                {{ performance.space }} > {{ performance.scenario }} > {{ performance.topic }} ==> Measure: {{
                  performance.sequencePad }} ) {{ performance.measure }}  --> {{ performance.created }}
              </h3>
            </td>
          </tr>
        </tbody>
      </table>



    </div>
    <div class="details" v-if="showDetails">
      <p>ID: {{ performance.performanceID }}</p>
    </div>

  </div>

</template>

<script>
import { ref } from 'vue'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'


export default {
  props: ['trace', 'performance', 'superUser', 'userID', 'projectID', 'subprojectID', 'location'],

  components: { PopupConfirm },

  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('PerformanceSingle.vue', trace.value)
    consoleLog('PerformanceSingle.vue - props', 1, props, trace.value)

    const showDetails = ref(false)
    const showPopup = ref(false)
    const performance = ref(props.performance)
    const location = ref(props.location)
    const IamSuperUser = ref(props.superUser)
    const actionAllowed = ref(true)
    const performanceID = ref(performance.value.performanceID)
    const projectID = ref(props.projectID)
    const userID = ref(props.userID)
    const recordSelected = ref(false)


    // --------------------------------------------------------------------------
    // User select a record
    // --------------------------------------------------------------------------
    const handleSelect = () => {
      consoleLog('PerformanceSingle.vue/handleSelect', 2, 'Select a record', trace.value)
      recordSelected.value = !recordSelected.value
      context.emit('selectrecord', performanceID.value)
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleConfirmation = () => {
      consoleLog('PerformanceSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
      showPopup.value = true
    }    

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleCancelDelete = () => {
      consoleLog('PerformanceSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
      showPopup.value = false
    }    

    // --------------------------------------------------------------------------
    // User confirm the delete action
    // --------------------------------------------------------------------------
    const handleConfirmDelete = () => {
      consoleLog('PerformanceSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
      showPopup.value = false
      handelDelete()
    }

    // -------------------------------------------
    // User asks to delete a performance
    // -------------------------------------------
    const handelDelete = () => {
      consoleLog('PerformanceSingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
      context.emit('handledelete', performance.value.performanceID)
    }    

    return {
      showDetails, projectID, userID, performance, performanceID, recordSelected, actionAllowed,
      showPopup, handleConfirmation, handleSelect, handleCancelDelete, handleConfirmDelete, handelDelete
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