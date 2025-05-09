<template>
    <div class="my-container">

        <div class="form">
            <div class="banner">
                <img src="../assets/RobotV2.png" alt="robot">

                <h1 class="title">Hello, Friends!</h1>
                <p>Enter your credentials,</p>
                <p>to start your testing journey!</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>or register to become</p>
                <p>a new Guest member</p>
                <div>
                    <button>Register</button>
                </div>
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>


            <div class="login">

                <form @submit.prevent="handleSubmit">
                    <h1 class="title">Identification</h1>

                    <div class="input-container">
                        <input type="text" name="username" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" v-model="username" required />
                        <label>Login</label>
                        <span>Login</span>
                    </div>

                    <div class="input-container">
                        <input type="password" name="password" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" v-model="password" required />
                        <label>Password</label>
                        <span>Password</span>
                    </div>

                    <div class="input-container focus">
                        <select id="workspace" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            v-model="selectedWorkspace">
                            <option v-for="workspace in workspaces" :key="workspace.workspaceID"
                                v-bind:value="{ id: workspace.workspaceID, text: workspace.workspace }">{{
                                    workspace.workspace }}</option>
                        </select>
                        <label>Workspace</label>
                        <span>Workspace</span>
                    </div>

                    <button class="submit">Login</button>


                </form>

            </div>
        </div>


    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import getAllWorkspaces from '../composables/workspace/getAllWorkspaces'
import getUserByLogin from '../composables/user/getUserByLogin'
import { displayMsg, consoleLog } from '../util/debug';


export default {
    name: 'Login2',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected', 'workspaceID', 'workspace'],
    components: {  },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('Login.vue', trace.value)
        consoleLog('Login.vue - props', 1, props, trace.value)

        const selectedWorkspace = ref('')
        const workspaceID = ref(0)
        const workspaceName = ref('')
        const userID = ref(0)
        const superUser = ref(false)
        const username = ref('')
        const password = ref('')
        const userRole = ref('')

        // -------------------------------------------
        // Management of the errors
        // -------------------------------------------
        const errorMessage = ref('')
        const styleMessage = ref('')
        // Display error message on the screen
        const DisplayError = (myMessage, myStyle) => {
            errorMessage.value = myMessage
            styleMessage.value = myStyle.toLowerCase()
            setTimeout(() => errorMessage.value = '', 3000)
        }

        // Load all the workspaces
        const { workspaces, error, loadWorkspaces } = getAllWorkspaces()
        loadWorkspaces(trace.value)
            .then(function () {
                // get the workspaceID of the first workspace in the list (it will be the default value for the select)
                selectedWorkspace.value = ({ id: workspaces.value[0].workspaceID, text: workspaces.value[0].workspace })
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
        // User Submit the form
        // --------------------------------------------------------------------------
        const handleSubmit = async () => {
            // get the selected workspace and ask the App to refresh projects
            workspaceID.value = selectedWorkspace.value.id
            workspaceName.value = selectedWorkspace.value.text
            //console.log('Workspace: ' + workspaceID.value, trace.value)

            // Check the login/password 
            const { user, error, loadLogin } = await getUserByLogin(workspaceID.value, username.value, password.value)
            await loadLogin(trace.value)
            // check if the login is successfull
            if (user.value.success == 1) {
                user.value = user.value.data[0]
                userID.value = user.value.userID
                superUser.value = user.value.superuser
                consoleLog('Login.vue/handleSubmit', 2, 'userID: ' + userID.value, trace.value)
                consoleLog('Login.vue/handleSubmit', 2, 'Super User: ' + superUser.value, trace.value)
                context.emit('loginrefresh', workspaceID.value, workspaceName.value, userRole.value, username.value, userID.value, superUser.value)
            } else {
                consoleLog('Login.vue/handleSubmit', 2, user.value.message, trace.value)
                DisplayError('Invalid login/password!', 'Alert')
            }
        }

        //  login as admin (just for test)
        const Login = () => {
            context.emit('updaterole', 'Admin', username.value)
            router.push({ name: 'ControlPanel' })
        }


        // -------------------------------------------
        // Management of the animation of the panel
        // -------------------------------------------
        const switchContainer = ref(true)
        setTimeout(() => switchContainer.value = false, 1000)

        return { username, password, workspaces, selectedWorkspace, errorMessage, styleMessage, switchContainer, Login, handleSubmit, handleFocus, handleBlur }


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
    width: 100%;
    max-width: 1000px;
    min-height: 65vh;
    background-color: #eee;
    border-radius: 3rem;
    box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    overflow: hidden;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.banner {
    background-color: #1abc9c;
    position: relative;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.2);
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
    bottom: 7rem;
    width: 30%;
    height: 25%;
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

.login .title {
    color: #3d3c3c;
    ;
}

.login {
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
}
</style>