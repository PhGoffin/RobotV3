<template>
  <div class="my-container" @keyup.esc="handleCancel" tabindex="0">
    <div class="form">
      <div class="banner">
        <h3 class="title">-- Import --</h3>
        <img src="../../assets/RobotV2.png" alt="robot" />
        <Transition>
          <p class="message" :class="styleMessage" v-if="errorMessage">
            {{ errorMessage }}
          </p>
        </Transition>
      </div>

      <div class="entity">
        <form @submit.prevent="handleSubmit">
          <div class="input-container focus">
            <input type="text" name="project" class="input disabled" v-model="projectName" disabled />
            <label>Project</label>
            <span>Project</span>
          </div>

          <div class="input-container focus">
            <select id="user" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
              @change="handleUserChange()" v-model="selectedUser" title="Select a user for the import">
              <option v-for="user in users" :key="user.userID" v-bind:value="{ id: user.userID }">
                {{ user.fullName }}
              </option>
            </select>
            <label>User</label>
            <span>User</span>
          </div>

          <div class="input-container focus">
            <select id="slot" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
              @change="handleSlotChange()" v-model="selectedSlot" title="Select a slot for the export">
              <option v-for="slot in slots" :key="slot.slotID" v-bind:value="{ id: slot.slotID }">
                {{ slot.slotName }}
              </option>
            </select>
            <label>Slot</label>
            <span>Slot</span>
          </div>

          <div class="input-container textarea focus">
            <textarea name="comment" class="input disabled" v-model="comment" disabled></textarea>
            <label>Comment</label>
            <span>Comment</span>
          </div>


          <div class="input-container">
            <button>
              <i class="fa-solid fa-circle-check"></i>
              Import
            </button>
            <button @click="handleCancel" class="cancel">
              <i class="fa-solid fa-ban"></i>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import Spinner from "../../components/Spinner.vue";

import { displayMsg, consoleLog } from "../../util/debug";
import getReferencebackupheaderByProject from "../../composables/referencebackupheader/getReferencebackupheaderByProject";
import getUsersFromReferencebackupheader from "../../composables/referencebackupheader/getUsersFromReferencebackupheader";
import importReference from "../../composables/referencebackup/importReference";
import deleteAllReferences from "../../composables/reference/deleteAllReferences";



