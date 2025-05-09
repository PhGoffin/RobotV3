<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div :class="!test.active ? 'entity inactive' : (functionName == 'rule' ? 'entity rule' : (recordSelected ? 'entity selected' : (test.active == 2 ? 'entity comment' :
    (test.action == 'Step' && test.testCondition ? 'entity step condition' : (test.action == 'Step' && test.functionName == 'skipIt' ? 'entity skipIt' : (test.action == 'Step' && test.functionName == 'stopTest' ? 'entity stopTest' :
      (test.action == 'Step' && test.functionName == 'skipDescribe' ? 'entity skipDescribe' : 
      (test.action == 'Step' && (test.functionName == 'startTimer' || test.functionName == 'stopTimer') ? 'entity timer' :
      (test.action == 'Step' ? 'entity step' : (test.action == 'Comment' ? 'entity comment' : (test.action == 'It' ? 'entity it' : (test.action == 'Loop' || test.action == 'End Loop' ? 'entity loop' :
          (test.action == 'Describe' && test.testCondition != '' ? 'entity describecontext' : 'entity describe')))))))))))))">

    <div class="actions">

      <h3 @click="showDetails = !showDetails" title="Click to show details" class="data" ref="single"
        v-if="test.action == 'Step'">
        {{ test.position }} > {{ test.action }}: {{ test.comment }} <span style="font-size: 15px;"> ( {{
          test.functionName }} )</span>

      </h3>
      <h3 @click="showDetails = !showDetails" title="Click to show details" class="data" ref="single" v-else>
        {{ test.position }} > {{ test.action }}: {{ test.comment }}
      </h3>

      <div class="actions">

        <div class="actions">

          <div class="icons" v-if="actionAllowed && !importTest && test.commentType == 1">
            <i class="fa-solid fa-lightbulb" @click="handleCommentType" title="Set to Designer Comment"></i>
          </div>
          <div class="icons" v-if="actionAllowed && !importTest && test.commentType == 0 ">
            <i class="fa-solid fa-gear" @click="handleCommentType" title="Set to Business Comment"></i>
          </div>
          <div class="icons" v-if="actionAllowed && !importTest && test.active">
            <i class="fa-solid fa-toggle-on" @click="handleActive" title="Disabled the test"></i>
          </div>
          <div class="icons" v-if="actionAllowed && !importTest && !test.active">
            <i class="fa-solid fa-toggle-off" @click="handleActive" title="Enabled the test"></i>
          </div>

          <div class="icons" v-if="actionAllowed && !importTest">
            <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the test"></i>
          </div>

          <div class="icons" v-if="actionAllowed && !importTest">
            <router-link :to="{ name: 'TestEdit', params: { id: testID } }">
              <i class="fa-regular fa-pen-to-square" title="Edit the test"></i>
            </router-link>
          </div>

          <div class="icons" v-if="actionAllowed && !importTest">
            <i class="fa-solid fa-plus" @click="handleInsert" title="Insert after this row"></i>
          </div>

          <div class="icons" v-if="actionAllowed && !importTest">
            <i>&nbsp;</i>
          </div>


          <div class="icons" v-if="actionAllowed && !importTest">
            <i class="fa-solid fa-copy" @click="handleCopy" title="Copy after this row"></i>
          </div>

          <div class="icons" v-if="actionAllowed && !importTest">
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
      <p>ID: {{ test.testID }}</p>
      <p v-if="test.testCondition && test.action == 'Describe' && test.testCondition != ''">Context: {{
        test.testCondition }}</p>
      <p v-if="test.testCondition && test.action == 'Loop'">Max Loop: {{ test.testCondition }}</p>
      <p v-if="test.testCondition && test.action == 'Step'">Condition: {{ test.testCondition }}</p>
      <p v-if="test.transpose"> {{ test.transpose }}</p>
      <p v-if="test.commentType">
        <i class="fa-solid fa-lightbulb" style="color: #c5b807;"></i> Comment for the Busines
      </p>
      <p v-if="!test.commentType">
        <i class="fa-solid fa-gear" style="color: blue;"></i> Comment for the Designer
      </p>

      <p v-if="test.label1">1) {{ test.label1 }}: {{ test.parameter1 }}</p>
      <p v-if="test.label2">2) {{ test.label2 }}: {{ test.parameter2 }}</p>
      <p v-if="test.label3">3) {{ test.label3 }}: {{ test.parameter3 }}</p>
      <p v-if="test.label4">4) {{ test.label4 }}: {{ test.parameter4 }}</p>
    </div>

  </div>
