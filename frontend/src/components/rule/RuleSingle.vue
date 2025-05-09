<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div
    :class="recordSelected ? 'entity selected' : (!rule.active ? 'entity inactive' : (ItRecord ? 'entity it' : (DescribeRecord ? 'entity describe' : (rule.active == 1 && rule.ruleContinue == 1 ? 'entity' : (rule.active == 1 && rule.ruleContinue == 0 ? 'entity skip' : 'entity comment')))))">

    <div class="actions">

      <h3 @click="showDetails = !showDetails" title="Click to show details" class="data" ref="single">
        {{ rule.position }} > {{ rule.comment }}
      </h3>


      <div class="actions">

        <div class="actions">

          <div class="icons" v-if="actionAllowed && rule.commentType == 1">
            <i class="fa-solid fa-lightbulb" @click="handleCommentType" title="Set to Designer Comment"></i>
          </div>
          <div class="icons" v-if="actionAllowed && rule.commentType == 0 ">
            <i class="fa-solid fa-gear" @click="handleCommentType" title="Set to Business Comment"></i>
          </div>          
          <div class="icons" v-if="actionAllowed && rule.active">
            <i class="fa-solid fa-toggle-on" @click="handleActive" title="Disabled the rule"></i>
          </div>
          <div class="icons" v-if="actionAllowed && !rule.active">
            <i class="fa-solid fa-toggle-off" @click="handleActive" title="Enabled the rule"></i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the rule"></i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <router-link :to="{ name: 'RuleEdit', params: { id: rule.ruleID } }">
              <i class="fa-regular fa-pen-to-square" title="Edit the rule"></i>
            </router-link>
          </div>

          <div class="icons" v-if="actionAllowed">
            <i class="fa-solid fa-plus" @click="handleInsert" title="Insert after this row"></i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <i>&nbsp;</i>
          </div>


          <div class="icons" v-if="actionAllowed">
            <i class="fa-solid fa-copy" @click="handleCopy" title="Copy after this row"></i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <i class="fa-solid fa-down-left-and-up-right-to-center" @click="handleMove" title="Move after this row"></i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <input type="checkbox" name="selection" class="input checkbox" @change="handleSelect"
              title="Check to indicate the row(s) to Copy or Move" />
          </div>

        </div>

      </div>

    </div>
    <div class="details" v-if="showDetails">
      <p v-if="rule.commentType">
        <i class="fa-solid fa-lightbulb" style="color: #c5b807;"></i> Comment for the Busines
      </p>
      <p v-if="!rule.commentType">
        <i class="fa-solid fa-gear" style="color: blue;"></i> Comment for the Designer
      </p>
      <p>Continue: {{ rule.ruleContinue }} - Condition: {{ rule.ruleCondition }}</p>
      <p>Result: {{ rule.ruleResult }}</p>
      <p>Message: {{ rule.ruleMessage }}</p>
    </div>

  </div>
</template>

<script>
import { ref, nextTick } from 'vue'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'
import updateActive from '../../composables/rule/updateActive'
import updateCommentType from '../../composables/rule/updateCommentType'

