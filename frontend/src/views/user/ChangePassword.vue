<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <img src="../../assets/RobotV2.png" alt="robot">
                <h1 class="title">Change Password</h1>
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>


            <div class="changePassword">

                <form @submit.prevent="handleSubmit">

                    <div class="input-container focus">
                        <input type="text" name="workspace" class="input disabled" v-model="workspaceName" disabled />
                        <label>Workspace</label>
                        <span>Workspace</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="username" class="input disabled" v-model="userName" disabled />
                        <label>User</label>
                        <span>User</span>
                    </div>


                    <div class="input-container">
                        <input type="text" name="password1" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" v-model="password1" required />
                        <label>New Password</label>
                        <span>New Password</span>
                    </div>

                    <div class="input-container">
                        <input type="text" name="password1" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" v-model="password2" required />
                        <label>Confirm Password</label>
                        <span>Confirm Password</span>
                    </div>

                    <button class="submit">
                        <i class="fa-solid fa-circle-check"></i>
                        Change Password</button>
                    <button @click="handleCancel" class="cancel">
                        <i class="fa-solid fa-ban"></i>
                        Cancel</button>


                </form>

            </div>
        </div>


    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import passwordUser from '../../composables/user/passwordUser'
import getUserById from '../../composables/user/getUserById'
import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'ChangePassword',
    props: ['trace', 'location', 'id', 'currentuser', 'userID', 'superUser', 'workspaceID', 'workspace', 'connected'],
    components: {},

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('ChangePassword.vue', trace.value)
        consoleLog('ChangePassword.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }        


        const workspaceID = ref(props.workspaceID)
        const workspaceName = ref(props.workspace)
        const userID = ref(props.id)
        const superUser = ref(props.superUser)
        const userName = ref(props.currentuser)
        const password1 = ref('')
        const password2 = ref('')
        const user = ref([])
        const location = ref(props.location)


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
            consoleLog('ChangePassword.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }




        // --------------------------------------------------------------------------
        // if the screen is called from the Users screen, we need to refresh user data
        // --------------------------------------------------------------------------
        const RefreshUserData = () => {
            if (location.value == 'Users') {
                const { error1, loadUser } = getUserById(workspaceID.value, userID.value)
                loadUser(user, trace.value)
                    .then(function () {
                        consoleLog('ChangePassword.vue/getUserById', 2, '------ User: ' + userID.value, trace.value)
                        consoleLog('ChangePassword.vue/getUserById', 2, user.value, trace.value)
                        if (user.value.success && user.value.data.length) {
                            user.value = user.value.data
                            userName.value = user.value[0].login
                        } else {
                            // Error no user found!
                            consoleLog('ChangePassword.vue/getUserById', 2, user.value.message, trace.value)
                            DisplayError('I cannot detect the user!\nCheck with your Administrator', 'Alert')
                        }
                    })
            }

        }

        RefreshUserData()
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
        // User cancel the action, Back to the control panel
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('ChangePassword.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'ControlPanel' })
        }

        // -----------------------------------------------------------------------------------
        // leave the screen and go to the control panel screen (used by the function DisplayError)
        // -----------------------------------------------------------------------------------
        const gotoControlPanel = () => {
            router.push({ name: 'ControlPanel' })
        }

        // --------------------------------------------------------------------------
        // User Submit the form
        // --------------------------------------------------------------------------
        const handleSubmit = async () => {

            // check if the new password is identical to the confirmation
            if (password1.value != password2.value) {
                consoleLog('ChangePassword.vue/handleSubmit', 2, 'Password and confirmation are not the same!')
                DisplayError('Password and confirmation are not the same!', 'Alert')
                return
            }
            //Update the new password
            const { error, changePassword } = await passwordUser(password1.value, workspaceID.value, userID.value)
            await changePassword(user, trace.value)
            // check if the update is successfull
            if (user.value.success == 1) {
                consoleLog('ChangePassword.vue/handleSubmit', 2, 'Successfully change the password', trace.value)
                DisplayError('Password updated successfully!', 'Info', gotoControlPanel)
            } else {
                consoleLog('ChangePassword.vue/handleSubmit', 2, user.value.message, trace.value)
                DisplayError('Invalid login/password!', 'Alert')
            }
        }


        return {
            userName, password1, password2, workspaceID, workspaceName, errorMessage, styleMessage,
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
    font-weight: bold;
    font-size: large;
}

p {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    color: #fafafa;
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

.changePassword .title {
    color: #3d3c3c;
    ;
}

.changePassword {
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
    margin: 3rem 0;
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
}</style>