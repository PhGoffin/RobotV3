<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div :class="workspace.active ? 'entity' : 'entity inactive'">

    <div class="actions">

      <h3 @click="showDetails = !showDetails" title="Click to show details" class="data">
        {{ workspace.workspace }}
      </h3>

      <div class="actions">

        <div class="actions">
          <div class="icons" v-if="actionAllowed">
            <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the workspace"></i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <router-link :to="{ name: 'WorkspaceEdit', params: { id: workspaceID } }">
              <i class="fa-regular fa-pen-to-square" title="Edit the workspace"></i>
            </router-link>
          </div>

        </div>

      </div>

    </div>
    <div class="details" v-if="showDetails">
      <p>{{ workspace.comment }}</p>
      <p>Updated by: {{ workspace.updatedby }} on: {{ workspace.updated }}</p>
    </div>

  </div>
</template>
    
<script>
import { ref } from 'vue'
import deleteWorkspace from '../../composables/workspace/deleteWorkspace'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'


export default {
  props: ['trace', 'workspace', 'superUser'],
  components: { PopupConfirm },

  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('WorkspaceSingle.vue', trace.value)
    consoleLog('WorkspaceSingle.vue - props', 1, props, trace.value)

    const showDetails = ref(false)
    const showPopup = ref(false)
    const workspace = ref(props.workspace)
    const IamSuperUser = ref(props.superUser)
    const actionAllowed = ref(true)
    const workspaceID = ref(workspace.value.workspaceID)


    // -------------------------------------------
    // User asks to delete a workspace
    // -------------------------------------------
    const handelDelete = () => {
      consoleLog('WorkspaceSingle.vue/handelDelete', 2, 'User asks to delete a workspace', trace.value)
      const { error, deleteTheWorkspace } = deleteWorkspace(workspaceID.value)
      deleteTheWorkspace(workspace, trace.value)
        .then(function () {
          consoleLog('WorkspaceSingle.vue/handelDelete', 2, '------ Delete workspace: ' + workspaceID.value, trace.value)
          consoleLog('WorkspaceSingle.vue/handelDelete', 2, workspace.value, trace.value)
          consoleLog('WorkspaceSingle.vue/handelDelete', 2, 'Success: ' + workspace.value.message, trace.value)

          if (workspace.value.success) {
            consoleLog('WorkspaceSingle.vue/handelDelete', 2, 'Message: ' + workspace.value.message, trace.value)
            return 1
          } else {
            // Error during delete found!
            consoleLog('WorkspaceSingle.vue/handelDelete', 2, workspace.value.message, trace.value)
            return 0
          }
        }).then(function (status) {
          // ask the workspace view to refresh the list
          consoleLog('WorkspaceSingle.vue/handelDelete', 2, 'Emit a request to the parent to refresh the list', trace.value)
          context.emit('refreshworkspaces', status, workspace.value.message)
        })
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleConfirmation = () => {
      consoleLog('WorkspaceSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
      showPopup.value = true
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleCancelDelete = () => {
      consoleLog('WorkspaceSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
      showPopup.value = false
    }


    // --------------------------------------------------------------------------
    // User confirm the delete action
    // --------------------------------------------------------------------------
    const handleConfirmDelete = () => {
      consoleLog('WorkspaceSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
      showPopup.value = false
      handelDelete()
    }




    return { showDetails, workspaceID, workspace, actionAllowed, showPopup, handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete }
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