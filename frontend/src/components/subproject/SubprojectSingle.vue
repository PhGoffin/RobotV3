<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div
    :class="recordSelected ? 'entity selected' : 'entity'">


    <div class="actions">

      <h3 @click="showDetails = !showDetails" title="Click to show the comment" class="data">{{ subproject.subproject }}
      </h3>

      <div class="actions">

        <div class="icons">
          <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the project"></i>
        </div>

        <div class="icons">
          <router-link
            :to="{ name: 'SubprojectEdit', params: { id: subproject.subprojectID, projectID: subproject.projectID } }">
            <i class="fa-regular fa-pen-to-square" title="Edit the subproject"></i>
          </router-link>
        </div>

        <div class="icons">
          <i>&nbsp;</i>
        </div>

        <div class="icons">
          <i class="fa-solid fa-down-left-and-up-right-to-center" @click="handleMove" title="Move after this row"></i>
        </div>

        <div class="icons">
          <input type="checkbox" name="selection" class="input checkbox" @change="handleSelect"
            title="Check to indicate the row(s) to Move" />
        </div>

      </div>

    </div>
    <div class="details" v-if="showDetails">
      <p>ID: {{ subproject.subprojectID }}</p>
      <p>{{ subproject.comment }}</p>
      <p>Updated by: {{ subproject.updatedby }} on: {{ subproject.updated }}</p>
    </div>


  </div>
</template>

<script>
import { ref } from 'vue'
import deleteSubproject from '../../composables/subproject/deleteSubproject'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'



export default {
  props: ['trace', 'subproject', 'projectID', 'superUser'],
  components: { PopupConfirm },

  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('SubprojectSingle.vue', trace.value)
    consoleLog('SubprojectSingle.vue - props', 1, props, trace.value)


    const showDetails = ref(false)
    const showPopup = ref(false)
    const subproject = ref(props.subproject)
    const projectID = ref(props.projectID)
    const superUser = ref(props.superUser)
    const subprojectID = ref(subproject.value.subprojectID)
    const recordSelected = ref(false)


    // -------------------------------------------
    // User agree to delete a subproject
    // -------------------------------------------
    const handelDelete = () => {
      consoleLog('SubprojectSingle.vue/handelDelete', 2, 'User asks to delete a subproject', trace.value)
      const { error, deleteTheSubproject } = deleteSubproject(projectID.value, subprojectID.value)
      deleteTheSubproject(subproject, trace.value)
        .then(function () {
          consoleLog('SubprojectSingle.vue/handelDelete', 3, '------ Delete subproject: ' + projectID.value + ', ' + subprojectID.value, trace.value)
          consoleLog('SubprojectSingle.vue/handelDelete', 3, subproject.value, trace.value)
          consoleLog('SubprojectSingle.vue/handelDelete', 3, 'Success: ' + subproject.value.message, trace.value)

          if (subproject.value.success) {
            consoleLog('SubprojectSingle.vue/handelDelete', 2, 'Message: ' + subproject.value.message, trace.value)
            return 1
          } else {
            // Error during delete found!
            consoleLog('SubprojectSingle.vue/handelDelete', 2, subproject.value.message, trace.value)
            return 0
          }
        }).then(function (status) {
          // ask the subproject view to refresh the list
          consoleLog('SubprojectSingle.vue/handelDelete', 2, 'Emit a request to the parent to refresh the list', trace.value)
          context.emit('refreshsubprojects', status, subproject.value.message)
        })
    }


    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleConfirmation = () => {
      consoleLog('SubprojectSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
      showPopup.value = true
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleCancelDelete = () => {
      consoleLog('SubprojectSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
      showPopup.value = false
    }


    // --------------------------------------------------------------------------
    // User confirm the delete action
    // --------------------------------------------------------------------------
    const handleConfirmDelete = () => {
      consoleLog('SubprojectSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
      showPopup.value = false
      handelDelete()
    }


    // --------------------------------------------------------------------------
    // User selects a record
    // --------------------------------------------------------------------------
    const handleSelect = () => {
      consoleLog('SubprojectSingle.vue/handleSelect', 2, 'Select a record', trace.value)
      recordSelected.value = !recordSelected.value
      context.emit('selectrecord', subprojectID.value)
    }

    // --------------------------------------------------------------------------
    // User want to move record(s)
    // --------------------------------------------------------------------------
    const handleMove = () => {
      consoleLog('SubprojectSingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', subproject.value.position)
    }

    return { showDetails, superUser, projectID, showPopup, recordSelected, handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete, handleSelect, handleMove }
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