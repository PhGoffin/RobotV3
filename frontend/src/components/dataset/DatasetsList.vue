<template>
  <div class="entities">
    <div v-for="dataset in datasets" :key="dataset.datasetID">
      <DatasetSingle :dataset="dataset" :superUser="superUser" :trace="trace" :projectID="projectID"
        :subprojectID="subprojectID" :userID="userID" @refreshdatasets="refreshDatasets" :location="location"
        @selectrecord="selectRecord" @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove"
        @handledelete="handleDelete" @storelocation="storeLocation" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import DatasetSingle from './DatasetSingle.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
  props: ['trace', 'datasets', 'superUser', 'userID', 'projectID', 'subprojectID', 'location'],
  components: { DatasetSingle },
  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('DatasetsList.vue', trace.value)
    consoleLog('DatasetsList.vue - props', 1, props, trace.value)

    const workspaces = ref(props.workspaces)
    const superUser = ref(props.superUser)


    // --------------------------------------------------------------------------
    // DatasetSingle emits a request to refresh the datasets
    // --------------------------------------------------------------------------
    const refreshDatasets = (status, msg) => {
      consoleLog('DatasetsList.vue/refreshDatasets', 2, 'Emit a request to the parent to refresh the list', trace.value)
      context.emit('refreshdatasets', status, msg)
    }

    // --------------------------------------------------------------------------
    // DatasetSingle emits a request to select a dataset
    // --------------------------------------------------------------------------
    const selectRecord = (todoID) => {
      consoleLog('DatasetsList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
      context.emit('selectrecord', todoID)
    }

    // --------------------------------------------------------------------------
    // DatasetSingle emits a request to update the location
    // --------------------------------------------------------------------------
    const storeLocation = (location) => {
      consoleLog('DatasetsList.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
      context.emit('storelocation', location)
    }

    // --------------------------------------------------------------------------
    // DatasetSingle emits a request to insert dataset(s) after the record
    // --------------------------------------------------------------------------
    const handleInsert = (position) => {
      consoleLog('DatasetsList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      context.emit('handleinsert', position)
    }

    // --------------------------------------------------------------------------
    // DatasetSingle emits a request to copy dataset(s) after the record
    // --------------------------------------------------------------------------
    const handleCopy = (todoID) => {
      consoleLog('DatasetsList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', todoID)
    }

    // --------------------------------------------------------------------------
    // DatasetSingle emits a request to move dataset(s) after the record
    // --------------------------------------------------------------------------
    const handleMove = (position) => {
      consoleLog('DatasetsList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', position)
    }

    // --------------------------------------------------------------------------
    // DatasetSingle emits a request to delete todo(s)
    // --------------------------------------------------------------------------
    const handleDelete = (todoID, position) => {
      consoleLog('DatasetsList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
      context.emit('handledelete', todoID, position)
    }

    return { trace, superUser, refreshDatasets, selectRecord, handleInsert, handleCopy, handleMove, handleDelete, storeLocation }

  }
}
</script>

<style></style>