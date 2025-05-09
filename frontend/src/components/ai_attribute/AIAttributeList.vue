<template>
    <div class="entity">
      <div v-for="aiattribute in aiattributes" :key="aiattribute.aiattributeID">
        <AIAttributeSingle :aiattribute="aiattribute" :superUser="superUser" :trace="trace" @refreshattribute="refreshAttribute"
          @selectrecord="selectRecord" @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove"
          @handledelete="handleDelete" />
      </div>
    </div>
  </template>
      
  <script>
  import { ref } from 'vue'
  import AIAttributeSingle from './AIAttributeSingle.vue'
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'aiattributes', 'superUser'],
    components: { AIAttributeSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('AIAttributeList.vue', trace.value)
      consoleLog('AIAttributeList.vue - props', 1, props, trace.value)
  
      const aiattributes = ref(props.aiattributes)
      const superUser = ref(props.superUser)
  
  
      // --------------------------------------------------------------------------
      // AIAttributeSingle emits a request to refresh the aiattributes
      // --------------------------------------------------------------------------
      const refreshAttribute = (status, msg) => {
        consoleLog('AIAttributeList.vue/refreshWorkspaces', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshAttribute', status, msg)
      }
  
      // --------------------------------------------------------------------------
      // AIAttributeSingle emits a request to select a aiattribute
      // --------------------------------------------------------------------------
      const selectRecord = (aiattributeID) => {
        consoleLog('AIAttributeList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', aiattributeID)
      }
  
  
      // --------------------------------------------------------------------------
      // AIAttributeSingle emits a request to insert aiattribute(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('AIAttributeList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // AIAttributeSingle emits a request to copy aiattribute(s) after the record
      // --------------------------------------------------------------------------
      const handleCopy = (aiattributeID) => {
        consoleLog('AIAttributeList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
        context.emit('handlecopy', aiattributeID)
      }
  
      // --------------------------------------------------------------------------
      // AIAttributeSingle emits a request to move aiattribute(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('AIAttributeList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // AIAttributeSingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (aiattributeID) => {
        consoleLog('AIAttributeList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', aiattributeID)
      }
  
      return { trace, aiattributes, superUser, refreshAttribute, selectRecord, handleInsert, handleCopy, handleMove, handleDelete }
  
    }
  }
  </script>
      
  <style></style>