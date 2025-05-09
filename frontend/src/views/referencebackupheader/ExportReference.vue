<template>
  <div class="my-container" @keyup.esc="handleCancel" tabindex="0">
    <div class="form">
      <div class="banner">
        <h3 class="title">-- Export --</h3>
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
            <input type="text" name="user" class="input disabled" v-model="userName" disabled />
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
            <textarea name="comment" class="input" maxlength="80" v-model="comment" @focus="handleFocus($event)"
              @blur="handleBlur($event)"></textarea>
            <label>Comment</label>
            <span>Comment</span>
          </div>

          <div class="input-container">
            <button>
              <i class="fa-solid fa-circle-check"></i>
              Export
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import Spinner from "../../components/Spinner.vue";

import { displayMsg, consoleLog } from "../../util/debug";
import getReferencebackupheaderByUser from "../../composables/referencebackupheader/getReferencebackupheaderByUser";
import deleteReferencebackup from "../../composables/referencebackup/deleteReferencebackup";
import exportReference from "../../composables/referencebackup/exportReference";
import deleteReferencebackupheader from "../../composables/referencebackupheader/deleteReferencebackupheader";
import addReferencebackupheader from "../../composables/referencebackupheader/addReferencebackupheader";


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

    displayMsg("ExportReference.vue", trace.value);
    consoleLog("ExportReference.vue - props", 1, props, trace.value);

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
    const userName = ref(props.currentuser);
    const backupheaderID = ref(0);
    const comment = ref("");

    const slotID = ref(1);
    const slots = ref([
      { slotID: "1", slotName: "Slot 1" },
      { slotID: "2", slotName: "Slot 2" },
      { slotID: "3", slotName: "Slot 3" },
      { slotID: "4", slotName: "Slot 4" },
      { slotID: "5", slotName: "Slot 5" },
      { slotID: "6", slotName: "Slot 6" },
      { slotID: "7", slotName: "Slot 7" },
      { slotID: "8", slotName: "Slot 8" },
      { slotID: "9", slotName: "Slot 9" },
      { slotID: "10", slotName: "Slot 10" },
    ]);
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
      consoleLog("ExportReference.vue/DisplayError", 2, "Message: " + errorMessage.value + ", Style: " + styleMessage.value, trace.value);
      if (myStyle != "Alert") {
        setTimeout(() => displayErrorFunction(myCallback), 3000);
      }
    };

    // --------------------------------------------------------------------------
    // Get the reference backup header
    // --------------------------------------------------------------------------
    const loadReferenceData = async () => {
      const { error, loadTheReference } = getReferencebackupheaderByUser(projectID.value, userID.value);
      loadTheReference(reference, trace.value).then(function () {
        consoleLog("ExportReference.vue/getReferencebackupheaderByUser", 2, "projectID: " + projectID.value + ", userID: " + userID.value, trace.value);
        if (reference.value.success && reference.value.data.length) {
          reference.value = reference.value.data;
          consoleLog("References.vue/getReferencebackupheaderByUser", 2, reference, trace.value);
          //projectID.value = reference.value.projectID
          return 1;
        } else {
          consoleLog("References.vue/getReferencebackupheaderByUser", 2, "No reference found!", trace.value);
          return 0;
        }
      }).then(function (res) {
        // Get the comment for the first slot (if any)
        getCommentFromSlot(1)
      })
    }

    // --------------------------------------------------------------------------
    // User set the focus on a field
    // --------------------------------------------------------------------------
    const getCommentFromSlot = async (theSlotID) => {
      consoleLog("ExportReference.vue/getCommentFromSlot", 2, "slotID: " + theSlotID, trace.value);
      // loop through all the reference backup header to see if we have already a previous export
      let found = 0
      for (var i = 0; i < reference.value.length; i++) {
        if (reference.value[i].slotID == theSlotID) {
          comment.value = reference.value[i].comment
          backupheaderID.value = reference.value[i].backupheaderID;
          found = 1
        }
      }
      if (!found) {
        comment.value = 'No previous export!'
        backupheaderID.value = 0
      }
    };


    // Load the reference and select the comment for the slot 1 (if any)
    loadReferenceData()




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
    // User selects another slot
    // --------------------------------------------------------------------------
    const handleSlotChange = () => {
      slotID.value = selectedSlot.value.id
      // search for a comment if any
      getCommentFromSlot(slotID.value)
    }


    // --------------------------------------------------------------------------
    // User cancels the action, leave the screen and returns to the list
    // --------------------------------------------------------------------------
    const handleCancel = () => {
      consoleLog("ExportReference.vue/handleCancel", 2, "User Cancel the action", trace.value);
      router.push({ name: "References" });
    };

    // --------------------------------------------------------------------------
    // User submit the data
    // --------------------------------------------------------------------------
    const handleSubmit = async () => {

      if (comment.value == 'No previous export!' || comment.value == '') {
        DisplayError("Please enter a comment for the export!", 'Warning')
        return 0
      }
      let ret = 0
      consoleLog("ExportReference.vue/handleSubmit", 2, "User Submit the action", trace.value);
      // if we have an existing reference backup header, delete the records
      if (backupheaderID.value != 0) {
        consoleLog("ExportReference.vue/handleSubmit", 2, "----------------deleteReferenceback ---------", trace.value);
        // Delete the referencebackup
        const { error1, deleteTheReference } = deleteReferencebackup(backupheaderID.value);
        await deleteTheReference(reference, trace.value).then(function () {
          consoleLog("ExportReference.vue/handleSubmit", 2, "deleteReferencebackup - backupheaderID: " + backupheaderID.value, trace.value);
          if (reference.value.success) {
            consoleLog("References.vue/handleSubmit (delete backup)", 2, reference, trace.value);
            ret = 1
            return ret;
          } else {
            consoleLog("References.vue/handleSubmit (delete backup)", 2, "No reference found!", trace.value);
            ret = 0
            return ret;
          }
        })
        consoleLog("ExportReference.vue/handleSubmit", 2, "----------------deleteReferencebackupheader ---------", trace.value);

        // delete the referencebackupheader
        const { error2, deleteTheReferenceheader } = deleteReferencebackupheader(projectID.value, userID.value, slotID.value);
        await deleteTheReferenceheader(reference, trace.value).then(function () {
          consoleLog("ExportReference.vue/handleSubmit", 2, "deleteReferencebackupheader - slotID: " + slotID.value + ', projectID: ' + projectID.value + ', userID: ' + userID.value, trace.value);
          if (reference.value.success) {
            consoleLog("References.vue/handleSubmit (delete backup header)", 2, reference, trace.value);
            ret = 1
            return ret;
          } else {
            consoleLog("References.vue/handleSubmit (delete backup header)", 2, "No reference found!", trace.value);
            ret = 0
            return ret;
          }
        })
      } // end if

      // Create the Referencebackupheader
      const { error3, addTheReferenceheader } = addReferencebackupheader(projectID.value, userID.value, slotID.value, comment.value);
      await addTheReferenceheader(reference, trace.value).then(function () {
        consoleLog("ExportReference.vue/handleSubmit", 2, 'addTheReferenceheader - projectID: ' + projectID.value + ', userID: ' + userID.value + ', slotID' + slotID.value, trace.value);
        if (reference.value.success) {
          consoleLog("References.vue/handleSubmit (addTheReferenceheader)", 2, reference, trace.value);
          backupheaderID.value = reference.value.id
          ret = 1
          return ret;
        } else {
          consoleLog("References.vue/handleSubmit (addTheReferenceheader)", 2, "No reference found!", trace.value);
          ret = 0
          return ret;
        }
      })
      if (ret) {
        // Export the reference into the new reference backup header
        const { error4, exportData } = exportReference(backupheaderID.value, projectID.value, userID.value);
        await exportData(reference, trace.value).then(function () {
          consoleLog("ExportReference.vue/handleSubmit", 2, 'exportData - backupheaderID: ' + backupheaderID.value + 'projectID: ' + projectID.value + ', userID: ' + userID.value, trace.value);
          if (reference.value.success) {
            consoleLog("References.vue/handleSubmit (exportData)", 2, reference, trace.value);
            DisplayError("exported " + reference.value.count + ' record(s)', 'Info')
            return 1;
          } else {
            consoleLog("References.vue/handleSubmit (exportData)", 2, "No reference exported found!", trace.value);
            DisplayError("Internal Error: no reference exported!", 'Alert')
            return 0;
          }
        })
      } else {
        DisplayError("Internal Error in the creation of the reference set", 'Alert')
      }


    };

    return {
      errorMessage, styleMessage, reference, projectName, projectID, userID, userName, comment, slots, selectedSlot,
      handleCancel, handleSubmit, handleFocus, handleBlur, handleSlotChange
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