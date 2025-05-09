<template>
    <div class="entities">
      <div v-for="natural in naturals" :key="natural.naturalID">
        <NaturalSingle :natural="natural" :superUser="superUser" :trace="trace" :projectID="projectID" :subprojectID="subprojectID"
          :userID="userID" :location="location" @refreshnaturals="refreshNaturals" @selectrecord="selectRecord" @handleinsert="handleInsert"
          @handlecopy="handleCopy" @handlemove="handleMove" @handledelete="handleDelete" @storelocation="storeLocation"/>
      </div>
    </div>
  </template>
      
  <script>
  import { ref } from 'vue'
  import NaturalSingle from './NaturalSingle.vue'
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'naturals', 'superUser', 'userID', 'projectID',  'subprojectID', 'location'],
    components: { NaturalSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('NaturalList.vue', trace.value)
      consoleLog('NaturalList.vue - props', 1, props, trace.value)
  
      const workspaces = ref(props.workspaces)
      const superUser = ref(props.superUser)
  

      // --------------------------------------------------------------------------
      // NaturalSingle emits a request to refresh the naturals
      // --------------------------------------------------------------------------
      const refreshNaturals = (status, msg) => {
        consoleLog('NaturalList.vue/refreshNaturals', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshnaturals', status, msg)
      }

        // --------------------------------------------------------------------------
        // NaturalSingle emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = ( location) => {
          consoleLog ('NaturalList.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
            context.emit('storelocation', location)
        } 
    
      // --------------------------------------------------------------------------
      // NaturalSingle emits a request to select a dictionary
      // --------------------------------------------------------------------------
      const selectRecord = (todoID) => {
        consoleLog('NaturalList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', todoID)
      }
  
      // --------------------------------------------------------------------------
      // NaturalSingle emits a request to insert dictionary(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('NaturalList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // NaturalSingle emits a request to copy dictionary(s) after the record
      // --------------------------------------------------------------------------
      const handleCopy = (todoID) => {
        consoleLog('NaturalList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
        context.emit('handlecopy', todoID)
      }
  
      // --------------------------------------------------------------------------
      // NaturalSingle emits a request to move dictionary(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('NaturalList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // NaturalSingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (todoID) => {
        consoleLog('NaturalList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', todoID)
      }
  
      return { trace, superUser, refreshNaturals, selectRecord, handleInsert, handleCopy, handleMove, handleDelete, storeLocation }
  
    }
  }
  </script>
      
  <style></style>