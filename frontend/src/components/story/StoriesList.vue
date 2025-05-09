<template>
    <div class="entities">
      <div v-for="story in stories" :key="story.storyID">
        <StorySingle :story="story" :superUser="superUser" :trace="trace" :projectID="projectID" :subprojectID="subprojectID"
          :userID="userID" @refreshstories="refreshStories" @selectrecord="selectRecord" @handleinsert="handleInsert"
          @handlemove="handleMove" @handledelete="handleDelete" />
      </div>
    </div>
  </template>
      
  <script>
  import { ref } from 'vue'
  import StorySingle from './StorySingle.vue'
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'stories', 'superUser', 'userID', 'projectID',  'subprojectID'],
    components: { StorySingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('StoriesList.vue', trace.value)
      consoleLog('StoriesList.vue - props', 1, props, trace.value)
  
      const workspaces = ref(props.workspaces)
      const superUser = ref(props.superUser)
  
  
      // --------------------------------------------------------------------------
      // StorySingle emits a request to refresh the stories
      // --------------------------------------------------------------------------
      const refreshStories = (status, msg) => {
        consoleLog('StoriesList.vue/refreshStories', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshstories', status, msg)
      }
  
  
      // --------------------------------------------------------------------------
      // StorySingle emits a request to select a story
      // --------------------------------------------------------------------------
      const selectRecord = (storyID) => {
        consoleLog('StoriesList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', storyID)
      }
  
  
      // --------------------------------------------------------------------------
      // StorySingle emits a request to insert story(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('StoriesList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // StorySingle emits a request to move story(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('StoriesList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // StorySingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (storyID) => {
        consoleLog('StoriesList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', storyID)
      }
  
      return { trace, superUser, refreshStories, selectRecord, handleInsert, handleMove, handleDelete }
  
    }
  }
  </script>
      
  <style></style>