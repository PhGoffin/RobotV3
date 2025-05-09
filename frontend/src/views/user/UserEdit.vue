<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ workspace }}<br>-- User -- </h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>
            <div class="user">
                <form @submit.prevent="handleSubmit">

                    <div class="actions">
                        <div class="input-container focus">
                            <input type="text" name="createdby" class="input disabled info" v-model="createdBy" disabled />
                            <label>Created By</label>
                            <span>Created By</span>
                        </div>
                        <div class="input-container focus">
                            <input type="text" name="updatedby" class="input disabled info" v-model="updatedBy" disabled />
                            <label>Updated By</label>
                            <span>Updated By</span>
                        </div>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="workspace" class="input disabled" v-model="workspace" disabled />
                        <label>Workspace</label>
                        <span>Workspace</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="login" class="input" maxlength="20" v-model="login" />
                        <label>Login</label>
                        <span>Login</span>
                    </div>                    

                    <div class="input-container focus">
                        <input type="text" name="firstname" class="input" maxlength="40" 
                        @focus="handleFocus($event)" @blur="handleBlur($event)" v-model="firstname" required />
                        <label>First Name</label>
                        <span>First Name</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="lastname" class="input"  maxlength="40" 
                        @focus="handleFocus($event)" @blur="handleBlur($event)" v-model="lastname" required />
                        <label>Last Name</label>
                        <span>Last Name</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="email" class="input" maxlength="80"
                        @focus="handleFocus($event)" @blur="handleBlur($event)" v-model="email" required />
                        <label>Email</label>
                        <span>Email</span>
                    </div>

                    <div class="input-container focus" v-if="superUser">
                        <select id="super" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            v-model="selectedSuper">
                            <option v-for="superUno in superUs" :key="superUno.superID" v-bind:value="{ id: superUno.superID }">{{
                                superUno.super }}</option>
                        </select> <label>Super User</label>
                        <span>Super User</span>
                    </div>

                    <div class="input-container focus" v-else>
                        <select id="super" class="input disabled" v-model="selectedSuper" disabled>
                            <option v-for="superUno in superUs" :key="superUno.superID" v-bind:value="{ id: superUno.superID }">{{
                                superUno.super }}</option>
                        </select> <label>Super User</label>
                        <span>Super User</span>
                    </div>


                    <div class="input-container focus">
                        <select id="active" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            v-model="selectedActive">
                            <option v-for="active in actives" :key="active.activeID" v-bind:value="{ id: active.activeID }">{{
                                active.active }}</option>
                        </select> <label>Active</label>
                        <span>Active</span>
                    </div>


                    <div class="input-container">
                        <button>
                            <i class="fa-solid fa-circle-check"></i>
                            Save</button>
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
import getUserById from '../../composables/user/getUserById'
import updateUser from '../../composables/user/updateUser'
import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'UserEdit',
    props: ['trace', 'id', 'workspaceID', 'workspace', 'superUser', 'currentuser', 'connected'],

    components: { Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('UserEdit.vue', trace.value)
        consoleLog('UserEdit.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }        


        const userID = ref(props.id)
        const workspaceID = ref(props.workspaceID)
        const workspace = ref(props.workspace)
        const userName = ref('')
        const login = ref('')
        const firstname = ref('')
        const lastname = ref('')
        const email = ref('')
        const active = ref('')
        const user = ref([])
        const superU = ref('')
        const superUser = ref(props.superUser)
        const createdBy = ref('')
        const updatedBy = ref('')

        const actives = ref([{activeID: '1', active: 'Yes'}, {activeID: '0', active: 'No'} ])
        const selectedActive = ref(0)

        const superUs = ref([{superID: '1', super: 'Yes'}, {superID: '0', super: 'No'} ])
        const selectedSuper = ref(0)
        
        let actionCancel = 0;

        const currentuser = ref(props.currentuser)
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
            consoleLog('UserEdit.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }

        // -------------------------------------------
        // Load detail of the user
        // -------------------------------------------
        const { error1, loadUser } = getUserById(workspaceID.value, userID.value)
        loadUser(user, trace.value)
            .then(function () {
                consoleLog('UserEdit.vue/getUserById', 2, '------ User: ' + userID.value, trace.value)
                consoleLog('UserEdit.vue/getUserById', 2, user.value, trace.value)
                if (user.value.success && user.value.data.length) {
                    user.value = user.value.data
                    userName.value = user.value[0].login
                    userID.value = user.value[0].userID
                    login.value = user.value[0].login
                    firstname.value = user.value[0].firstName
                    lastname.value = user.value[0].lastName
                    email.value = user.value[0].email
                    superU.value = user.value[0].superuser
                    selectedSuper.value = ({ id:  superU.value })
                    active.value = user.value[0].active
                    selectedActive.value = ({ id:  active.value })
                    createdBy.value = user.value[0].createdby + ' on: ' + user.value[0].created
                    updatedBy.value = user.value[0].updatedby + ' on: ' + user.value[0].updated

                } else {
                    // Error no free user found!
                    consoleLog('UserEdit.vue/getUserById', 2, user.value.message, trace.value)
                    DisplayError('I cannot detect the user!\nCheck with your Administrator', 'Alert')
                }
            })



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
            actionCancel = 1
            consoleLog('UserEdit.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            //router.push({ name: 'Projects' })
            router.go(-1)
        }

        // -----------------------------------------------------------------------------------
        // leave the screen and go to the subprojects screen (used by the function DisplayError)
        // -----------------------------------------------------------------------------------
        const gotoUsers = () => {
            consoleLog('UserEdit.vue/gotoUserProjects', 2, 'leave the screen and go to the users screen', trace.value)
            router.go(-1)
        }

        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = () => {
            if (actionCancel == 1) return 1
            consoleLog('UserEdit.vue/handleSubmit', 2, 'User Submit the action ', trace.value)
            const { error, updateTheUser } = updateUser(workspaceID.value, userID.value, login.value, firstname.value, lastname.value, email.value, selectedSuper.value.id, selectedActive.value.id, currentuser.value, today)
            updateTheUser(user, trace.value)
                .then(function () {
                    consoleLog('UserEdit.vue/handleSubmit', 2, '------ Update user: ' + workspaceID.value + ', ' + userID.value + ', ' + login.value, trace.value)
                    consoleLog('UserEdit.vue/handleSubmit', 2, user.value, trace.value)
                    consoleLog('UserEdit.vue/handleSubmit', 2, 'Success: ' + user.value.success, trace.value)
                    if (user.value.success) {
                        consoleLog('UserEdit.vue/handleSubmit', 2, 'Message OK: ' + user.value.message, trace.value)
                        DisplayError(user.value.message, 'Info', gotoUsers)
                    } else {
                        // Error during insert found!
                        consoleLog('UserEdit.vue/handleSubmit', 2, 'Message KO: ' + user.value.message, trace.value)
                        DisplayError(user.value.message, 'Alert')
                    }
                })
        }


        return {
            errorMessage, styleMessage, workspaceID, workspace, user, userID, login, userName, superUser, firstname, lastname, email
            , superUs, superU, selectedSuper, actives, active, selectedActive, createdBy, updatedBy, 
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
    max-width:80%;
    max-height: 15%;
    height: 15%;
    padding: 1.2rem;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.2);}

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

.user {
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

.input.disabled.info {
    background-color: #caf5e9;
    width: 130%
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
.actions {
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
}
</style>