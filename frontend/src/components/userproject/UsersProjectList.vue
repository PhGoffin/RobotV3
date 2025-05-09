<template>
  <div class="usersproject">
    <div v-for="linkedUser in linkedUsers" :key="linkedUser.userID">
      <UserProjectSingle :linkedUser="linkedUser" :workspaceID="workspaceID" :workspace="workspace" :projectID="projectID" :trace="trace"
        :superUser="superUser" @refreshusersproject="refreshUsersProject" />
    </div>
  </div>
</template>
  
<script>
import { ref } from 'vue'
import UserProjectSingle from './UserProjectSingle.vue'
import { displayMsg, consoleLog } from '../../util/debug';


export default {
  props: ['trace', 'linkedUsers', 'workspaceID', 'projectID', 'workspace', 'superUser'],
  components: { UserProjectSingle },
  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('UsersProjectList.vue', trace.value)
    consoleLog('UsersProjectList.vue - props', 1, props, trace.value)


    const workspaceID = ref(props.workspaceID)
    const workspace = ref(props.workspace)
    const superUser = ref(props.superUser)
    const projectID = ref(props.projectID)


    // --------------------------------------------------------------------------
    // ProjectSingle emits a request to refresh the contracts
    // --------------------------------------------------------------------------
    const refreshUsersProject = (status, msg) => {
      consoleLog('UsersProjectList.vue/refreshUsersProject', 2, 'Emit a request to the parent to refresh the list', trace.value)
      context.emit('refreshusersproject', status, msg)
    }

    return { workspaceID, workspace, superUser, projectID, trace, refreshUsersProject }

  }
}
</script>
  
<style></style>