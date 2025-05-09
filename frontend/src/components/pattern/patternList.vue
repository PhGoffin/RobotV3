<template>
    <div class="entity">
      <div v-for="pattern in patterns" :key="pattern.patternID">
        <patternSingle :pattern="pattern" :superUser="superUser" :trace="trace" @refreshpatterns="refreshpatterns"
          @selectrecord="selectRecord" @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove"
          @handledelete="handleDelete" />
      </div>
    </div>
  </template>
      
  <script>
  import { ref } from 'vue'
  import patternSingle from './patternSingle.vue'
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'patterns', 'superUser'],
    components: { patternSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('patternList.vue', trace.value)
      consoleLog('patternList.vue - props', 1, props, trace.value)
  
      const patterns = ref(props.patterns)
      const superUser = ref(props.superUser)
  
  
      // --------------------------------------------------------------------------
      // patternSingle emits a request to refresh the patterns
      // --------------------------------------------------------------------------
      const refreshpatterns = (status, msg) => {
        consoleLog('patternList.vue/refreshWorkspaces', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshpatterns', status, msg)
      }
  
      // --------------------------------------------------------------------------
      // patternSingle emits a request to select a pattern
      // --------------------------------------------------------------------------
      const selectRecord = (patternID) => {
        consoleLog('patternList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', patternID)
      }
  
  
      // --------------------------------------------------------------------------
      // patternSingle emits a request to insert pattern(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('patternList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // patternSingle emits a request to copy pattern(s) after the record
      // --------------------------------------------------------------------------
      const handleCopy = (patternID) => {
        consoleLog('patternList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
        context.emit('handlecopy', patternID)
      }
  
      // --------------------------------------------------------------------------
      // patternSingle emits a request to move pattern(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('patternList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // patternSingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (patternID) => {
        consoleLog('patternList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', patternID)
      }
  
      return { trace, patterns, superUser, refreshpatterns, selectRecord, handleInsert, handleCopy, handleMove, handleDelete }
  
    }
  }
  </script>
      
  <style></style>