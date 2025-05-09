<template>
    <div class="entity">
      <div v-for="aitraining in aitrainings" :key="aitraining.trainingID">
        <AITrainingSingle :aitraining="aitraining" :superUser="superUser" :trace="trace" @refreshtraining="refreshTraining"
          @selectrecord="selectRecord" @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove"
          @handledelete="handleDelete" />
      </div>
    </div>
  </template>
      
  <script>
  import { ref } from 'vue'
  import AITrainingSingle from './AITrainingSingle.vue'
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'aitrainings', 'superUser'],
    components: { AITrainingSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('AITrainingList.vue', trace.value)
      consoleLog('AITrainingList.vue - props', 1, props, trace.value)
  
      const aitrainings = ref(props.aitrainings)
      const superUser = ref(props.superUser)
  
  
      // --------------------------------------------------------------------------
      // AITrainingSingle emits a request to refresh the aitrainings
      // --------------------------------------------------------------------------
      const refreshTraining = (status, msg) => {
        consoleLog('AITrainingList.vue/refreshWorkspaces', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshtraining', status, msg)
      }
  
      // --------------------------------------------------------------------------
      // AITrainingSingle emits a request to select a aitraining
      // --------------------------------------------------------------------------
      const selectRecord = (trainingID) => {
        consoleLog('AITrainingList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', trainingID)
      }
  
  
      // --------------------------------------------------------------------------
      // AITrainingSingle emits a request to insert aitraining(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('AITrainingList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // AITrainingSingle emits a request to copy aitraining(s) after the record
      // --------------------------------------------------------------------------
      const handleCopy = (trainingID) => {
        consoleLog('AITrainingList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
        context.emit('handlecopy', trainingID)
      }
  
      // --------------------------------------------------------------------------
      // AITrainingSingle emits a request to move aitraining(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('AITrainingList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // AITrainingSingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (trainingID) => {
        consoleLog('AITrainingList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', trainingID)
      }
  
      return { trace, aitrainings, superUser, refreshTraining, selectRecord, handleInsert, handleCopy, handleMove, handleDelete }
  
    }
  }
  </script>
      
  <style></style>