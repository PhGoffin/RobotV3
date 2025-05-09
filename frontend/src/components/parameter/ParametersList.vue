<template>
  <div class="entity">
    <div v-for="parameter in parameters" :key="parameter.parameterID">
      <ParameterSingle :parameter="parameter" :superUser="superUser" :trace="trace" @refreshparameters="refreshParameters"
        @selectrecord="selectRecord" @handleinsert="handleInsert" @handlecopy="handleCopy" @handlemove="handleMove"
        @handledelete="handleDelete" />
    </div>
  </div>
</template>
    
<script>
import { ref } from 'vue'
import ParameterSingle from './ParameterSingle.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
  props: ['trace', 'parameters', 'superUser'],
  components: { ParameterSingle },
  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('ParametersList.vue', trace.value)
    consoleLog('ParametersList.vue - props', 1, props, trace.value)

    const parameters = ref(props.parameters)
    const superUser = ref(props.superUser)


    // --------------------------------------------------------------------------
    // ParameterSingle emits a request to refresh the parameters
    // --------------------------------------------------------------------------
    const refreshParameters = (status, msg) => {
      consoleLog('ParametersList.vue/refreshWorkspaces', 2, 'Emit a request to the parent to refresh the list', trace.value)
      context.emit('refreshparameters', status, msg)
    }

    // --------------------------------------------------------------------------
    // ParameterSingle emits a request to select a Parameter
    // --------------------------------------------------------------------------
    const selectRecord = (parameterID) => {
      consoleLog('ParametersList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
      context.emit('selectrecord', parameterID)
    }


    // --------------------------------------------------------------------------
    // ParameterSingle emits a request to insert Parameter(s) after the record
    // --------------------------------------------------------------------------
    const handleInsert = (position) => {
      consoleLog('ParametersList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      context.emit('handleinsert', position)
    }

    // --------------------------------------------------------------------------
    // ParameterSingle emits a request to copy Parameter(s) after the record
    // --------------------------------------------------------------------------
    const handleCopy = (parameterID) => {
      consoleLog('ParametersList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', parameterID)
    }

    // --------------------------------------------------------------------------
    // ParameterSingle emits a request to move Parameter(s) after the record
    // --------------------------------------------------------------------------
    const handleMove = (position) => {
      consoleLog('ParametersList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', position)
    }

    // --------------------------------------------------------------------------
    // ParameterSingle emits a request to delete todo(s)
    // --------------------------------------------------------------------------
    const handleDelete = (parameterID) => {
      consoleLog('ParametersList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
      context.emit('handledelete', parameterID)
    }

    return { trace, parameters, superUser, refreshParameters, selectRecord, handleInsert, handleCopy, handleMove, handleDelete }

  }
}
</script>
    
<style></style>