export default {
  name: "ExportReference",
  props: [
    "trace",
    "projectID",
    "projectName",
    "userID",
    "currentuser",
    "userName",
    "connected"
  ],
  components: { Spinner },

  setup(props, context) {
    const router = useRouter();
    const trace = ref(props.trace);

    displayMsg("ImportReference.vue", trace.value);
    consoleLog("ImportReference.vue - props", 1, props, trace.value);

    // -------------------------------------------
    // Check if the user is still connected
    // -------------------------------------------
    if (!props.connected) {
      router.push({ name: 'Login' })
      return
    }


    const reference = ref([]);
    const projectName = ref(props.projectName);
    const projectID = ref(props.projectID);
    const userID = ref(props.userID);
    const selectedUser = ref({ id: userID.value });
    const users = ref([]);
    const userName = ref(props.currentuser);
    const backupheaderID = ref(0);
    const comment = ref("");

    const slotID = ref(1);
    const slots = ref([])
    const selectedSlot = ref({ id: slotID.value });


    // -------------------------------------------
    // Management of the errors
    // -------------------------------------------
    const errorMessage = ref("");
    const styleMessage = ref("");

    // --------------------------------------------------------------------------
    // Execute a function from an error message
    // --------------------------------------------------------------------------
    const displayErrorFunction = (myCallback) => {
      errorMessage.value = "";
      if (myCallback != null && myCallback != undefined) {
        // call the function
        myCallback();
      }
    };


    // --------------------------------------------------------------------------
    // Display error message on the screen and trigger a function after a delay
    // --------------------------------------------------------------------------
    const DisplayError = (myMessage, myStyle, myCallback) => {
      errorMessage.value = myMessage;
      styleMessage.value = myStyle.toLowerCase();
      consoleLog("ImportReference.vue/DisplayError", 2, "Message: " + errorMessage.value + ", Style: " + styleMessage.value, trace.value);
      if (myStyle != "Alert") {
        setTimeout(() => displayErrorFunction(myCallback), 3000);
      }
    };



    // --------------------------------------------------------------------------
    // User sets the focus on a field
    // --------------------------------------------------------------------------
    const handleFocus = (event) => {
      event.target.parentElement.classList.add("focus");
    }

    // --------------------------------------------------------------------------
    // User leaves a field
    // --------------------------------------------------------------------------
    const handleBlur = (event) => {
      if (event.target.value == "") {
        event.target.parentElement.classList.remove("focus");
      }
    }

    // --------------------------------------------------------------------------
    // Load the active slot of the selected user
    // --------------------------------------------------------------------------
    const loadUserSlot = async (selectUserID) => {
      const { error, loadTheReference } = getReferencebackupheaderByProject(projectID.value, selectUserID);
      await loadTheReference(reference, trace.value).then(function () {
        consoleLog("ImportReference.vue/loadUserSlot", 2, "projectID: " + projectID.value + ', userID: ' + selectUserID, trace.value);
        if (reference.value.success && reference.value.data.length) {
          reference.value = reference.value.data;
          comment.value = reference.value[0].comment
          backupheaderID.value = reference.value[0].backupheaderID;

          // fill the slots
          for (var i = 0; i < reference.value.length; i++) {
            // { slotID: "1", slotName: "Slot 1" }
            slots.value.push({ slotID: reference.value[i].slotID, slotName: "Slot " + (i + 1) })
          }
          //slots.value = mySlots
          selectedSlot.value.id = reference.value[0].slotID
          consoleLog("ImportReference.vue/loadUserSlot", 2, reference.value, trace.value);
          return 1;
        } else {
          consoleLog("ImportReference.vue/loadUserSlot", 2, "No user slot found!", trace.value);
          return 0;
        }
      })
    }

    // --------------------------------------------------------------------------
    // Get all the users linked to reference backup header
    // --------------------------------------------------------------------------
    const loadUsers = async () => {
      const { error, loadTheUser } = getUsersFromReferencebackupheader(projectID.value);
      await loadTheUser(users, trace.value).then(function () {
        consoleLog("ImportReference.vue/getReferencebackupheaderByUser", 2, "projectID: " + projectID.value, trace.value);
        if (users.value.success && users.value.data.length) {
          users.value = users.value.data;
          consoleLog("ImportReference.vue/getReferencebackupheaderByUser", 2, users.value, trace.value);
          return 1;
        } else {
          consoleLog("ImportReference.vue/getReferencebackupheaderByUser", 2, "No reference found!", trace.value);
          return 0;
        }
      }).then(function () {
        for (var i = 0; i < users.value.length; i++) {
          if (i == 0) selectedUser.value.id = users.value[i].userID
          //myUsers.push({ firstName: linkedUsers.value[i].firstName, fullName: linkedUsers.value[i].fullName, lastName: linkedUsers.value[i].lastName, login: linkedUsers.value[i].login, userID: linkedUsers.value[i].userID })
          if (users.value[i].userID == userID.value) {
            selectedUser.value.id = users.value[i].userID
          }
        }
      }).then(function () {
        loadUserSlot(selectedUser.value.id)
      })
    }

    // **************
    // Load the users
    // **************
    loadUsers()

    // --------------------------------------------------------------------------
    // User selects another user
    // --------------------------------------------------------------------------
    const handleUserChange = async () => {
      slots.value.length = 0
      await loadUserSlot(selectedUser.value.id)
      consoleLog("ImportReference.vue/handleUserChange", 2, reference.value, trace.value);
    }

    // --------------------------------------------------------------------------
    // User selects another slot
    // --------------------------------------------------------------------------
    const handleSlotChange = () => {
      slotID.value = selectedSlot.value.id
      // search for a comment if any
      consoleLog("ImportReference.vue/handleSlotChange", 2, "slotID: " + slotID.value, trace.value);
      // loop through all the reference backup header to see if we have already a previous export
      let found = 0
      for (var i = 0; i < reference.value.length; i++) {
        if (reference.value[i].slotID == slotID.value) {
          comment.value = reference.value[i].comment
          backupheaderID.value = reference.value[i].backupheaderID;
          found = 1
        }
      }
      if (!found) {
        comment.value = 'Slot not found!'
        backupheaderID.value = 0
      }


    }


    // --------------------------------------------------------------------------
    // User cancels the action, leave the screen and returns to the list
    // --------------------------------------------------------------------------
    const handleCancel = () => {
      consoleLog("ImportReference.vue/handleCancel", 2, "User Cancel the action", trace.value);
      router.push({ name: "References" });
    };

    // --------------------------------------------------------------------------
    // User submit the data
    // --------------------------------------------------------------------------
    const handleSubmit = async () => {

      // Delete all the previous references

      const { error1, deleteTheReference } = deleteAllReferences(projectID.value, userID.value);
      await deleteTheReference(reference, trace.value).then(function () {
        consoleLog("ImportReference.vue/handleSubmit", 2, 'deleteTheReference - projectID: ' + projectID.value + ', userID: ' + userID.value, trace.value);
        if (reference.value.success) {
          consoleLog("References.vue/handleSubmit (deleteTheReference)", 2, reference, trace.value);
          return 1;
        } else {
          consoleLog("References.vue/handleSubmit (deleteTheReference)", 2, "No reference deleted!", trace.value);
          return 0;
        }
      })

      // Import the references from the backup
      const { error2, importData } = importReference(projectID.value, userID.value, backupheaderID.value);
      await importData(reference, trace.value).then(function () {
        consoleLog("ImportReference.vue/handleSubmit", 2, 'importData - backupheaderID: ' + backupheaderID.value + ', projectID: ' + projectID.value + ', userID: ' + userID.value, trace.value);
        if (reference.value.success) {
          consoleLog("References.vue/handleSubmit (importData)", 2, reference, trace.value);
          DisplayError("imported " + reference.value.count + ' record(s)', 'Info')
          return 1;
        } else {
          consoleLog("References.vue/handleSubmit (importData)", 2, "No reference imported!", trace.value);
          return 0;
        }
      })
    };

    return {
      errorMessage, styleMessage, reference, projectName, projectID, userID, userName, comment,
      slots, selectedSlot, users, selectedUser,
      handleCancel, handleSubmit, handleFocus, handleBlur, handleSlotChange, handleUserChange
    };
  },
};
</script>

