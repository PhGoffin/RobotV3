<template>
    <div class="entity">
      <div v-for="aiselector in aiselectors" :key="aiselector.aiselectorID">
        <AISelectorSingle :aiselector="aiselector" :superUser="superUser" :trace="trace" @refreshaiselectors="refreshaiselectors"
          @selectrecord="selectRecord" @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove"
          @handledelete="handleDelete" />
      </div>
    </div>
  </template>
      
  <script>
  import { ref } from 'vue'
  import AISelectorSingle from './AISelectorSingle.vue'
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'aiselectors', 'superUser'],
    components: { AISelectorSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('AISelectorList.vue', trace.value)
      consoleLog('AISelectorList.vue - props', 1, props, trace.value)
  
      const aiselectors = ref(props.aiselectors)
      const superUser = ref(props.superUser)
  
  
      // --------------------------------------------------------------------------
      // AISelectorSingle emits a request to refresh the aiselectors
      // --------------------------------------------------------------------------
      const refreshaiselectors = (status, msg) => {
        consoleLog('AISelectorList.vue/refreshWorkspaces', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshaiselectors', status, msg)
      }
  
      // --------------------------------------------------------------------------
      // AISelectorSingle emits a request to select a aiselector
      // --------------------------------------------------------------------------
      const selectRecord = (aiselectorID) => {
        consoleLog('AISelectorList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', aiselectorID)
      }
  
  
      // --------------------------------------------------------------------------
      // AISelectorSingle emits a request to insert aiselector(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('AISelectorList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // AISelectorSingle emits a request to copy aiselector(s) after the record
      // --------------------------------------------------------------------------
      const handleCopy = (aiselectorID) => {
        consoleLog('AISelectorList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
        context.emit('handlecopy', aiselectorID)
      }
  
      // --------------------------------------------------------------------------
      // AISelectorSingle emits a request to move aiselector(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('AISelectorList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // AISelectorSingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (aiselectorID) => {
        consoleLog('AISelectorList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', aiselectorID)
      }
  
      return { trace, aiselectors, superUser, refreshaiselectors, selectRecord, handleInsert, handleCopy, handleMove, handleDelete }
  
    }
  }
  </script>
      
  <style></style>