<template>
    <div class="entities">
      <div v-for="datasetheader in datasetheaders" :key="datasetheader.datasetheaderID">
        <DatasetheaderSingle :datasetheader="datasetheader" :superUser="superUser" :trace="trace" :projectID="projectID"
          :subprojectID="subprojectID" :userID="userID" @refreshdatasetheaders="refreshDatasetheaders" :location="location" @selectrecord="selectRecord"
          @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove" @handledelete="handleDelete"
          @storelocation="storeLocation" />
      </div>
    </div>
  </template>
        
  <script>
  import { ref } from 'vue'
  import DatasetheaderSingle from './DatasetheaderSingle.vue'
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'datasetheaders', 'superUser', 'userID', 'projectID', 'subprojectID', 'location'],
    components: { DatasetheaderSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('DatasetheadersList.vue', trace.value)
      consoleLog('DatasetheadersList.vue - props', 1, props, trace.value)
  
      const workspaces = ref(props.workspaces)
      const superUser = ref(props.superUser)
  
  
      // --------------------------------------------------------------------------
      // DatasetheaderSingle emits a request to refresh the datasetheaders
      // --------------------------------------------------------------------------
      const refreshDatasetheaders = (status, msg) => {
        consoleLog('DatasetheadersList.vue/refreshDatasetheaders', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshdatasetheaders', status, msg)
      }
  
      // --------------------------------------------------------------------------
      // DatasetheaderSingle emits a request to select a datasetheader
      // --------------------------------------------------------------------------
      const selectRecord = (todoID) => {
        consoleLog('DatasetheadersList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', todoID)
      }
  
      // --------------------------------------------------------------------------
      // DatasetheaderSingle emits a request to update the location
      // --------------------------------------------------------------------------
      const storeLocation = (location) => {
        consoleLog('DatasetheadersList.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
        context.emit('storelocation', location)
      }
  
      // --------------------------------------------------------------------------
      // DatasetheaderSingle emits a request to insert datasetheader(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('DatasetheadersList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // DatasetheaderSingle emits a request to copy datasetheader(s) after the record
      // --------------------------------------------------------------------------
      const handleCopy = (todoID) => {
        consoleLog('DatasetheadersList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
        context.emit('handlecopy', todoID)
      }
  
      // --------------------------------------------------------------------------
      // DatasetheaderSingle emits a request to move datasetheader(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('DatasetheadersList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // DatasetheaderSingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (todoID) => {
        consoleLog('DatasetheadersList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', todoID)
      }
  
      return { trace, superUser, refreshDatasetheaders, selectRecord, handleInsert, handleCopy, handleMove, handleDelete, storeLocation }
  
    }
  }
  </script>
        
  <style></style>