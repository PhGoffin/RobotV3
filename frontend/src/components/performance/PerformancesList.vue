<template>
    <div class="entities">
      <div v-for="performance in performances" :key="performance.performanceID">
        <PerformanceSingle :performance="performance" :superUser="superUser" :trace="trace" :projectID="projectID"
          :subprojectID="subprojectID" :userID="userID" @refreshperformances="refreshPerformances" :location="location"
           />
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import PerformanceSingle from './PerformanceSingle.vue'
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'performances', 'superUser', 'userID', 'projectID', 'subprojectID', 'location'],
    components: { PerformanceSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('PerformancesList.vue', trace.value)
      consoleLog('PerformancesList.vue - props', 1, props, trace.value)
  
      const workspaces = ref(props.workspaces)
      const superUser = ref(props.superUser)
  
  
      // --------------------------------------------------------------------------
      // PerformanceSingle emits a request to refresh the performances
      // --------------------------------------------------------------------------
      const refreshPerformances = (status, msg) => {
        consoleLog('PerformancesList.vue/refreshPerformances', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshperformances', status, msg)
      }
  
  
      return { trace, superUser, refreshPerformances}
  
    }
  }
  </script>
  
  <style></style>