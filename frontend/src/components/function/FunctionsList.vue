<template>
    <div class="entities">
      <div v-for="testfunction in testfunctions" :key="testfunction.functionID">
        <FunctionSingle :testfunction="testfunction" :superUser="superUser" :trace="trace" :id="testfunction.functionID" 
          :userID="userID" @refreshfunctions="refreshFunctions" @selectrecord="selectRecord" @handleinsert="handleInsert"
          @handlecopy="handleCopy" @handlemove="handleMove" @handledelete="handleDelete" />
      </div>
    </div>
  </template>
      
  <script>
  import { ref } from 'vue'
  import FunctionSingle from './FunctionSingle.vue'
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'testfunctions', 'superUser', 'userID', 'projectID'],
    components: { FunctionSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('FunctionsList.vue', trace.value)
      consoleLog('FunctionsList.vue - props', 1, props, trace.value)
  
      const workspaces = ref(props.workspaces)
      const superUser = ref(props.superUser)
  
  
      // --------------------------------------------------------------------------
      // FunctionSingle emits a request to refresh the references
      // --------------------------------------------------------------------------
      const refreshFunctions = (status, msg) => {
        consoleLog('FunctionsList.vue/refreshFunctions', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshfunctions', status, msg)
      }
  
      // --------------------------------------------------------------------------
      // FunctionSingle emits a request to select a reference
      // --------------------------------------------------------------------------
      const selectRecord = (todoID) => {
        consoleLog('FunctionsList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', todoID)
      }
  
      // --------------------------------------------------------------------------
      // FunctionSingle emits a request to insert reference(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('FunctionsList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // FunctionSingle emits a request to copy reference(s) after the record
      // --------------------------------------------------------------------------
      const handleCopy = (todoID) => {
        consoleLog('FunctionsList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
        context.emit('handlecopy', todoID)
      }
  
      // --------------------------------------------------------------------------
      // FunctionSingle emits a request to move reference(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('FunctionsList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // FunctionSingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (todoID) => {
        consoleLog('FunctionsList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', todoID)
      }
  
      return { trace, superUser, refreshFunctions, selectRecord, handleInsert, handleCopy, handleMove, handleDelete }
  
    }
  }
  </script>
      
  <style></style>