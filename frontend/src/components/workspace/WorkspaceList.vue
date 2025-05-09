<template>
    <div class="projects" >
      <div v-for="workspace in workspaces" :key="workspace.workspaceID">
        <WorkspaceSingle :workspace="workspace" :superUser="superUser" :trace="trace"
        @refreshworkspaces="refreshWorkspaces" />
      </div>
    </div>
  </template>
    
  <script>
  import { ref } from 'vue'
  import WorkspaceSingle from './WorkspaceSingle.vue'
  import { displayMsg, consoleLog}  from '../../util/debug';
  
  export default {
    props: ['trace', 'workspaces', 'superUser'],
    components: { WorkspaceSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('WorkspaceList.vue', trace.value)    
      consoleLog ('WorkspaceList.vue - props', 1, props, trace.value)
  
      const workspaces = ref(props.workspaces)
      const superUser = ref(props.superUser)
  
  
          // --------------------------------------------------------------------------
          // WorkspaceSingle emits a request to refresh the workspaces
          // --------------------------------------------------------------------------
          const refreshWorkspaces = ( status, msg) => {
            consoleLog ('WorkspaceList.vue/refreshWorkspaces', 2, 'Emit a request to the parent to refresh the list', trace.value)
              context.emit('refreshworkspaces', status, msg)
          } 
         
            
      return { trace, workspaces, superUser, refreshWorkspaces }
  
    }
  }
  </script>
    
  <style>
  
  </style>