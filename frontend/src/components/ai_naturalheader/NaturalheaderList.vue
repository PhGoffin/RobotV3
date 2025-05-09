<template>
    <div class="entities">
      <div v-for="naturalheader in naturalheaders" :key="naturalheader.naturalheaderID">
        <naturalheaderSingle :naturalheader="naturalheader" :superUser="superUser" :trace="trace" :projectID="projectID" :subprojectID="subprojectID"
          :userID="userID" :location="location" @refreshnaturalheaders="refreshnaturalheaders" @selectrecord="selectRecord" @handleinsert="handleInsert"
          @handlecopy="handleCopy" @handlemove="handleMove" @handledelete="handleDelete" @storelocation="storeLocation"/>
      </div>
    </div>
  </template>
      
  <script>
  import { ref } from 'vue'
  import naturalheaderSingle from "./NaturalheaderSingle.vue"
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'naturalheaders', 'superUser', 'userID', 'projectID',  'subprojectID', 'location'],
    components: { naturalheaderSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('NaturalheaderList.vue', trace.value)
      consoleLog('NaturalheaderList.vue - props', 1, props, trace.value)
  
      const workspaces = ref(props.workspaces)
      const superUser = ref(props.superUser)
  

      // --------------------------------------------------------------------------
      // naturalheaderSingle emits a request to refresh the naturalheaders
      // --------------------------------------------------------------------------
      const refreshnaturalheaders = (status, msg) => {
        consoleLog('NaturalheaderList.vue/refreshnaturalheaders', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshnaturalheaders', status, msg)
      }

        // --------------------------------------------------------------------------
        // naturalheaderSingle emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = ( location) => {
          consoleLog ('NaturalheaderList.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
            context.emit('storelocation', location)
        } 
    
      // --------------------------------------------------------------------------
      // naturalheaderSingle emits a request to select a naturalheader
      // --------------------------------------------------------------------------
      const selectRecord = (todoID) => {
        consoleLog('NaturalheaderList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', todoID)
      }
  
      // --------------------------------------------------------------------------
      // naturalheaderSingle emits a request to insert naturalheader(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('NaturalheaderList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // naturalheaderSingle emits a request to copy naturalheader(s) after the record
      // --------------------------------------------------------------------------
      const handleCopy = (todoID) => {
        consoleLog('NaturalheaderList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
        context.emit('handlecopy', todoID)
      }
  
      // --------------------------------------------------------------------------
      // naturalheaderSingle emits a request to move naturalheader(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('NaturalheaderList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // naturalheaderSingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (todoID) => {
        consoleLog('NaturalheaderList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', todoID)
      }
  
      return { trace, superUser, refreshnaturalheaders, selectRecord, handleInsert, handleCopy, handleMove, handleDelete, storeLocation }
  
    }
  }
  </script>
      
  <style></style>