<template>
  <div class="projects" >
    <!-- style="overflow-y:scroll;" -->
    <div v-for="project in projects" :key="project.projectID">
      <ProjectSingle :project="project" :projectID="projectID"  :workspaceID="workspaceID" :workspace="workspace"  :superUser="superUser" :trace="trace"
      @refreshprojects="refreshProjects" @storelocation="storeLocation"/>
    </div>
  </div>
</template>
  
<script>
import { ref } from 'vue'
import ProjectSingle from './ProjectSingle.vue'
import { displayMsg, consoleLog}  from '../../util/debug';

export default {
  props: ['trace', 'projects', 'projectID', 'workspaceID', 'workspace', 'superUser'],
  components: { ProjectSingle },
  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('ProjectList.vue', trace.value)    
    consoleLog ('ProjectList.vue - props', 1, props, trace.value)

    const workspaceID = ref(props.workspaceID)
    const projectID = ref(props.projectID)
    const workspace = ref(props.workspace)
    const superUser = ref(props.superUser)


        // --------------------------------------------------------------------------
        // ProjectSingle emits a request to refresh the contracts
        // --------------------------------------------------------------------------
        const refreshProjects = ( status, msg) => {
          consoleLog ('ProjectList.vue/refreshProjects', 2, 'Emit a request to the parent to refresh the list', trace.value)
            context.emit('refreshprojects', status, msg)
        } 
       
        // --------------------------------------------------------------------------
        // ProjectSingle emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = ( location) => {
          consoleLog ('ProjectList.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
            context.emit('storelocation', location)
        } 
        
        // --------------------------------------------------------------------------
        // ProjectSingle emits a request to refresh the contracts
        // --------------------------------------------------------------------------
        // const storeContract = ( projectID, projectName) => {
        //   consoleLog ('ProjectList.vue/storeContract', 2, 'Received and Emit a request to the parent to store the contract (' + projectID + ') ' + projectName, trace.value)
        //     context.emit('storecontract', projectID, projectName)
        // }        

    return { trace, workspaceID, workspace, superUser, projectID, refreshProjects, storeLocation }

  }
}
</script>
  
<style>

</style>