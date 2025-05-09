<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div
    :class="recordSelected ? 'entity selected' : (!dummyuser.active ? 'entity inactive' : (dummyuser.active == 2 ? 'entity comment' : (dummyuser.crypted == 1 ? 'entity crypted' : 'entity')))">

    <div class="actions">

      <h3 @click="showDetails = !showDetails" title="Click to show details" class="data">
        {{ dummyuser.dummy }} = {{ dummyuser.user }}
      </h3>

      <div class="actions">

        <div class="actions">
          <div class="icons" v-if="actionAllowed">
            <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the dummy user"></i>
          </div>

          <div class="icons" v-if="actionAllowed">
            <router-link :to="{ name: 'DummyuserEdit', params: { id: dummyuser.dummyuserID } }">
              <i class="fa-regular fa-pen-to-square" title="Edit the dummy user"></i>
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
      <p>
        <i class="fa-regular fa-copy" @click="handleClipboard(dummyuser.user, 1)" title="Copy the user to the clipboard"
          v-if="!clipboard1"></i>
        <i class="fa-solid fa-copy" @click="handleClipboard(dummyuser.user, 1)" title="Copy the user to the clipboard"
          v-else></i>
        &nbsp;User: {{ dummyuser.user }}
      </p>
      <p>
        <i class="fa-regular fa-copy" @click="handleClipboard(dummyuser.password, 2)"
          title="Copy the password to the clipboard" v-if="!clipboard2 && !dummyuser.crypted"></i>
        <i class="fa-solid fa-copy" @click="handleClipboard(dummyuser.password, 2)"
          title="Copy the password to the clipboard" v-if="clipboard2 && !dummyuser.crypted"></i>
        &nbsp;Password: {{ dummyuser.password }} - Encrypted: {{ dummyuser.crypted }}
      </p>
      <p>Updated by: {{ dummyuser.updatedby }} on: {{ dummyuser.updated }}</p>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'
import useClipboard from 'vue-clipboard3'


export default {
  props: ['trace', 'dummyuser', 'superUser', 'userID', 'projectID', 'subprojectID', 'location'],

  components: { PopupConfirm },

  setup(props, context) {
    const router = useRouter()
    const trace = ref(props.trace)
    const { toClipboard } = useClipboard()

    displayMsg('DummyuserSingle.vue', trace.value)
    consoleLog('DummyuserSingle.vue - props', 1, props, trace.value)

    const showDetails = ref(false)
    const showPopup = ref(false)
    const dummyuser = ref(props.dummyuser)
    const location = ref(props.location)
    const IamSuperUser = ref(props.superUser)
    const actionAllowed = ref(true)
    const projectID = ref(props.projectID)
    const subprojectID = ref(props.subprojectID)
    const dummyuserID = ref(dummyuser.value.dummyuserID)
    const recordSelected = ref(false)
    const testID = ref(0)
    const importWord = ref(false)
    const clipboard1 = ref(0)
    const clipboard2 = ref(0)


    // -------------------------------------------
    // User asks to delete a dummyuser
    // -------------------------------------------
    const handelDelete = () => {
      consoleLog('DummyuserSingle.vue/handelDelete', 2, 'Emit event to delete a record', trace.value)
      context.emit('handledelete', dummyuser.value.dummyuserID)
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleConfirmation = () => {
      consoleLog('DummyuserSingle.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
      showPopup.value = true
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleCancelDelete = () => {
      consoleLog('DummyuserSingle.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
      showPopup.value = false
    }


    // --------------------------------------------------------------------------
    // User confirm the delete action
    // --------------------------------------------------------------------------
    const handleConfirmDelete = () => {
      consoleLog('DummyuserSingle.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
      showPopup.value = false
      handelDelete()
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleSelect = () => {
      consoleLog('DummyuserSingle.vue/handleSelect', 2, 'Select a record: ' + dummyuserID.value, trace.value)
      recordSelected.value = !recordSelected.value
      context.emit('selectrecord', dummyuserID.value)
    }


    // --------------------------------------------------------------------------
    // User want to insert record(s)
    // --------------------------------------------------------------------------
    const handleInsert = () => {
      consoleLog('DummyuserSingle.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      context.emit('handleinsert', dummyuser.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to copy record(s)
    // --------------------------------------------------------------------------
    const handleCopy = () => {
      consoleLog('DummyuserSingle.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', dummyuser.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to move record(s)
    // --------------------------------------------------------------------------
    const handleMove = () => {
      consoleLog('DummyuserSingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', dummyuser.value.position)
    }

    // --------------------------------------------------------------------------
    // User wants to copy a value into the clipboard
    // --------------------------------------------------------------------------
    const handleClipboard = async (value, clipboardNo) => {
      consoleLog('DummyuserSingle.vue/handleClipboard', 2, 'value: ' + value, trace.value)
      try {
        await toClipboard(value)
        consoleLog('DummyuserSingle.vue/handleClipboard', 2, 'Copy to the clipboard!', trace.value)
        if (clipboardNo == 1) {
          clipboard1.value = !clipboard1.value
          setTimeout(() => clipboard1.value = 0, 2000)
        } else {
          clipboard2.value = !clipboard2.value
          setTimeout(() => clipboard2.value = 0, 2000)
        }
      } catch (e) {
        consoleLog('DummyuserSingle.vue/handleClipboard', 2, e, trace.value)
      }
    }


    return {
      showDetails, projectID, dummyuser, dummyuserID, actionAllowed, showPopup, recordSelected, clipboard1, clipboard2,
      handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete,
      handleSelect, handleInsert, handleCopy, handleMove, handleClipboard
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
  background: white;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid red;
  width: 80%;
}

.entity.crypted {
  position: relative;
  margin: 20px auto;
  background: white;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid rgb(94, 255, 0);
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

.actions i.blue {
  font-size: 24px;
  margin-left: 10px;
  color: #072af5;
  cursor: pointer;
}


.actions i:hover {
  color: #777;
}
</style>