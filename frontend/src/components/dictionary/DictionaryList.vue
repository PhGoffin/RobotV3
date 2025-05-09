<template>
    <div class="entities">
      <div v-for="dictionary in dictionaries" :key="dictionary.dictionaryID">
        <DictionarySingle :dictionary="dictionary" :superUser="superUser" :trace="trace" :projectID="projectID" :subprojectID="subprojectID"
          :userID="userID" :location="location" @refreshdictionaries="refreshDictionaries" @selectrecord="selectRecord" @handleinsert="handleInsert"
          @handlecopy="handleCopy" @handlemove="handleMove" @handledelete="handleDelete" @storelocation="storeLocation"/>
      </div>
    </div>
  </template>
      
  <script>
  import { ref } from 'vue'
  import DictionarySingle from './DictionarySingle.vue'
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'dictionaries', 'superUser', 'userID', 'projectID',  'subprojectID', 'location'],
    components: { DictionarySingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('DictionarieList.vue', trace.value)
      consoleLog('DictionarieList.vue - props', 1, props, trace.value)
  
      const workspaces = ref(props.workspaces)
      const superUser = ref(props.superUser)
  

      // --------------------------------------------------------------------------
      // DictionarySingle emits a request to refresh the dictionaries
      // --------------------------------------------------------------------------
      const refreshDictionaries = (status, msg) => {
        consoleLog('DictionarieList.vue/refreshDictionaries', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshdictionaries', status, msg)
      }

        // --------------------------------------------------------------------------
        // DictionarySingle emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = ( location) => {
          consoleLog ('DictionarieList.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
            context.emit('storelocation', location)
        } 
    
      // --------------------------------------------------------------------------
      // DictionarySingle emits a request to select a dictionary
      // --------------------------------------------------------------------------
      const selectRecord = (todoID) => {
        consoleLog('DictionarieList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', todoID)
      }
  
      // --------------------------------------------------------------------------
      // DictionarySingle emits a request to insert dictionary(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('DictionarieList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // DictionarySingle emits a request to copy dictionary(s) after the record
      // --------------------------------------------------------------------------
      const handleCopy = (todoID) => {
        consoleLog('DictionarieList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
        context.emit('handlecopy', todoID)
      }
  
      // --------------------------------------------------------------------------
      // DictionarySingle emits a request to move dictionary(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('DictionarieList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // DictionarySingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (todoID) => {
        consoleLog('DictionarieList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', todoID)
      }
  
      return { trace, superUser, refreshDictionaries, selectRecord, handleInsert, handleCopy, handleMove, handleDelete, storeLocation }
  
    }
  }
  </script>
      
  <style></style>