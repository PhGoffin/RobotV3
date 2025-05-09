<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div :class="linkedUser.active ? 'userproject' : 'userproject inactive'">

    <div class="actions">

      <h3 @click="showDetails = !showDetails" title="Click to show the preference" class="data">
        <i :class="icon"></i> &nbsp;
        {{ lastName }} {{
          linkedUser.firstName }} ( {{ linkedUser.login }} )
      </h3>

      <div class="actions">

        <div class="icons" v-if="actionAllowed">
          <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the link"></i>
        </div>

        <div class="icons" v-if="actionAllowed">
          <router-link
            :to="{ name: 'UserProjectEdit', params: { id: linkedUser.userprojectID, projectID: projectID, workspaceID: workspaceID, workspace: workspace } }">
            <i class="fa-regular fa-pen-to-square" title="Edit the link"></i>
          </router-link>
        </div>

      </div>

    </div>
    <div class="details" v-if="showDetails">
      <p>Role: {{ role }} - Preference: {{ linkedUser.preference }}</p>
      <p>Updated by: {{ linkedUser.updatedby }} on: {{ linkedUser.updated }}</p>
    </div>

  </div>
</template>
  
<script>
import { computed, ref } from 'vue'
import deleteUserProject from '../../composables/user/deleteUserProject'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'


export default {
  props: ['trace', 'linkedUser', 'workspaceID', 'workspace', 'superUser', 'projectID'],
  components: { PopupConfirm },

  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('UserProjectSingle.vue', trace.value)
    consoleLog('UserProjectSingle.vue - props', 1, props, trace.value)

    const showDetails = ref(false)
    const showPopup = ref(false)
    const workspaceID = ref(props.workspaceID)
    const workspace = ref(props.workspace)
    const linkedUser = ref(props.linkedUser)
    const IamSuperUser = ref(props.superUser)
    const projectID = ref(props.projectID)

    const lastName = computed(() => {
      if (linkedUser.value.lastName != undefined) {
        return linkedUser.value.lastName.toUpperCase()
      }
    });


    const icon = computed(() => {
      consoleLog('UserProjectSingle.vue - icon computed', 2, 'icon - Super User: ' + linkedUser.value.superuser + ', Role: ' + linkedUser.value.role, trace.value)
      if (linkedUser.value.superuser == 1) {
        return "fa-solid fa-user-secret"
      }
      if (linkedUser.value.role === 'Tester') {
        return "fa-solid fa-user-gear"
      }
      if (linkedUser.value.role === 'Designer') {
        return "fa-solid fa-person-shelter"
      }
      if (linkedUser.value.role === 'Admin') {
        return "fa-solid fa-person-military-pointing"
      }
      return "fa-regular fa-circle-user"

    });


    const role = computed(() => {
      consoleLog('UserProjectSingle.vue - role computed', 2, 'role - Super User: ' + linkedUser.value.superuser + ', Role: ' + linkedUser.value.role, trace.value)
      if (linkedUser.value.superuser == 1) {
        return "Super User"
      }
      return linkedUser.value.role

    });


    // -------------------------------------------
    // Manage the actions depending of the role of the user
    // -------------------------------------------
    const actionAllowed = computed(() => {
      consoleLog('UserProjectSingle.vue/actionAllowed', 2, 'Action Allowed: Super User: ' + linkedUser.value.superuser + ', IamSuperUser: ' + IamSuperUser.value, trace.value)
      if ((linkedUser.value.superuser == 1 && IamSuperUser.value == 1) || linkedUser.value.superuser != 1) {
        consoleLog('UserProjectSingle.vue/actionAllowed', 3, ' ==> Allowed', trace.value)
        return 1
      } else {
        consoleLog('UserProjectSingle.vue/actionAllowed', 3, ' ==> NOT Allowed', trace.value)
        return 0
      }
    })


    // -------------------------------------------
    // User asks to delete a link
    // -------------------------------------------
    const handelDelete = () => {
      consoleLog('UserProjectSingle.vue/handelDelete', 2, 'User asks to delete a linked user', trace.value)
      const { error, deleteTheUserProject } = deleteUserProject(workspaceID.value, linkedUser.value.userprojectID)
      deleteTheUserProject(linkedUser, trace.value)
        .then(function () {
          consoleLog('UserProjectSingle.vue/handelDelete', 2, '------ Delete linked user: ' + workspaceID.value + ', ' + linkedUser.value.userprojectID, trace.value)
          consoleLog('UserProjectSingle.vue/handelDelete', 2, linkedUser.value, trace.value)
          consoleLog('UserProjectSingle.vue/handelDelete', 2, 'Success: ' + linkedUser.value.message, trace.value)

          if (linkedUser.value.success) {
            consoleLog('UserProjectSingle.vue/handelDelete', 2, 'Message: ' + linkedUser.value.message, trace.value)
            return 1
          } else {
            // Error during delete found!
            consoleLog('UserProjectSingle.vue/handelDelete', 2, linkedUser.value.message, trace.value)
            return 0
          }
        }).then(function (status) {
          // ask the userproject view to refresh the list
          consoleLog('UserProjectingle.vue/handelDelete', 2, 'Emit a request to the parent to refresh the list', trace.value)
          context.emit('refreshusersproject', status, linkedUser.value.message)
        })
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleConfirmation = () => {
      consoleLog('Projects.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
      showPopup.value = true
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleCancelDelete = () => {
      consoleLog('Projects.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
      showPopup.value = false
    }


    // --------------------------------------------------------------------------
    // User confirm the delete action
    // --------------------------------------------------------------------------
    const handleConfirmDelete = () => {
      consoleLog('Projects.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
      showPopup.value = false
      handelDelete()
    }




    return { showDetails, workspaceID, workspace, projectID, linkedUser, lastName, icon, role, actionAllowed, showPopup, handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete }
  }
}
</script>
  
<style scoped>
.userproject {
  position: relative;
  margin: 20px auto;
  background: white;
  padding: 10px 20px;
  border-top-right-radius: 1.5rem;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #2300e9;
  width: 80%;
}

.userproject.inactive {
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