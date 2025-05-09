<template>
  <div class="entity" v-if="aitagelements.length">
    <div v-for="aitagelement in aitagelements" :key="aitagelement.tagattributeID">
      <AITagElementSingle :aitagelement="aitagelement" :superUser="superUser" :trace="trace"
        @refreshtagelement="refreshTagElement" @handledelete="handleDelete" @handlegeneric="handleGeneric" @storelocation="storeLocation" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import AITagElementSingle from './AITagElementSingle.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
  props: ['trace', 'aitagelements', 'superUser'],
  components: { AITagElementSingle },
  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('AITagElementList.vue', trace.value)
    consoleLog('AITagElementList.vue - props', 1, props, trace.value)

    const aitagelements = ref(props.aitagelements)
    const superUser = ref(props.superUser)


    // --------------------------------------------------------------------------
    // AITagElementSingle emits a request to refresh the aitagelements
    // --------------------------------------------------------------------------
    const refreshTagElement = (status, msg) => {
      consoleLog('AITagElementList.vue/refreshWorkspaces', 2, 'Emit a request to the parent to refresh the list', trace.value)
      context.emit('refreshtagelement', status, msg)
    }

    // --------------------------------------------------------------------------
    // AITagElementSingle emits a request to delete todo(s)
    // --------------------------------------------------------------------------
    const handleDelete = (tagattributeID) => {
      consoleLog('AITagElementList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
      context.emit('handledelete', tagattributeID)
    }

    // --------------------------------------------------------------------------
    // AITagElementSingle emits a request to delete todo(s)
    // --------------------------------------------------------------------------
    const handleGeneric = (tagattributeID) => {
      consoleLog('AITagElementList.vue/handleGeneric', 2, 'Emit event to process generic pattern', trace.value)
      context.emit('handlegeneric', tagattributeID)
    }


    // --------------------------------------------------------------------------
    // AITagElementSingle emits a request to update the location
    // --------------------------------------------------------------------------
    const storeLocation = (location) => {
      consoleLog('AITagElementList.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
      context.emit('storelocation', location)
    }

    return { trace, aitagelements, superUser, refreshTagElement, handleDelete, handleGeneric, storeLocation }

  }
}
</script>

<style></style>