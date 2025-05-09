<template>
  <div class="entities">
    <div v-for="test in tests" :key="test.testID">
      <TestSingle :test="test" :superUser="superUser" :trace="trace" :projectID="projectID" :location="location"
        :userID="userID" @refreshtests="refreshTests" @selectrecord="selectRecord" @handleinsert="handleInsert"
        @handlecopy="handleCopy" @handlemove="handleMove" @handledelete="handleDelete" @storelocation="storeLocation" />
    </div>
  </div>
</template>
    
<script>
import { ref } from 'vue'
import TestSingle from './TestSingle.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
  props: ['trace', 'tests', 'superUser', 'userID', 'projectID', 'location'],
  components: { TestSingle },
  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('TestsList.vue', trace.value)
    consoleLog('TestsList.vue - props', 1, props, trace.value)

    const workspaces = ref(props.workspaces)
    const superUser = ref(props.superUser)
    const location = ref(props.location)


    // --------------------------------------------------------------------------
    // TestSingle emits a request to refresh the tests
    // --------------------------------------------------------------------------
    const refreshTests = (status, msg) => {
      consoleLog('TestsList.vue/refreshTests', 2, 'Emit a request to the parent to refresh the list', trace.value)
      context.emit('refreshtests', status, msg)
    }


    // --------------------------------------------------------------------------
    // TestSingle emits a request to select a test
    // --------------------------------------------------------------------------
    const selectRecord = (testID) => {
      consoleLog('TestsList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
      context.emit('selectrecord', testID)
    }


    // --------------------------------------------------------------------------
    // TestSingle emits a request to insert test(s) after the record
    // --------------------------------------------------------------------------
    const handleInsert = (position) => {
      consoleLog('TestsList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      context.emit('handleinsert', position)
    }

    // --------------------------------------------------------------------------
    // TestSingle emits a request to copy test(s) after the record
    // --------------------------------------------------------------------------
    const handleCopy = (testID) => {
      consoleLog('TestsList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', testID)
    }

    // --------------------------------------------------------------------------
    // TestSingle emits a request to move test(s) after the record
    // --------------------------------------------------------------------------
    const handleMove = (position) => {
      consoleLog('TestsList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', position)
    }

    // --------------------------------------------------------------------------
    // TestSingle emits a request to delete todo(s)
    // --------------------------------------------------------------------------
    const handleDelete = (testID, position) => {
      consoleLog('TestsList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
      context.emit('handledelete', testID, position)
    }

    // --------------------------------------------------------------------------
    // TestSingle emits a request to update the location
    // --------------------------------------------------------------------------
    const storeLocation = (location) => {
      consoleLog('TestsList.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
      context.emit('storelocation', location)
    }    

    return { trace, superUser, location, refreshTests, selectRecord, handleInsert, handleCopy, handleMove, handleDelete, storeLocation }

  }
}
</script>
    
<style></style>