<template>
  <div class="users">
    <div v-for="user in users" :key="user.userID">
      <UserSingle :user="user" :workspaceID="workspaceID" :workspace="workspace" :trace="trace"
        :superUser="superUser" @refreshusers="refreshUsers" />
    </div>
  </div>
</template>
  
<script>
import { ref } from 'vue'
import UserSingle from './UserSingle.vue'
import { displayMsg, consoleLog } from '../../util/debug';


export default {
  props: ['trace', 'users', 'workspaceID', 'workspace', 'superUser'],
  components: { UserSingle },
  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('UsersList.vue', trace.value)
    consoleLog('UsersList.vue - props', 1, props, trace.value)


    const workspaceID = ref(props.workspaceID)
    const workspace = ref(props.workspace)
    const superUser = ref(props.superUser)


    // --------------------------------------------------------------------------
    // ProjectSingle emits a request to refresh the contracts
    // --------------------------------------------------------------------------
    const refreshUsers = (status, msg) => {
      consoleLog('UsersList.vue/refreshUsers', 2, 'Emit a request to the parent to refresh the list', trace.value)
      context.emit('refreshusers', status, msg)
    }

    return { workspaceID, workspace, superUser, trace, refreshUsers }

  }
}
</script>
  
<style></style>