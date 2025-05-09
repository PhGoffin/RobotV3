<template>
    <div class="entities">
      <div v-for="dummyuser in dummyusers" :key="dummyuser.dummyuserID">
        <DummyuserSingle :dummyuser="dummyuser" :superUser="superUser" :trace="trace" :projectID="projectID" :subprojectID="subprojectID"
          :userID="userID" :location="location" @refreshdummyusers="refreshDummyusers" @selectrecord="selectRecord" @handleinsert="handleInsert"
          @handlecopy="handleCopy" @handlemove="handleMove" @handledelete="handleDelete" @storelocation="storeLocation"/>
      </div>
    </div>
  </template>
      
  <script>
  import { ref } from 'vue'
  import DummyuserSingle from './DummyuserSingle.vue'
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'dummyusers', 'superUser', 'userID', 'projectID',  'subprojectID', 'location'],
    components: { DummyuserSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('DummyusersList.vue', trace.value)
      consoleLog('DummyusersList.vue - props', 1, props, trace.value)
  
      const workspaces = ref(props.workspaces)
      const superUser = ref(props.superUser)
  

      // --------------------------------------------------------------------------
      // DummyuserSingle emits a request to refresh the dummyusers
      // --------------------------------------------------------------------------
      const refreshDummyusers = (status, msg) => {
        consoleLog('DummyusersList.vue/refreshDummyusers', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshdummyusers', status, msg)
      }

        // --------------------------------------------------------------------------
        // DummyuserSingle emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = ( location) => {
          consoleLog ('DummyusersList.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
            context.emit('storelocation', location)
        } 
    
      // --------------------------------------------------------------------------
      // DummyuserSingle emits a request to select a dummyuser
      // --------------------------------------------------------------------------
      const selectRecord = (todoID) => {
        consoleLog('DummyusersList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', todoID)
      }
  
      // --------------------------------------------------------------------------
      // DummyuserSingle emits a request to insert dummyuser(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('DummyusersList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // DummyuserSingle emits a request to copy dummyuser(s) after the record
      // --------------------------------------------------------------------------
      const handleCopy = (todoID) => {
        consoleLog('DummyusersList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
        context.emit('handlecopy', todoID)
      }
  
      // --------------------------------------------------------------------------
      // DummyuserSingle emits a request to move dummyuser(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('DummyusersList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // DummyuserSingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (todoID) => {
        consoleLog('DummyusersList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', todoID)
      }
  
      return { trace, superUser, refreshDummyusers, selectRecord, handleInsert, handleCopy, handleMove, handleDelete, storeLocation }
  
    }
  }
  </script>
      
  <style></style>