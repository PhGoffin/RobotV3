<template>
  <div class="scenarios">
    <!-- style="overflow-y:scroll;" -->
    <div v-for="scenario in scenarios" :key="scenario.scenarioID">
      <ScenarioSingle :scenario="scenario" :workspaceID="workspaceID" :workspace="workspace" :superUser="superUser" :location="location"
        :projectID="projectID" :userID="userID" :currentuser="userName" :trace="trace" @handlecopy="handleCopy" @handlemove="handleMove" @selectrecord="selectRecord"
        @refreshscenarios="refreshScenarios" @storelocation="storeLocation" />
    </div>
  </div>
</template>
    
<script>
import { ref } from 'vue'
import ScenarioSingle from './ScenarioSingle.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
  props: ['trace', 'scenarios', 'workspaceID', 'workspace', 'superUser', 'userID', 'currentuser', 'projectID', 'location'],
  components: { ScenarioSingle },
  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('ScenariosList.vue', trace.value)
    consoleLog('ScenariosList.vue - props', 1, props, trace.value)

    const workspaceID = ref(props.workspaceID)
    const workspace = ref(props.workspace)
    const superUser = ref(props.superUser)
    const userName = ref(props.currentuser)


    // --------------------------------------------------------------------------
    // ScenarioSingle emits a request to refresh the scenarios
    // --------------------------------------------------------------------------
    const refreshScenarios = (status, msg, reload) => {
      consoleLog('ScenariosList.vue/refreshScenarios', 2, 'Emit a request to the parent to refresh the list', trace.value)
      context.emit('refreshscenarios', status, msg, reload)
    }

    // --------------------------------------------------------------------------
    // ScenarioSingle emits a request to update the location
    // --------------------------------------------------------------------------
    const storeLocation = (location) => {
      consoleLog('ScenariosList.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
      context.emit('storelocation', location)
    }

    // --------------------------------------------------------------------------
    // ScenarioSingle emits a request to select a scenario
    // --------------------------------------------------------------------------
    const selectRecord = (scenarioID) => {
      consoleLog('ReferencesList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
      context.emit('selectrecord', scenarioID)
    }


    // --------------------------------------------------------------------------
    // ScenarioSingle emits a request to copy scenario(s) after the record
    // --------------------------------------------------------------------------
    const handleCopy = (todoID) => {
      consoleLog('ReferencesList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', todoID)
    }

    // --------------------------------------------------------------------------
    // ScenarioSingle emits a request to move scenario(s) after the record
    // --------------------------------------------------------------------------
    const handleMove = (position) => {
      consoleLog('ReferencesList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', position)
    }

    return { trace, workspaceID, workspace, superUser, userName, refreshScenarios, storeLocation, handleCopy, handleMove, selectRecord }

  }
}
</script>
    
<style></style>