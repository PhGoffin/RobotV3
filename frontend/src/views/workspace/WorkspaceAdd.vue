<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">

            <div class="banner">
                <h3 class="title">Workspace</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <form @submit.prevent="handleSubmit">

                    <div class="input-container">
                        <input type="text" name="workspace" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" v-model="workspaceName" />
                        <label>Workspace</label>
                        <span>Workspace</span>
                    </div>

                    <div class="input-container focus">
                        <select id="license" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" @change="handleLicenseChange" v-model="selectedLicense">
                            <option v-for="license in licenses" :key="license.licenseID"
                                v-bind:value="{ id: license.licenseID }">{{
                                    license.license }}</option>
                        </select> <label>License</label>
                        <span>License</span>
                    </div>

                    <div class="input-container textarea">
                        <textarea name="comment" class="input" v-model="comment" @focus="handleFocus($event)"
                            @blur="handleBlur($event)"></textarea>
                        <label>Comment</label>
                        <span>Comment</span>
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
import getAllLicenses from '../../composables/license/getAllLicenses'
import addWorkspace from '../../composables/workspace/addWorkspace'
import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'WorkspaceAdd',
    props: ['trace', 'currentuser', 'connected'],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('WorkspaceAdd.vue', trace.value)
        consoleLog('WorkspaceAdd.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }        


        const workspace = ref([])
        const workspaceName = ref('')
        const licenses = ref([])
        const licenseID = ref(0)
        const selectedLicense = ref(0)
        const comment = ref('')

        const active = ref(1)
        const actives = ref([{activeID: '1', active: 'Yes'}, {activeID: '0', active: 'No'} ])
        const selectedActive = ref({ id:  active.value })

        const userName = ref(props.currentuser)
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
            consoleLog('WorkspaceAdd.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }

        // -------------------------------------------
        // Load all the licenses
        // -------------------------------------------
        const { error, loadLicenses } = getAllLicenses()
        loadLicenses(licenses, trace.value)
            .then(function () {
                consoleLog('WorkspaceAdd.vue/getAllLicenses', 2, licenses.value, trace.value)
                if (licenses.value.success && licenses.value.data.length) {
                    licenses.value = licenses.value.data
                    selectedLicense.value = ({ id: licenses.value[0].licenseID })
                    consoleLog('WorkspaceAdd.vue/getAllLicenses', 2, '--------- selectedLicense', trace.value)
                    consoleLog('WorkspaceAdd.vue/getAllLicenses', 2, selectedLicense.value, trace.value)
                } else {
                    // Error no library found!
                    consoleLog('WorkspaceAdd.vue/getAllLicenses', 2, licenses.value.message, trace.value)
                    DisplayError('I cannot detect a license!\nCheck with your Administrator', 'Alert')
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
        // User selects another license, store the current ID
        // --------------------------------------------------------------------------
        const handleLicenseChange = () => {
            consoleLog('WorkspaceAdd.vue/handleLicenseChange', 2, 'User changed the license Id: ' + selectedLicense.value.id, trace.value)
            licenseID.value = selectedLicense.value.id
        }


        // --------------------------------------------------------------------------
        // User cancel the action, leave the screen and returns to the list
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('WorkspaceAdd.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'Workspaces' })
        }

        // -----------------------------------------------------------------------------------
        // leave the screen and go to the projects screen (used by the function DisplayError)
        // -----------------------------------------------------------------------------------
        const gotoWorkspaces = () => {
            router.push({ name: 'Workspaces' })
        }

        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = () => {
            consoleLog('WorkspaceAdd.vue/handleSubmit', 2, 'User Submit the action ', trace.value)
            const { error, addNewWorkspace } = addWorkspace(workspaceName.value, licenseID.value, comment.value, selectedActive.value.id, userName.value, today)
            addNewWorkspace(workspace, trace.value)
                .then(function () {
                    consoleLog('WorkspaceAdd.vue/handleSubmit', 2, '------ Add new workspace: ' + workspaceName.value + ', licence: ' + licenseID.value, trace.value)
                    consoleLog('WorkspaceAdd.vue/handleSubmit', 2, workspace.value, trace.value)
                    consoleLog('WorkspaceAdd.vue/handleSubmit', 2, 'Success: ' + workspace.value.success, trace.value)
                    if (workspace.value.success) {
                        consoleLog('WorkspaceAdd.vue/handleSubmit', 2, 'Message OK: ' + workspace.value.message, trace.value)
                        DisplayError(workspace.value.message, 'Info', gotoWorkspaces)
                    } else {
                        // Error during insert found!
                        consoleLog('WorkspaceAdd.vue/handleSubmit', 2, 'Message KO: ' + workspace.value.message, trace.value)
                        DisplayError(workspace.value.message, 'Alert')
                    }
                })
        }


        return {
            errorMessage, styleMessage, workspaceName, licenses, comment, selectedLicense, actives, selectedActive,  
            handleLicenseChange, handleCancel, handleSubmit, handleFocus, handleBlur
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
    top: 30%;
    width: 50%;
    height: 30%;
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