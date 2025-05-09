<template>
    <div class="entities">
      <div v-for="rule in rules" :key="rule.ruleID">
        <RuleSingle :rule="rule" :superUser="superUser" :trace="trace" :projectID="projectID" :subprojectID="subprojectID"
          :userID="userID" @refreshrules="refreshRules" @selectrecord="selectRecord" @handleinsert="handleInsert" :location="location"
          @handlecopy="handleCopy" @handlemove="handleMove" @handledelete="handleDelete" />
      </div>
    </div>
  </template>
      
  <script>
  import { ref } from 'vue'
  import RuleSingle from './RuleSingle.vue'
  import { displayMsg, consoleLog } from '../../util/debug';
  
  export default {
    props: ['trace', 'rules', 'superUser', 'userID', 'projectID',  'subprojectID', 'location'],
    components: { RuleSingle },
    setup(props, context) {
      const trace = ref(props.trace)
  
      displayMsg('RulesList.vue', trace.value)
      consoleLog('RulesList.vue - props', 1, props, trace.value)
  
      const workspaces = ref(props.workspaces)
      const superUser = ref(props.superUser)
      const location = ref(props.location)


  
      // --------------------------------------------------------------------------
      // RuleSingle emits a request to refresh the rules
      // --------------------------------------------------------------------------
      const refreshRules = (status, msg) => {
        consoleLog('RulesList.vue/refreshRules', 2, 'Emit a request to the parent to refresh the list', trace.value)
        context.emit('refreshrules', status, msg)
      }
  
  
      // --------------------------------------------------------------------------
      // RuleSingle emits a request to select a rule
      // --------------------------------------------------------------------------
      const selectRecord = (todoID) => {
        consoleLog('RulesList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
        context.emit('selectrecord', todoID)
      }
  
  
      // --------------------------------------------------------------------------
      // RuleSingle emits a request to insert rule(s) after the record
      // --------------------------------------------------------------------------
      const handleInsert = (position) => {
        consoleLog('RulesList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
        context.emit('handleinsert', position)
      }
  
      // --------------------------------------------------------------------------
      // RuleSingle emits a request to copy rule(s) after the record
      // --------------------------------------------------------------------------
      const handleCopy = (todoID) => {
        consoleLog('RulesList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
        context.emit('handlecopy', todoID)
      }
  
      // --------------------------------------------------------------------------
      // RuleSingle emits a request to move rule(s) after the record
      // --------------------------------------------------------------------------
      const handleMove = (position) => {
        consoleLog('RulesList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
        context.emit('handlemove', position)
      }
  
      // --------------------------------------------------------------------------
      // RuleSingle emits a request to delete todo(s)
      // --------------------------------------------------------------------------
      const handleDelete = (todoID, position) => {
        consoleLog('RulesList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
        context.emit('handledelete', todoID, position)
      }
  
      return { trace, superUser, location, refreshRules, selectRecord, handleInsert, handleCopy, handleMove, handleDelete }
  
    }
  }
  </script>
      
  <style></style>