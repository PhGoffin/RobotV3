<template>
  <div class="entities">
    <div v-for="ruleheader in ruleheaders" :key="ruleheader.ruleID">
      <RuleheaderSingle :ruleheader="ruleheader" :superUser="superUser" :trace="trace" :projectID="projectID"
        :subprojectID="subprojectID" :location="location" :userID="userID" @refreshruleheaders="refreshRuleheaders"
        @selectrecord="selectRecord" @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove"
        @handledelete="handleDelete" @storelocation="storeLocation" />
    </div>
  </div>
</template>
      
<script>
import { ref } from 'vue'
import RuleheaderSingle from './RuleheaderSingle.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
  props: ['trace', 'ruleheaders', 'superUser', 'userID', 'projectID', 'subprojectID', 'location'],
  components: { RuleheaderSingle },
  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('RuleheadersList.vue', trace.value)
    consoleLog('RuleheadersList.vue - props', 1, props, trace.value)

    const workspaces = ref(props.workspaces)
    const superUser = ref(props.superUser)


    // --------------------------------------------------------------------------
    // RuleheaderSingle emits a request to refresh the ruleheaders
    // --------------------------------------------------------------------------
    const refreshRuleheaders = (status, msg) => {
      consoleLog('RuleheadersList.vue/refreshRuleheaders', 2, 'Emit a request to the parent to refresh the list', trace.value)
      context.emit('refreshruleheaders', status, msg)
    }

    // --------------------------------------------------------------------------
    // RuleheaderSingle emits a request to update the location
    // --------------------------------------------------------------------------
    const storeLocation = (location) => {
      consoleLog('RuleheadersList.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
      context.emit('storelocation', location)
    }

    // --------------------------------------------------------------------------
    // RuleheaderSingle emits a request to select a rule
    // --------------------------------------------------------------------------
    const selectRecord = (todoID) => {
      consoleLog('RuleheadersList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
      context.emit('selectrecord', todoID)
    }


    // --------------------------------------------------------------------------
    // RuleheaderSingle emits a request to insert rule(s) after the record
    // --------------------------------------------------------------------------
    const handleInsert = (position) => {
      consoleLog('RuleheadersList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      context.emit('handleinsert', position)
    }

    // --------------------------------------------------------------------------
    // RuleheaderSingle emits a request to copy rule(s) after the record
    // --------------------------------------------------------------------------
    const handleCopy = (todoID) => {
      consoleLog('RuleheadersList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', todoID)
    }

    // --------------------------------------------------------------------------
    // RuleheaderSingle emits a request to move rule(s) after the record
    // --------------------------------------------------------------------------
    const handleMove = (position) => {
      consoleLog('RuleheadersList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', position)
    }

    // --------------------------------------------------------------------------
    // RuleheaderSingle emits a request to delete todo(s)
    // --------------------------------------------------------------------------
    const handleDelete = (todoID) => {
      consoleLog('RuleheadersList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
      context.emit('handledelete', todoID)
    }

    return { trace, superUser, refreshRuleheaders, selectRecord, handleInsert, handleCopy, handleMove, handleDelete, storeLocation }

  }
}
</script>
      
<style></style>