<template>
  <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

    <div class="form">
      <div class="banner">
        <h3 class="title">{{ projectName }}<br>-- Subproject --</h3>
        <img src="../../assets/RobotV2.png" alt="robot">
        <Transition>
          <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
        </Transition>
      </div>
      <div class="subproject">
        <form @submit.prevent="handleSubmit">

          <div class="input-container focus">
            <input type="text" name="project" class="input disabled" v-model="projectName" disabled />
            <label>Project</label>
            <span>Project</span>
          </div>

          <div class="input-container">
            <input type="text" name="subproject" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
              v-model="subprojectName" required />
            <label>Subproject</label>
            <span>Subproject</span>
          </div>

          <div class="input-container">
            <input type="text" name="comment" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
              v-model="comment" />
            <label>Comment</label>
            <span>Comment</span>
          </div>


          <div class="input-container">
            <button :class="buttonDisabled" :disabled="buttonDisabled == 'disabled' ? 1 : 0">
              <i class="fa-solid fa-circle-check"></i>
              Add</button>
            <button @click="handleCancel" class="cancel">
              <i class="fa-solid fa-ban"></i>
              Cancel</button>
          </div>

        </form>

      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Spinner from '../../components/Spinner.vue'
import addSubproject from '../../composables/subproject/addSubproject'
import reorderSubprojects from '../../composables/subproject/reorderSubprojects'
import { displayMsg, consoleLog } from '../../util/debug';


export default {
  name: 'SubprojectAdd',
  props: ['trace', 'superUser', 'projectID', 'projectName', 'currentuser', 'connected'],

  components: { Spinner },

  setup(props, context) {
    const router = useRouter()
    const trace = ref(props.trace)

    displayMsg('SubprojectAdd.vue', trace.value)
    consoleLog('SubprojectAdd.vue - props', 1, props, trace.value)

    // -------------------------------------------
    // Check if the user is still connected
    // -------------------------------------------
    if (!props.connected) {
      router.push({ name: 'Login' })
      return
    }


    const subproject = ref([])
    const projectID = ref(props.projectID)
    const projectName = ref(props.projectName)
    const subprojectName = ref('')
    const comment = ref('')
    const superUser = ref(props.superUser)
    const buttonDisabled = ref('')

    const userName = ref(props.currentuser)
    const createdBy = ref('')
    const updatedBy = ref('')
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
    const year = currentDate.getFullYear();
    let today = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year


    // -------------------------------------------
    // Management of the errors
    // -------------------------------------------
    const errorMessage = ref('')
    const styleMessage = ref('')

    // --------------------------------------------------------------------------
    // Execute a function from an error message
    // --------------------------------------------------------------------------
    const displayErrorFunction = (myCallback) => {
      errorMessage.value = ''
      if (myCallback != null && myCallback != undefined) {
        // call the function
        myCallback()
      }
    }

    // --------------------------------------------------------------------------
    // Display error message on the screen and trigger a function after a delay
    // --------------------------------------------------------------------------
    const DisplayError = (myMessage, myStyle, myCallback) => {
      errorMessage.value = myMessage
      styleMessage.value = myStyle.toLowerCase()
      consoleLog('ProjectEdit.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
      if (myStyle != 'Alert') {
        setTimeout(() => displayErrorFunction(myCallback), 3000)
      }
    }


    // --------------------------------------------------------------------------
    // User set the focus on a field
    // --------------------------------------------------------------------------
    const handleFocus = (event) => {
      event.target.parentElement.classList.add("focus")
    }

    // --------------------------------------------------------------------------
    // User leave a field
    // --------------------------------------------------------------------------
    const handleBlur = (event) => {
      if (event.target.value == "") {
        event.target.parentElement.classList.remove("focus")
      }
    }

    // --------------------------------------------------------------------------
    // User cancel the action, leave the screen and returns to the list
    // --------------------------------------------------------------------------
    const handleCancel = () => {
      consoleLog('SubprojectAdd.vue/handleCancel', 2, 'User Cancel the action', trace.value)
      router.go(-1)
    }

    // -----------------------------------------------------------------------------------
    // leave the screen and go to the subprojects screen (used by the function DisplayError)
    // -----------------------------------------------------------------------------------
    const gotoSubprojects = () => {
      router.go(-1)
    }

    // --------------------------------------------------------------------------
    // Call the API to reorder correctly all the positions of the subprojects 
    // --------------------------------------------------------------------------
    const doReorder = async () => {

      let subprojects = ref([])
      consoleLog('Subprojects.vue/doReorder', 2, 'Reorder all the positions of the Subproject', trace.value)
      const { error, reorderTheSubprojects } = reorderSubprojects(projectID.value)
      return await reorderTheSubprojects(subprojects, trace.value)
        .then(function () {
          return (1)
        })
    }



    // --------------------------------------------------------------------------
    // User submit the data
    // --------------------------------------------------------------------------
    const handleSubmit = () => {
      consoleLog('SubprojectAdd.vue/handleSubmit', 2, 'User Submit the action ')
      const { error, addNewSubproject } = addSubproject(projectID.value, subprojectName.value, comment.value, userName.value, today, 99999)
      addNewSubproject(subproject, trace.value)
        .then(function () {
          consoleLog('SubprojectAdd.vue/handleSubmit', 2, '------ Add new subproject: ' + projectID.value + ', ' + subprojectName.value + ', ' + comment.value, trace.value)
          consoleLog('SubprojectAdd.vue/handleSubmit', 2, subproject.value, trace.value)
          consoleLog('SubprojectAdd.vue/handleSubmit', 2, 'Success: ' + subproject.value.success, trace.value)
          if (subproject.value.success) {
            doReorder()            
            consoleLog('SubprojectAdd.vue/handleSubmit', 2, 'Message OK: ' + subproject.value.message, trace.value)
            DisplayError(subproject.value.message, 'Info', gotoSubprojects)
          } else {
            // Error during insert found!
            consoleLog('SubprojectAdd.vue/handleSubmit', 2, 'Message KO: ' + subproject.value.message, trace.value)
            DisplayError(subproject.value.message, 'Alert')
          }
        })
    }


    return {
      errorMessage, styleMessage, subproject, projectName, subprojectName, comment, buttonDisabled,
      handleCancel, handleSubmit, handleFocus, handleBlur
    }

  }

}
</script>

<style scoped>
.custom-font {
  font-family: 'Quicksand', sans-serif;
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
  font-family: 'Quicksand', sans-serif;
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
  animation: rotatehead 1.0s linear;
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

.subproject {
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

button.disabled {
  cursor: not-allowed;
  pointer-events: none;
  background-color: #dab4ba;
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