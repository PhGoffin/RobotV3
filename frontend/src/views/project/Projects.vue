<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title" v-if="superUser">All the Projects</h3>
                <h3 class="title" v-else>{{ workspace }}<br>-- Projects --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="project">

                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <button @click="handleAdd">
                    <i class="fa-solid fa-circle-plus"></i>                    
                    Project</button>

                <div class="entities"  height="150px">
                    <div v-if="error"> {{ error }}</div>
                    <div v-if="projects.length" class="layout">
                        <ProjectsList class="projectsList" :projects="projects" :projectID="projectID" :workspaceID="workspaceID" :workspace="workspace" :superUser="superUser" :trace="trace" 
                            @refreshprojects="refreshProjects" @storelocation="storeLocation"/>
                    </div>
                </div>
                <div class="input-group">
                    <button @click="handleCancel" class="cancel">
                        <i class="fa-solid fa-ban"></i>
                        Cancel</button>
                </div>

            </div>
        </div>


    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProjectsList from '../../components/project/ProjectsList.vue'
import getAllProjectsByUser from '../../composables/project/getAllProjectsByUser'
import getAllProjectsByWorkspace from '../../composables/project/getAllProjectsByWorkspace'
import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Project',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected', 'workspaceID', 'workspace', 'projectID', 'projectName'],
    components: { ProjectsList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('Projects.vue', trace.value)
        consoleLog('Projects.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }        


        const workspaceID = ref(props.workspaceID)
        const workspace = ref(props.workspace)
        const userID = ref(props.userID)
        const superUser = ref(props.superUser)
        const projects = ref([])
        const projectID = ref(props.projectID)
        const displayInfo = ref('')

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
            consoleLog('Projects.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        const loadProjectData = () => {
            if (superUser.value) {
                // -------------------------------------------
                // load all the projects of the workspace 
                // -------------------------------------------
                consoleLog('Projects.vue/loadProjectData', 2, 'Loading project by workspace (superuser)', trace.value)
                const { error, loadProjects } = getAllProjectsByWorkspace(workspaceID.value)
                loadProjects(projects, trace.value)
                    .then(function () {
                        // check the status of the load
                        consoleLog('Projects.vue/loadProjectData', 2, 'Project Load by Workspace status: ' + projects.value.success, trace.value)
                        if (projects.value.success && projects.value.data.length) {
                            projects.value = projects.value.data
                            consoleLog('Projects.vue/loadProjectData', 2, projects, trace.value)
                            return (1)
                        } else {
                            consoleLog('Projects.vue/loadProjectData', 2, 'No project found!', trace.value)
                            return (0)
                        }
                    })

            } else {
                // -------------------------------------------
                // load all the projects of the user 
                // -------------------------------------------
                consoleLog('Projects.vue/loadProjectData', 2, 'Loading project by user', trace.value)
                const { error, loadProjects } = getAllProjectsByUser(userID.value)
                loadProjects(projects, trace.value)
                    .then(function () {
                        // check the status of the load
                        consoleLog('Projects.vue/loadProjectData', 2, 'Project Load by User status: ' + projects.value.success, trace.value)
                        if (projects.value.success && projects.value.data.length) {
                            projects.value = projects.value.data
                            consoleLog('Projects.vue/loadProjectData', 2, projects, trace.value)
                            return (1)
                        } else {
                            consoleLog('Projects.vue/loadProjectData', 2, 'No project found!', trace.value)
                            return (0)
                        }
                    })
            }
        }


        // Load projects data
        loadProjectData()

        // --------------------------------------------------------------------------
        // ProjectSingle emits a request to refresh the contracts
        // --------------------------------------------------------------------------
        const refreshProjects = (status, msg) => {
            consoleLog('Projects.vue/refreshProjects', 2, 'received a request to refresh the projects from ProjectList / ProjectSingle', trace.value)
            consoleLog('Projects.vue/refreshProjects', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadProjectData()
        }


        // --------------------------------------------------------------------------
        // User cancel the action, Back to the control panel
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('Projects.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'ControlPanel' })
        }


        // --------------------------------------------------------------------------
        // User asks to add a new project
        // --------------------------------------------------------------------------
        const handleAdd = () => {
            consoleLog('Projects.vue/handleAdd', 2, 'Add a new project', trace.value)
            router.push({ name: 'ProjectAdd' })
        }


        // --------------------------------------------------------------------------
        // ProjectList emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = ( location) => {
          consoleLog ('Projects.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
            context.emit('storelocation', location)
        } 


        return { errorMessage, styleMessage, projects, workspaceID, workspace, superUser, displayInfo, trace, projectID, 
                 handleCancel, handleAdd, refreshProjects, storeLocation}


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
    /* max-width: 2000px; */
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

.banner .popup {
    position: absolute;
    bottom: 5%;
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    left: 10%;
}

.popup .message {
    border-radius: 3rem;
    padding: 2.3rem 2.2rem;
    color: black;
    background: #eb84ad;
}

.popup .info {
    border-radius: 3rem;
    padding: 2.3rem 2.2rem;
    color: black;
    background: #beb5b8;
}

.popup .buttonGroup {
    display: flex;
    align-items: center;
    justify-content: center;

}
.popup .button {
    padding: 0.6rem 1.3rem;
    font-size: large;
    color: white;
    line-height: 1;
    border-radius: 25px;
    outline: none;
    cursor: pointer;
    transition: 0.3s;
    margin: 1.3rem 0.5rem 0.5rem 0;
}

.popup .button.yes {
    background-color: #beb5b8;
    border: 2px solid black;
}

.popup .button.no {
    background-color: #787a7a;
    border: 2px solid black;
}


.popup .button:hover {
    background-color: white;
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

.project {
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
    background: none;
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
.entities {
    overflow: scroll;
    /* scrollbar-color: red orange; */
    scrollbar-width: thin;
    height: 50rem;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>