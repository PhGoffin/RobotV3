<template>
    <div class="entity">
      <div v-for="aipath in aipaths" :key="aipath.aipathID">
        <AIPathSingle :aipath="aipath" :superUser="superUser" :trace="trace" @refreshPath="refreshPath"
          @selectrecord="selectRecord" @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove"
          @handledelete="handleDelete" />
      </div>
    </div>
  </template>
      
  <script>
  import { ref } from 'vue'
  import AIPathSingle from './AIPathSingle.vue'
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'aipaths', 'superUser'],
    components: { AIPathSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('AIPathList.vue', trace.value)
      consoleLog('AIPathList.vue - props', 1, props, trace.value)
  
      const aipaths = ref(props.aipaths)
      const superUser = ref(props.superUser)
  
  
      // --------------------------------------------------------------------------
      // AIPathSingle emits a request to refresh the aipaths
      // --------------------------------------------------------------------------
      const refreshPath = (status, msg) => {
        consoleLog('AIPathList.vue/refreshWorkspaces', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshPath', status, msg)
      }
  
      // --------------------------------------------------------------------------
      // AIPathSingle emits a request to select a aipath
      // --------------------------------------------------------------------------
      const selectRecord = (aipathID) => {
        consoleLog('AIPathList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', aipathID)
      }
  
  
      // --------------------------------------------------------------------------
      // AIPathSingle emits a request to insert aipath(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('AIPathList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // AIPathSingle emits a request to copy aipath(s) after the record
      // --------------------------------------------------------------------------
      const handleCopy = (aipathID) => {
        consoleLog('AIPathList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
        context.emit('handlecopy', aipathID)
      }
  
      // --------------------------------------------------------------------------
      // AIPathSingle emits a request to move aipath(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('AIPathList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // AIPathSingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (aipathID) => {
        consoleLog('AIPathList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', aipathID)
      }
  
      return { trace, aipaths, superUser, refreshPath, selectRecord, handleInsert, handleCopy, handleMove, handleDelete }
  
    }
  }
  </script>
      
  <style></style>