export default {
  props: ['trace', 'rule', 'superUser', 'userID', 'projectID', 'subprojectID', 'location'],

  components: { PopupConfirm },

  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('RuleSingle.vue', trace.value)
    consoleLog('RuleSingle.vue - props', 1, props, trace.value)

    const showDetails = ref(false)
    const showPopup = ref(false)
    const rule = ref(props.rule)
    const IamSuperUser = ref(props.superUser)
    const actionAllowed = ref(true)
    const ruleID = ref(rule.value.ruleID)
    const projectID = ref(props.projectID)
    const subprojectID = ref(props.subprojectID)
    const userID = ref(props.userID)
    const recordSelected = ref(false)
    const ItRecord = ref(false)
    const DescribeRecord = ref(false)
    const single = ref(null)
    const location = ref(props.location)

    const position = ref(rule.value.position)
    const rulePosition = ref(0)

    if (location.value != undefined) {
      if (location.value.includes('controlpanel=')) {
        // Syntax is: controlpanel=<rulePosition>
        let params = location.value.split('=');
        if (params[1] != null && params[1] != undefined) rulePosition.value = params[1]
      }
    } else {
      console.log('====> Location not defined: ', location.value)
    }

    nextTick().then(() => {
      if (position.value == rulePosition.value) {
        console.log('====> Single: ', single.value)
        if (single.value != null) {
          //useFocus (single.value)
          single.value.scrollIntoView()
        }
      }
    });

    if (rule.value.ruleResult.indexOf('#It') >= 0) ItRecord.value = 1
    else if (rule.value.ruleResult.indexOf('#Describe') >= 0) DescribeRecord.value = 1




    // -------------------------------------------
    // User asks to delete a rule
    // -------------------------------------------
    const handelDelete = () => {
      consoleLog('RuleSingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
      context.emit('handledelete', rule.value.ruleID, rule.value.position)
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleConfirmation = () => {
      consoleLog('RuleSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
      showPopup.value = true
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleCancelDelete = () => {
      consoleLog('RuleSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
      showPopup.value = false
    }


    // --------------------------------------------------------------------------
    // User confirm the delete action
    // --------------------------------------------------------------------------
    const handleConfirmDelete = () => {
      consoleLog('RuleSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
      showPopup.value = false
      handelDelete()
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleSelect = () => {
      consoleLog('RuleSingle.vue/handleSelect', 2, 'Select a record', trace.value)
      recordSelected.value = !recordSelected.value
      context.emit('selectrecord', ruleID.value)
    }


    // --------------------------------------------------------------------------
    // User want to insert record(s)
    // --------------------------------------------------------------------------
    const handleInsert = () => {
      consoleLog('RuleSingle.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      context.emit('handleinsert', rule.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to copy record(s)
    // --------------------------------------------------------------------------
    const handleCopy = () => {
      consoleLog('RuleSingle.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', rule.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to move record(s)
    // --------------------------------------------------------------------------
    const handleMove = () => {
      consoleLog('RuleSingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', rule.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to enabled/disable a test
    // --------------------------------------------------------------------------
    const handleActive = async () => {
      consoleLog('RuleSingle.vue/handleActive', 2, 'Change the active mode', trace.value)
      rule.value.active = !rule.value.active

      const myRule = ref([])
      const { error, updateTheActive } = updateActive(rule.value.ruleID, rule.value.active)
      return await updateTheActive(myRule, trace.value)
        .then(function () {
          // check the status of the update
          consoleLog('RuleSingle.vue/updateTheActive', 2, 'Rule active status: ' + myRule.value.success, trace.value)
          if (myRule.value.success) {
            consoleLog('RuleSingle.vue/updateTheActive', 2, myRule, trace.value)
            return (1)
          } else {
            consoleLog('RuleSingle.vue/updateTheActive', 2, 'Error during the update of the rule active', trace.value)
            return (0)
          }
        })
    }

    // --------------------------------------------------------------------------
    // User want to enabled/disable the comment type
    // --------------------------------------------------------------------------
    const handleCommentType = async () => {
      consoleLog('RuleSingle.vue/handleCommentType', 2, 'Change the Comment Type', trace.value)
      rule.value.commentType = !rule.value.commentType

      const myRule = ref([])
      const { error, updateTheCommentType } = updateCommentType(rule.value.ruleID, rule.value.commentType)
      return await updateTheCommentType(myRule, trace.value)
        .then(function () {
          // check the status of the update
          consoleLog('RuleSingle.vue/handleCommentType', 2, 'Rule Comment Type status: ' + myRule.value.success, trace.value)
          if (myRule.value.success) {
            consoleLog('RuleSingle.vue/handleCommentType', 2, myRule, trace.value)
            return (1)
          } else {
            consoleLog('RuleSingle.vue/handleCommentType', 2, 'Error during the update of the Comment Type', trace.value)
            return (0)
          }
        })
    }    



    return {
      showDetails, projectID, userID, rule, ruleID, actionAllowed, showPopup, recordSelected, ItRecord, DescribeRecord, single,
      handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete,
      handleSelect, handleInsert, handleCopy, handleMove, handleActive, handleCommentType
    }
  }
}
</script>

<style scoped>
.entity {
  position: relative;
  margin: 20px auto;
  background: white;
  padding: 10px 20px;
  border-top-right-radius: 1.5rem;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #2300e9;
  width: 80%;
}

.entity.skip {
  position: relative;
  margin: 20px auto;
  background: rgb(224, 245, 243);
  padding: 10px 20px;
  border-top-right-radius: 1.5rem;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #2300e9;
  width: 80%;
}


.entity.inactive {
  position: relative;
  margin: 20px auto;
  background: white;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid red;
  width: 80%;
}

.entity.selected {
  background: rgb(247, 239, 193);
  border-left: 4px solid #eed811;
}

.entity.it {
  position: relative;
  margin: 20px auto;
  background: #dee3f5;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #98ade3;
  width: 80%;
}

.entity.describe {
  position: relative;
  margin: 20px auto;
  background: #f3e4cf;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #f4c788;
  width: 80%;
}

.entity.comment {
  position: relative;
  margin: 20px auto;
  background: rgb(238, 237, 226);
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid rgb(204, 202, 71);
  width: 80%;
}

.input.checkbox {
  height: 1.5rem;
  width: 1.5rem;
}


h3 {
  cursor: pointer;
  width: auto;
}

p {
  text-align: left;
}

.data {
  text-align: left;
  padding-left: 1.5rem;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions i {
  font-size: 24px;
  margin-left: 10px;
  color: #bbb;
  cursor: pointer;
}

.actions i:hover {
  color: #777;
}
</style>