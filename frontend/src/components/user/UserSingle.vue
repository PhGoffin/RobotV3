<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div :class="user.active ? 'entity' : 'entity inactive'">

    <div class="actions">

      <h3 @click="showDetails = !showDetails" title="Click to show the details" class="data">
        <i :class="icon"></i> &nbsp;
        {{ lastName }} {{ user.firstName }}
      </h3>

      <div class="actions">

        <div class="icons" v-if="actionAllowed">
          <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the user"></i>
        </div>

        <div class="icons" v-if="actionAllowed">
          <router-link :to="{ name: 'UserEdit', params: { id: userID, workspaceID: workspaceID, workspace: workspace } }">
            <i class="fa-regular fa-pen-to-square" title="Edit the user"></i>
          </router-link>
        </div>

        <div class="icons" v-if="actionAllowed">
          <router-link
            :to="{ name: 'ChangePassword', params: { id: userID, workspaceID: workspaceID, workspace: workspace, location: location } }">
            <i class="fa-solid fa-key" title="Change password"></i>
          </router-link>
        </div>

      </div>

    </div>
    <div class="details" v-if="showDetails">
      <p>Id: {{ user.userID }}</p>
      <p v-if="user.superuser">
        Role: {{ role }} <br> Workspace: {{ workspace }} - Login: {{ user.login }}
      </p>
      <p v-else>
        Workspace: {{ workspace }} - Login: {{ user.login }}
      </p>
      <p>Updated by: {{ user.updatedby }} on: {{ user.updated }}</p>
    </div>

  </div>
</template>
  
<script>
import { computed, ref } from 'vue'
import deleteUser from '../../composables/user/deleteUser'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'


export default {
  props: ['trace', 'user', 'workspaceID', 'workspace', 'superUser'],
  components: { PopupConfirm },

  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('UserSingle.vue', trace.value)
    consoleLog('UserSingle.vue - props', 1, props, trace.value)

    const showDetails = ref(false)
    const showPopup = ref(false)
    const workspaceID = ref(props.workspaceID)
    const workspace = ref(props.workspace)
    const user = ref(props.user)
    const userID = ref(user.value.userID)
    const IamSuperUser = ref(props.superUser)
    const location = ref('Users')


    const lastName = computed(() => {
      if (user.value.lastName != undefined) {
        return user.value.lastName.toUpperCase()
      }
    });


    const icon = computed(() => {
      consoleLog('UserSingle.vue - icon computed', 2, 'icon - Super User: ' + user.value.superuser + ', Role: ' + user.value.role, trace.value)
      if (user.value.superuser == 1) {
        return "fa-solid fa-user-secret"
      }
      if (user.value.role === 'Tester') {
        return "fa-solid fa-user-gear"
      }
      if (user.value.role === 'Designer') {
        return "fa-solid fa-person-shelter"
      }
      if (user.value.role === 'Admin') {
        return "fa-solid fa-person-military-pointing"
      }
      return "fa-regular fa-circle-user"

    });


    const role = computed(() => {
      consoleLog('UserSingle.vue - role computed', 2, 'role - Super User: ' + user.value.superuser + ', Role: ' + user.value.role, trace.value)
      if (user.value.superuser == 1) {
        return "Super User"
      }
      return user.value.role

    });


    // -------------------------------------------
    // Manage the actions depending of the role of the user
    // -------------------------------------------
    const actionAllowed = computed(() => {
      consoleLog('UserSingle.vue/actionAllowed', 2, 'Action Allowed: Super User: ' + user.value.superuser + ', IamSuperUser: ' + IamSuperUser.value, trace.value)
      if ((user.value.superuser == 1 && IamSuperUser.value == 1) || user.value.superuser != 1) {
        consoleLog('UserSingle.vue/actionAllowed', 3, ' ==> Allowed', trace.value)
        return 1
      } else {
        consoleLog('UserSingle.vue/actionAllowed', 3, ' ==> NOT Allowed', trace.value)
        return 0
      }
    })


    // -------------------------------------------
    // User asks to delete a link
    // -------------------------------------------
    const handelDelete = () => {

      consoleLog('UserSingle.vue/handelDelete', 2, 'User asks to delete a user - workspace: ' + workspaceID.value + ', userID: ' + user.value.userID, trace.value)
      const { error, deleteTheUser } = deleteUser(workspaceID.value, user.value.userID)
      deleteTheUser(user, trace.value)
        .then(function () {
          consoleLog('UserSingle.vue/handelDelete', 2, '------ Delete user: ' + workspaceID.value + ', ' + user.value.userID, trace.value)
          consoleLog('UserSingle.vue/handelDelete', 2, user.value, trace.value)
          consoleLog('UserSingle.vue/handelDelete', 2, 'Success: ' + user.value.message, trace.value)

          if (user.value.success) {
            consoleLog('UserSingle.vue/handelDelete', 2, 'Message: ' + user.value.message, trace.value)
            return 1
          } else {
            // Error during delete found!
            consoleLog('UserSingle.vue/handelDelete', 2, user.value.message, trace.value)
            return 0
          }
        }).then(function (status) {
          // ask the user view to refresh the list
          consoleLog('UserProjectingle.vue/handelDelete', 2, 'Emit a request to the parent to refresh the list', trace.value)
          context.emit('refreshusers', status, user.value.message)
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




    return {
      showDetails, workspaceID, workspace, user, userID, lastName, icon, role, location, actionAllowed, showPopup,
      handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete
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