</template>

<script>
import { ref, nextTick } from 'vue'
import { useFocus } from '@vueuse/core'
import updateActive from '../../composables/test/updateActive'
import updateCommentType from '../../composables/test/updateCommentType'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'


export default {
  props: ['trace', 'test', 'superUser', 'userID', 'projectID', 'location'],

  components: { PopupConfirm },

  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('TestSingle.vue', trace.value)
    consoleLog('TestSingle.vue - props', 1, props, trace.value)

    const showDetails = ref(false)
    const showPopup = ref(false)
    const test = ref(props.test)
    const IamSuperUser = ref(props.superUser)
    const actionAllowed = ref(true)
    const testID = ref(test.value.testID)
    const projectID = ref(props.projectID)
    const userID = ref(props.userID)
    const recordSelected = ref(false)
    const functionName = ref(test.value.functionName)
    const location = ref(props.location)
    const importTest = ref(false)
    const single = ref(null)
    const position = ref(test.value.position)
    const testPosition = ref(0)

    // Manage the parameters value: Check if we come from the import
    // Syntax is: testimport/<scenario>
    if (location.value.includes('testimport=')) {
      importTest.value = true
    } else if (location.value.includes('controlpanel=')) {
      // Syntax is: controlpanel=<testPosition>
      let params = location.value.split('=');
      if (params[1] != null && params[1] != undefined) testPosition.value = params[1]
    }


    nextTick().then(() => {
      if (position.value == testPosition.value) {
        console.log('====> Single: ', single.value)
        if (single.value != null) {
          //useFocus (single.value)
          single.value.scrollIntoView()
        }
      }
    });





    // -------------------------------------------
    // User asks to delete a test
    // -------------------------------------------
    const handelDelete = () => {
      consoleLog('TestSingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
      context.emit('handledelete', test.value.testID, test.value.position)
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleConfirmation = () => {
      consoleLog('TestSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
      showPopup.value = true
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleCancelDelete = () => {
      consoleLog('TestSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
      showPopup.value = false
    }

    // --------------------------------------------------------------------------
    // User confirm the delete action
    // --------------------------------------------------------------------------
    const handleConfirmDelete = () => {
      consoleLog('TestSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
      showPopup.value = false
      testPosition.value = test.value.position
      //context.emit('storelocation', 'controlpanel=' + testPosition.value)      
      handelDelete()
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleSelect = () => {
      consoleLog('TestSingle.vue/handleSelect', 2, 'Select a record', trace.value)
      recordSelected.value = !recordSelected.value
      context.emit('selectrecord', testID.value)
    }

    // --------------------------------------------------------------------------
    // User want to insert record(s)
    // --------------------------------------------------------------------------
    const handleInsert = () => {
      consoleLog('TestSingle.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      testPosition.value = test.value.position
      //context.emit('storelocation', 'controlpanel=' + testPosition.value)      
      context.emit('handleinsert', test.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to copy record(s)
    // --------------------------------------------------------------------------
    const handleCopy = () => {
      consoleLog('TestSingle.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      testPosition.value = test.value.position
      //context.emit('storelocation', 'controlpanel=' + testPosition.value)      
      context.emit('handlecopy', test.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to move record(s)
    // --------------------------------------------------------------------------
    const handleMove = () => {
      consoleLog('TestSingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      testPosition.value = test.value.position
      //context.emit('storelocation', 'controlpanel=' + testPosition.value)      
      context.emit('handlemove', test.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to enabled/disable a test
    // --------------------------------------------------------------------------
    const handleActive = async () => {
      consoleLog('TestSingle.vue/handleActive', 2, 'Change the active mode', trace.value)
      test.value.active = !test.value.active

      const myTest = ref([])
      const { error, updateTheActive } = updateActive(test.value.testID, test.value.active)
      return await updateTheActive(myTest, trace.value)
        .then(function () {
          // check the status of the update
          consoleLog('TestSingle.vue/updateTheActive', 2, 'Test active status: ' + myTest.value.success, trace.value)
          if (myTest.value.success) {
            consoleLog('TestSingle.vue/updateTheActive', 2, myTest, trace.value)
            return (1)
          } else {
            consoleLog('TestSingle.vue/updateTheActive', 2, 'Error during the update of the test active', trace.value)
            return (0)
          }
        })

    }

    // --------------------------------------------------------------------------
    // User want to enabled/disable the comment type
    // --------------------------------------------------------------------------
    const handleCommentType = async () => {
      consoleLog('TestSingle.vue/handleCommentType', 2, 'Change the Comment Type', trace.value)
      test.value.commentType = !test.value.commentType

      const myTest = ref([])
      const { error, updateTheCommentType } = updateCommentType(test.value.testID, test.value.commentType)
      return await updateTheCommentType(myTest, trace.value)
        .then(function () {
          // check the status of the update
          consoleLog('TestSingle.vue/handleCommentType', 2, 'Test Comment Type status: ' + myTest.value.success, trace.value)
          if (myTest.value.success) {
            consoleLog('TestSingle.vue/handleCommentType', 2, myTest, trace.value)
            return (1)
          } else {
            consoleLog('TestSingle.vue/handleCommentType', 2, 'Error during the update of the Comment Type', trace.value)
            return (0)
          }
        })
    }    





    return {
      showDetails, projectID, userID, test, testID, actionAllowed, showPopup, recordSelected,
      functionName, importTest, single,
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

.entity.inactive {
  position: relative;
  margin: 20px auto;
  background: rgb(236, 223, 223);
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


.entity.comment {
  position: relative;
  margin: 20px auto;
  background: rgb(238, 237, 226);
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid yellow;
  width: 80%;
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
  background: #e6e38d;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #eeeb99;
  width: 80%;
}



.entity.describecontext {
  position: relative;
  margin: 20px auto;
  background: linear-gradient(to right, #eeb25f, #f3e4cf);
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #f79104;
  width: 80%;
}

.entity.timer {
  position: relative;
  margin: 20px auto;
  background: #c9f780;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #ffe600;
  width: 80%;
}

.entity.step {
  position: relative;
  margin: 20px auto;
  background: #e9e7e7;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #aca8a8;
  width: 80%;
}

.entity.stopTest {
  position: relative;
  margin: 20px auto;
  /* background: #eee0e0; */
  background: linear-gradient(to right, #f5b3a8, #eee0ec);
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #98ade3;
  width: 80%;
}

.entity.skipIt {
  position: relative;
  margin: 20px auto;
  background: #ececd7;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #98ade3;
  width: 80%;
}

.entity.skipDescribe {
  position: relative;
  margin: 20px auto;
  background: #ececd7;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #f4c788;
  width: 80%;
}


.entity.step.condition {
  position: relative;
  margin: 20px auto;
  background: linear-gradient(to right, #d3d1d1, #e9e7e7);
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #aca8a8;
  width: 80%;
}



.entity.loop {
  position: relative;
  margin: 20px auto;
  background: #e9cff3;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #eb88f4;
  width: 80%;
}


.entity.rule {
  position: relative;
  margin: 20px auto;
  background: #e9e7e7;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #52ec52;
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