<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">
        
        <div class="form">
            
            <div class="banner">
                <h3 class="title">Project</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="project">
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
                        <input type="text" name="projectname" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" v-model="projectName" required />
                        <label>Project name</label>
                        <span>Project name</span>
                    </div>

                    <div class="input-container focus">
                        <select id="library" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" @change="handleLibraryChange" v-model="selectedLibrary">
                            <option v-for="library in libraries" :key="library.libraryID"
                                v-bind:value="{ id: library.libraryID }">{{
                                    library.library }}</option>
                        </select> <label>Library</label>
                        <span>Library</span>
                    </div>

                    <div class="input-container textarea focus">
                        <textarea name="comment" class="input" v-model="comment" @focus="handleFocus($event)"
                            @blur="handleBlur($event)"></textarea>
                        <label>Comment</label>
                        <span>Comment</span>
                    </div>

                    <div class="input-container focus">
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
import getProject from '../../composables/project/getProject'
import getAllLibraries from '../../composables/library/getAllLibraries'
import updateProject from '../../composables/project/updateProject'
import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'ProjectEdit',
    props: ['trace', 'id', 'workspaceID', 'workspace', 'currentuser', 'connected'],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('ProjectEdit.vue', trace.value)
        consoleLog('ProjectEdit.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }        


        const project = ref([])
        const projectID = ref(props.id)
        const workspaceID = ref(props.workspaceID)
        const workspace = ref(props.workspace)
        const projectName = ref('')
        const libraries = ref([])
        const libraryID = ref(0)
        const libraryName = ref('')
        const selectedLibrary = ref(0)
        const comment = ref('')
        let actionCancel = 0;

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
        // Get the project data
        // --------------------------------------------------------------------------
        const { error, loadProject } = getProject(projectID.value)
        loadProject(project, trace.value)
            .then(function () {
                consoleLog('ProjectEdit.vue/getProject', 2, '------ project: ' + projectID.value, trace.value)
                consoleLog('ProjectEdit.vue/getProject', 2, project.value, trace.value)
                projectName.value = project.value.project
                libraryID.value = project.value.libraryID
                comment.value = project.value.comment
                createdBy.value = project.value.createdby + ' on: ' + project.value.created
                updatedBy.value = project.value.updatedby + ' on: ' + project.value.updated
            })

        // --------------------------------------------------------------------------
        // Get all the libraries data
        // --------------------------------------------------------------------------
        const { error2, loadLibraries } = getAllLibraries()
        loadLibraries(libraries, trace.value)
            .then(function () {
                consoleLog('ProjectEdit.vue/getAllLibraries', 2, '------ library: ' + libraryID.value, trace.value)
                consoleLog('ProjectEdit.vue/getAllLibraries', 2, libraries.value, trace.value)
                if (libraries.value.success && libraries.value.data.length) {
                    libraries.value = libraries.value.data
                    selectedLibrary.value = ({ id: libraryID.value })
                    consoleLog('ProjectEdit.vue/getAllLibraries', 2, '--------- selectedLibrary', trace.value)
                    consoleLog('ProjectEdit.vue/getAllLibraries', 2, selectedLibrary.value, trace.value)
                } else {
                    // Error no library found!
                    consoleLog('ProjectEdit.vue/getAllLibraries', 2, libraries.value.message, trace.value)
                    consoleLog('ProjectEdit.vue/getAllLibraries', 2, libraries.value.stack, trace.value)
                    DisplayError('I cannot detect a library!\nCheck with your Administrator', 'Alert')
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
        // User selects another library, store the current ID
        // --------------------------------------------------------------------------
        const handleLibraryChange = () => {
            consoleLog('ProjectEdit.vue/handleLibraryChange', 2, 'User changed the library Id: ' + selectedLibrary.value.id, trace.value)
            libraryID.value = selectedLibrary.value.id
        }

        // --------------------------------------------------------------------------
        // User cancel the action, leave the screen and returns to the list
        // --------------------------------------------------------------------------
        const handleCancel = () => {
             actionCancel = 1
             consoleLog('ProjectEdit.vue/handleCancel', 2, 'User Cancel the action', trace.value)
             router.push({ name: 'Projects' })
        }


        // -----------------------------------------------------------------------------------
        // leave the screen and go to the projects screen (used by the function DisplayError)
        // -----------------------------------------------------------------------------------
        const gotoProjects = () => {
            router.push({ name: 'Projects' })
        }

        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = () => {

            if (actionCancel == 1) return 1
            consoleLog('ProjectEdit.vue/handleSubmit', 2, 'User Submit the action', trace.value)

            const { error, updateTheProject } = updateProject(projectID.value, workspaceID.value, projectName.value, libraryID.value, comment.value, userName.value, today)
            updateTheProject(project, trace.value)
                .then(function () {
                    consoleLog('ProjectEdit.vue/handleSubmit', 2, '------ Update the project: ' + workspaceID.value + ', ' + projectName.value + ', ' + libraryID.value + ', ' + comment.value + ', ' + projectID.value, trace.value)
                    consoleLog('ProjectEdit.vue/handleSubmit', 2, project.value, trace.value)
                    consoleLog('ProjectEdit.vue/handleSubmit', 2, 'Success: ' + project.value.success, trace.value)
                    if (project.value.success) {
                        consoleLog('ProjectEdit.vue/handleSubmit', 2, 'Message OK: ' + project.value.message, trace.value)
                        DisplayError(project.value.message, 'Info', gotoProjects)
                        //router.push({ name: 'Projects' })
                    } else {
                        // Error during update found!
                        consoleLog('ProjectEdit.vue/handleSubmit', 2, 'Message KO: ' + project.value.message, trace.value)
                        consoleLog('ProjectEdit.vue/handleSubmit', 2, project.value.stack, trace.value)
                        DisplayError(project.value.message, 'Alert')
                    }
                })
        }


        return {
            errorMessage, styleMessage, project, workspaceID, workspace, projectName, libraryName, 
            libraries, comment, selectedLibrary, createdBy, updatedBy,
            handleLibraryChange, handleCancel, handleSubmit, handleFocus, handleBlur
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