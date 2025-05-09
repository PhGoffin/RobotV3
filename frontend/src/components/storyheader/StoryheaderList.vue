<template>
    <div class="entities">
      <div v-for="storyheader in storyheaders" :key="storyheader.storyheaderID">
        <StoryheaderSingle :storyheader="storyheader" :superUser="superUser" :trace="trace" :projectID="projectID" :currentuser="userName"
          :subprojectID="subprojectID" :userID="userID" @refreshstoryheaders="refreshStoryheaders" :location="location" @selectrecord="selectRecord"
          @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove" @handledelete="handleDelete"
          @storelocation="storeLocation" />
      </div>
    </div>
  </template>
        
  <script>
  import { ref } from 'vue'
  import StoryheaderSingle from './StoryheaderSingle.vue'
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'storyheaders', 'superUser', 'userID', 'currentuser', 'projectID', 'subprojectID', 'location'],
    components: { StoryheaderSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('StoryheaderList.vue', trace.value)
      consoleLog('StoryheaderList.vue - props', 1, props, trace.value)
  
      const workspaces = ref(props.workspaces)
      const superUser = ref(props.superUser)
      const userName = ref(props.currentuser)
  
  
      // --------------------------------------------------------------------------
      // StoryheaderSingle emits a request to refresh the storyheaders
      // --------------------------------------------------------------------------
      const refreshStoryheaders = (status, msg, reload) => {
        consoleLog('StoryheaderList.vue/refreshStoryheaders', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshstoryheaders', status, msg, reload)
      }
  
      // --------------------------------------------------------------------------
      // StoryheaderSingle emits a request to select a storyheader
      // --------------------------------------------------------------------------
      const selectRecord = (todoID) => {
        consoleLog('StoryheaderList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', todoID)
      }
  
      // --------------------------------------------------------------------------
      // StoryheaderSingle emits a request to update the location
      // --------------------------------------------------------------------------
      const storeLocation = (location) => {
        consoleLog('StoryheaderList.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
        context.emit('storelocation', location)
      }
  
      // --------------------------------------------------------------------------
      // StoryheaderSingle emits a request to insert storyheader(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('StoryheaderList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // StoryheaderSingle emits a request to copy storyheader(s) after the record
      // --------------------------------------------------------------------------
      const handleCopy = (todoID) => {
        consoleLog('StoryheaderList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
        context.emit('handlecopy', todoID)
      }
  
      // --------------------------------------------------------------------------
      // StoryheaderSingle emits a request to move storyheader(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('StoryheaderList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // StoryheaderSingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (todoID) => {
        consoleLog('StoryheaderList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', todoID)
      }
  
      return { trace, superUser, userName, refreshStoryheaders, selectRecord, handleInsert, handleCopy, handleMove, handleDelete, storeLocation }
  
    }
  }
  </script>
        
  <style></style>