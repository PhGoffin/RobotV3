<template>
    <div class="entity">
      <div v-for="aitagattribute in aitagattributes" :key="aitagattribute.tagattributeID">
        <AITagAttributeSingle :aitagattribute="aitagattribute" :superUser="superUser" :trace="trace" @refreshtagattribute="refreshTagAttribute"
          @selectrecord="selectRecord" @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove"
          @handledelete="handleDelete" />
      </div>
    </div>
  </template>
      
  <script>
  import { ref } from 'vue'
  import AITagAttributeSingle from './AITagAttributeSingle.vue'
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'aitagattributes', 'superUser'],
    components: { AITagAttributeSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('AITagAttributeList.vue', trace.value)
      consoleLog('AITagAttributeList.vue - props', 1, props, trace.value)
  
      const aitagattributes = ref(props.aitagattributes)
      const superUser = ref(props.superUser)
  
  
      // --------------------------------------------------------------------------
      // AITagAttributeSingle emits a request to refresh the aitagattributes
      // --------------------------------------------------------------------------
      const refreshTagAttribute = (status, msg) => {
        consoleLog('AITagAttributeList.vue/refreshWorkspaces', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshtagattribute', status, msg)
      }
  
      // --------------------------------------------------------------------------
      // AITagAttributeSingle emits a request to select a aitagattribute
      // --------------------------------------------------------------------------
      const selectRecord = (tagattributeID) => {
        consoleLog('AITagAttributeList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', tagattributeID)
      }
  
  
      // --------------------------------------------------------------------------
      // AITagAttributeSingle emits a request to insert aitagattribute(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('AITagAttributeList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // AITagAttributeSingle emits a request to copy aitagattribute(s) after the record
      // --------------------------------------------------------------------------
      const handleCopy = (tagattributeID) => {
        consoleLog('AITagAttributeList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
        context.emit('handlecopy', tagattributeID)
      }
  
      // --------------------------------------------------------------------------
      // AITagAttributeSingle emits a request to move aitagattribute(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('AITagAttributeList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // AITagAttributeSingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (tagattributeID) => {
        consoleLog('AITagAttributeList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', tagattributeID)
      }
  
      return { trace, aitagattributes, superUser, refreshTagAttribute, selectRecord, handleInsert, handleCopy, handleMove, handleDelete }
  
    }
  }
  </script>
      
  <style></style>