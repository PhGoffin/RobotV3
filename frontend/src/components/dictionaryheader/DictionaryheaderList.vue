<template>
    <div class="entities">
      <div v-for="dictionaryheader in dictionaryheaders" :key="dictionaryheader.dictionaryheaderID">
        <DictionaryheaderSingle :dictionaryheader="dictionaryheader" :superUser="superUser" :trace="trace" :projectID="projectID" :subprojectID="subprojectID"
          :userID="userID" :location="location" @refreshdictionaryheaders="refreshDictionaryheaders" @selectrecord="selectRecord" @handleinsert="handleInsert"
          @handlecopy="handleCopy" @handlemove="handleMove" @handledelete="handleDelete" @storelocation="storeLocation"/>
      </div>
    </div>
  </template>
      
  <script>
  import { ref } from 'vue'
  import DictionaryheaderSingle from "./DictionaryheaderSingle.vue"
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'dictionaryheaders', 'superUser', 'userID', 'projectID',  'subprojectID', 'location'],
    components: { DictionaryheaderSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('DictionarieList.vue', trace.value)
      consoleLog('DictionarieList.vue - props', 1, props, trace.value)
  
      const workspaces = ref(props.workspaces)
      const superUser = ref(props.superUser)
  

      // --------------------------------------------------------------------------
      // DictionaryheaderSingle emits a request to refresh the dictionaryheaders
      // --------------------------------------------------------------------------
      const refreshDictionaryheaders = (status, msg) => {
        consoleLog('DictionarieList.vue/refreshDictionaryheaders', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshdictionaryheaders', status, msg)
      }

        // --------------------------------------------------------------------------
        // DictionaryheaderSingle emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = ( location) => {
          consoleLog ('DictionarieList.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
            context.emit('storelocation', location)
        } 
    
      // --------------------------------------------------------------------------
      // DictionaryheaderSingle emits a request to select a dictionaryheader
      // --------------------------------------------------------------------------
      const selectRecord = (todoID) => {
        consoleLog('DictionarieList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', todoID)
      }
  
      // --------------------------------------------------------------------------
      // DictionaryheaderSingle emits a request to insert dictionaryheader(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('DictionarieList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // DictionaryheaderSingle emits a request to copy dictionaryheader(s) after the record
      // --------------------------------------------------------------------------
      const handleCopy = (todoID) => {
        consoleLog('DictionarieList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
        context.emit('handlecopy', todoID)
      }
  
      // --------------------------------------------------------------------------
      // DictionaryheaderSingle emits a request to move dictionaryheader(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('DictionarieList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // DictionaryheaderSingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (todoID) => {
        consoleLog('DictionarieList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', todoID)
      }
  
      return { trace, superUser, refreshDictionaryheaders, selectRecord, handleInsert, handleCopy, handleMove, handleDelete, storeLocation }
  
    }
  }
  </script>
      
  <style></style>