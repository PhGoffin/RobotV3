<template>
  <div class="entities">
    <div v-for="reference in references" :key="reference.referenceID">
      <ReferenceSingle :reference="reference" :superUser="superUser" :trace="trace" :projectID="projectID" :location="location"
        :userID="userID" :currentuser="currentuser" @refreshreferences="refreshReferences" @selectrecord="selectRecord" @handleinsert="handleInsert"
        @handlecopy="handleCopy" @handlemove="handleMove" @handledelete="handleDelete" @storelocation="storeLocation"/>
    </div>
  </div>
</template>
    
<script>
import { ref } from 'vue'
import ReferenceSingle from './ReferenceSingle.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
  props: ['trace', 'references', 'superUser', 'userID', 'currentuser', 'projectID', 'location'],
  components: { ReferenceSingle },
  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('ReferencesList.vue', trace.value)
    consoleLog('ReferencesList.vue - props', 1, props, trace.value)

    const workspaces = ref(props.workspaces)
    const superUser = ref(props.superUser)
    const location = ref(props.location)


    // --------------------------------------------------------------------------
    // ReferenceSingle emits a request to refresh the references
    // --------------------------------------------------------------------------
    const refreshReferences = (status, msg) => {
      consoleLog('ReferencesList.vue/refreshReferences', 2, 'Emit a request to the parent to refresh the list', trace.value)
      context.emit('refreshreferences', status, msg)
    }


    // --------------------------------------------------------------------------
    // ReferenceSingle emits a request to select a reference
    // --------------------------------------------------------------------------
    const selectRecord = (referenceID) => {
      consoleLog('ReferencesList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
      context.emit('selectrecord', referenceID)
    }


    // --------------------------------------------------------------------------
    // ReferenceSingle emits a request to insert reference(s) after the record
    // --------------------------------------------------------------------------
    const handleInsert = (position) => {
      consoleLog('ReferencesList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      context.emit('handleinsert', position)
    }

    // --------------------------------------------------------------------------
    // ReferenceSingle emits a request to copy reference(s) after the record
    // --------------------------------------------------------------------------
    const handleCopy = (todoID) => {
      consoleLog('ReferencesList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', todoID)
    }

    // --------------------------------------------------------------------------
    // ReferenceSingle emits a request to move reference(s) after the record
    // --------------------------------------------------------------------------
    const handleMove = (position) => {
      consoleLog('ReferencesList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', position)
    }

    // --------------------------------------------------------------------------
    // ReferenceSingle emits a request to delete todo(s)
    // --------------------------------------------------------------------------
    const handleDelete = (todoID) => {
      consoleLog('ReferencesList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
      context.emit('handledelete', todoID)
    }

    // --------------------------------------------------------------------------
    // ReferenceSingle emits a request to update the location
    // --------------------------------------------------------------------------
    const storeLocation = (location) => {
      consoleLog('ReferencesList.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
      context.emit('storelocation', location)
    }



    return { trace, superUser, refreshReferences, selectRecord, location, handleInsert, handleCopy, handleMove, handleDelete, storeLocation }

  }
}
</script>
    
<style></style>