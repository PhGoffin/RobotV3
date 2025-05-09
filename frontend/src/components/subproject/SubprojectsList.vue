<template>
  <div class="subprojects">
    <!--  -->
    <div v-for="subproject in subprojects" :key="subproject.subprojectID">
      <SubprojectSingle :subproject="subproject" :projectID="projectID" :superUser="superUser" :trace="trace"
        @refreshsubprojects="refreshSubprojects" @selectrecord="selectRecord" @handlemove="handleMove" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import SubprojectSingle from './SubprojectSingle.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
  props: ['trace', 'subprojects', 'projectID', 'superUser'],
  components: { SubprojectSingle },
  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('SubprojectList.vue', trace.value)
    consoleLog('SubprojectList.vue - props', 1, props, trace.value)

    const projectID = ref(props.projectID)
    const superUser = ref(props.superUser)
    const subprojects = ref(props.subprojects)


    // --------------------------------------------------------------------------
    // SubprojectSingle emits a request to refresh the subproject
    // --------------------------------------------------------------------------
    const refreshSubprojects = (status, msg) => {
      consoleLog('SubprojectList.vue/refreshSubprojects', 2, 'Emit a request to the parent to refresh the list', trace.value)
      context.emit('refreshsubprojects', status, msg)
    }

    // --------------------------------------------------------------------------
    // SubprojectSingle emits a request to select a subproject
    // --------------------------------------------------------------------------
    const selectRecord = (subprojectID) => {
      consoleLog('SubprojectList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
      context.emit('selectrecord', subprojectID)
    }

    // --------------------------------------------------------------------------
    // SubprojectSingle emits a request to move reference(s) after the record
    // --------------------------------------------------------------------------
    const handleMove = (position) => {
      consoleLog('SubprojectList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', position)
    }    


    return { subprojects, projectID, superUser, trace, refreshSubprojects, selectRecord, handleMove }

  }
}
</script>

<style></style>