<style scoped>
.custom-font {
  font-family: "Quicksand", sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body,
input,
textarea,
select {
  font-family: "Quicksand", sans-serif;
  font-size: large;
}

span,
label,
title {
  font-family: Arial, Helvetica, sans-serif;
  font-size: large;
}

.my-container {
  position: relative;
  width: 100%;
  height: 100%;
  /* min-height: 100vh; */
  padding: 5rem;
  background-color: #fafafa;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form {
  width: 85%;
  max-width: 1000px;
  min-height: 65vh;
  background-color: #eee;
  border-radius: 3rem;
  box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  overflow: hidden;
  display: grid;
  grid-template-columns: 30% 1fr;
}

.banner {
  background-color: #1abc9c;
  position: relative;
  box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.2);
  display: flex;
    justify-content: center;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.banner .message {
  position: absolute;
  bottom: 1rem;
  left: 10%;
  width: 80%;
  max-width: 80%;
  max-height: 15%;
  height: 15%;
  padding: 1.2rem;
  box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.2);
}

.banner .message.alert {
  background-color: #d1a8a8;
  color: #fff;
}

.banner .message.warning {
  background-color: #f1d995;
  color: black;
}

.banner .message.info {
  background-color: #a7c4e6;
  color: black;
}

.banner img {
  position: absolute;
  top: 8rem;
  width: 12rem;
  height: 12rem;
  max-width: 12rem;
  max-height: 12rem;
  animation: rotatehead 1s linear;
}

@keyframes rotatehead {
  from {
    transform: rotate(0deg) scale(0.5);
    /* left: -20% */
  }

  to {
    transform: rotate(360deg) scale(1);
    /* left: 45% */
  }
}

.title {
  padding: 2.3rem 2.2rem;
  color: #fff;
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 1;
  margin-bottom: 0.7rem;
}

.entity {
  /* padding: 2.3rem 2.2rem; */
  position: relative;
  background-color: #eee;
}

form {
  padding: 2.3rem 2.2rem;
  z-index: 10;
  overflow: hidden;
  position: relative;
}

.input-container {
  position: relative;
  margin: 1rem 0;
}

.input {
  width: 100%;
  outline: none;
  border: 2px solid #3d3c3c;
  background-color: white;
  padding: 0.6rem 1.2rem;
  color: #3d3c3c;
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  border-radius: 25px;
  transition: 0.3s;
}

.input.disabled {
  background-color: #d3dad8;
}

textarea.input {
  padding: 0.8rem 1.2rem;
  min-height: 150px;
  border-radius: 22px;
  resize: none;
  overflow-y: auto;
}

option {
  width: 100%;
  outline: none;
  border: 2px solid #3d3c3c;
  background-color: #d8d6d6;
  padding: 0.6rem 1.2rem;
  color: #3d3c3c;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  border-radius: 25px;
  transition: 0.3s;
}

.input-container label {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  padding: 0 0.4rem;
  color: #3d3c3c;
  font-size: 0.9rem;
  font-weight: 700;
  pointer-events: none;
  z-index: 1000;
  transition: 0.5s;
}

.input-container.textarea label {
  top: 1rem;
  transform: translateY(0);
}

button {
  padding: 0.6rem 1.3rem;
  background-color: #1abc9c;
  border: 2px solid black;
  font-size: large;
  color: white;
  line-height: 1;
  border-radius: 25px;
  outline: none;
  cursor: pointer;
  transition: 0.3s;
  margin: 1.3rem 0.5rem 0.5rem 0;
}

button:hover {
  background-color: transparent;
  color: black;
}

button.cancel {
  background-color: #787a7a;
}

button.cancel:hover {
  background-color: white;
  color: black;
}

.input-container span {
  position: absolute;
  top: 0;
  left: 25px;
  transform: translateY(-50%);
  font-size: 0.8rem;
  padding: 0 0.4rem;
  color: transparent;
  pointer-events: none;
  z-index: 500;
}

.input-container span:before,
.input-container span:after {
  content: "";
  position: absolute;
  width: 10%;
  opacity: 0;
  transition: 0.3s;
  height: 5px;
  background-color: white;
  top: 50%;
  transform: translateY(-50%);
}

.input-container span:before {
  left: 50%;
}

.input-container span:after {
  right: 50%;
}

.input-container.focus label {
  top: 0;
  transform: translateY(-50%);
  left: 25px;
  font-size: 0.8rem;
}

.input-container.focus span:before,
.input-container.focus span:after {
  width: 50%;
  opacity: 1;
  background-color: #eee;
  height: 100%;
}
</style>