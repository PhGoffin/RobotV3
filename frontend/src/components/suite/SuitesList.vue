<template>
    <div class="entities">
      <div v-for="suite in suites" :key="suite.suiteID">
        <SuiteSingle :suite="suite" :superUser="superUser" :trace="trace" :projectID="projectID" :subprojectID="subprojectID"
          :userID="userID" @refreshsuites="refreshSuites" @selectrecord="selectRecord" @handleinsert="handleInsert"
          @handlemove="handleMove" @handledelete="handleDelete" @storelocation="storeLocation" />
      </div>
    </div>
  </template>
      
  <script>
  import { ref } from 'vue'
  import SuiteSingle from './SuiteSingle.vue'
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'suites', 'superUser', 'userID', 'projectID',  'subprojectID'],
    components: { SuiteSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('SuitesList.vue', trace.value)
      consoleLog('SuitesList.vue - props', 1, props, trace.value)
  
      const workspaces = ref(props.workspaces)
      const superUser = ref(props.superUser)
  
  
      // --------------------------------------------------------------------------
      // SuiteSingle emits a request to refresh the suites
      // --------------------------------------------------------------------------
      const refreshSuites = (status, msg) => {
        consoleLog('SuitesList.vue/refreshSuites', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshsuites', status, msg)
      }
  
  
      // --------------------------------------------------------------------------
      // SuiteSingle emits a request to select a suite
      // --------------------------------------------------------------------------
      const selectRecord = (todoID) => {
        consoleLog('SuitesList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', todoID)
      }
  
  
      // --------------------------------------------------------------------------
      // SuiteSingle emits a request to insert suite(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('SuitesList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // SuiteSingle emits a request to move suite(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('SuitesList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // SuiteSingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (todoID) => {
        consoleLog('SuitesList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', todoID)
      }
  
      return { trace, superUser, refreshSuites, selectRecord, handleInsert, handleMove, handleDelete }
  
    }
  }
  </script>
      
  <style></style>