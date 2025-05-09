<template>
    <div class="entities">
      <div v-for="suiteheader in suiteheaders" :key="suiteheader.suiteheaderID">
        <SuiteheaderSingle :suiteheader="suiteheader" :superUser="superUser" :trace="trace" :projectID="projectID" :currentuser="userName"
          :subprojectID="subprojectID" :userID="userID" @refreshsuiteheaders="refreshSuiteheaders" :location="location" @selectrecord="selectRecord"
          @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove" @handledelete="handleDelete"
          @storelocation="storeLocation" />
      </div>
    </div>
  </template>
        
  <script>
  import { ref } from 'vue'
  import SuiteheaderSingle from './SuiteheaderSingle.vue'
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'suiteheaders', 'superUser', 'userID', 'currentuser', 'projectID', 'subprojectID', 'location'],
    components: { SuiteheaderSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('SuiteheaderList.vue', trace.value)
      consoleLog('SuiteheaderList.vue - props', 1, props, trace.value)
  
      const workspaces = ref(props.workspaces)
      const superUser = ref(props.superUser)
      const userName = ref(props.currentuser)

  
      // --------------------------------------------------------------------------
      // SuiteheaderSingle emits a request to refresh the suiteheaders
      // --------------------------------------------------------------------------
      const refreshSuiteheaders = (status, msg, reload) => {
        consoleLog('SuiteheaderList.vue/refreshSuiteheaders', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshsuiteheaders', status, msg, reload)
      }
  
      // --------------------------------------------------------------------------
      // SuiteheaderSingle emits a request to select a suiteheader
      // --------------------------------------------------------------------------
      const selectRecord = (todoID) => {
        consoleLog('SuiteheaderList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', todoID)
      }
  
      // --------------------------------------------------------------------------
      // SuiteheaderSingle emits a request to update the location
      // --------------------------------------------------------------------------
      const storeLocation = (location) => {
        consoleLog('SuiteheaderList.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
        context.emit('storelocation', location)
      }
  
      // --------------------------------------------------------------------------
      // SuiteheaderSingle emits a request to insert suiteheader(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('SuiteheaderList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // SuiteheaderSingle emits a request to copy suiteheader(s) after the record
      // --------------------------------------------------------------------------
      const handleCopy = (todoID) => {
        consoleLog('SuiteheaderList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
        context.emit('handlecopy', todoID)
      }
  
      // --------------------------------------------------------------------------
      // SuiteheaderSingle emits a request to move suiteheader(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('SuiteheaderList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // SuiteheaderSingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (todoID) => {
        consoleLog('SuiteheaderList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', todoID)
      }
  
      return { trace, superUser, userName, refreshSuiteheaders, selectRecord, handleInsert, handleCopy, handleMove, handleDelete, storeLocation }
  
    }
  }
  </script>
        
  <style></style>