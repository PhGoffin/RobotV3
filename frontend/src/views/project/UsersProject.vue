<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">

            <div class="banner">
                <h3 class="title">{{ projectName }}<br>-- Linked Users --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>


            <div class="linkedUser">

                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <button @click="handleAdd">Link a new user</button>

                <div class="linkedusers"  height="150px">
                    <div v-if="error"> {{ error }}</div>
                    <div v-if="linkedUsers.length" class="layout">
                        <UsersProjectList class="usersprojectsList" :linkedUsers="linkedUsers" :workspaceID="workspaceID" :trace="trace"
                            :projectID="projectID" :superUser="superUser" :workspace="workspace"
                            @refreshusersproject="refreshUsersProject" />
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
import UsersProjectList from '../../components/userproject/UsersProjectList.vue'
import Spinner from '../../components/Spinner.vue'
import getProject from '../../composables/project/getProject'
import getAllUsersByProject from '../../composables/user/getAllUsersByProject'
import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'UsersProject',
    props: ['trace', 'id', 'workspaceID', 'workspace', 'superUser', 'connected'],
    components: { Spinner, UsersProjectList },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('UsersProject.vue', trace.value)
        consoleLog('UsersProject.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }        
        

        const project = ref([])
        const projectID = ref(props.id)
        const projectName = ref('')
        const workspaceID = ref(props.workspaceID)
        const workspace = ref(props.workspace)
        const linkedUsers = ref([])
        const superUser = ref(props.superUser)


        let actionCancel = 0;


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


        // -------------------------------------------
        // load all the data of a a project 
        // -------------------------------------------
        const { error, loadProject } = getProject(projectID.value)
        loadProject(project, trace.value)
            .then(function () {
                consoleLog('UsersProject.vue/getProject', 2, '------ project: ' + projectID.value, trace.value)
                consoleLog('UsersProject.vue/getProject', 2, project.value, trace.value)
                projectName.value = project.value.project
                consoleLog('UsersProject.vue/getProject', 2, 'Emit a request to the parent to store the contract (' + projectID.value + ') ' + projectName.value, trace.value)
                context.emit('storecontract', projectID.value, projectName.value)
            })

        // -------------------------------------------
        // load all the linked users of a project 
        // -------------------------------------------
        const loadLinkedUsersData = () => {
            consoleLog('UsersProject.vue/loadLinkedUsersData', 2, 'Loading linked users of a project -  workspaceID: ' + workspaceID.value + ', projectID: ' + projectID.value + ', superUser:' + superUser.value, trace.value)
            const { error, loadUsersProject } = getAllUsersByProject(workspaceID.value, projectID.value)
            loadUsersProject(linkedUsers, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('UsersProject.vue/loadLinkedUsersData', 2, 'Linked users for a project status: ' + linkedUsers.value.success + ' data length: ' + linkedUsers.value.data.length, trace.value)
                    if (linkedUsers.value.success && linkedUsers.value.data.length) {
                        linkedUsers.value = linkedUsers.value.data
                        consoleLog('UsersProject.vue/loadLinkedUsersData', 2, linkedUsers, trace.value)
                        return (1)
                    } else {
                        consoleLog('UsersProject.vue/loadLinkedUsersData', 2, 'No linked user found!', trace.value)
                        return (0)
                    }
                })
        }


        // Load linked user data
        loadLinkedUsersData()

        // --------------------------------------------------------------------------
        // UserProjectSingle emits a request to refresh the linked users
        // --------------------------------------------------------------------------
        const refreshUsersProject = (status, msg) => {
            consoleLog('UsersProject.vue/refreshUsersProject', 2, 'received a request to refresh the linked users from UsersProjectList / UserProjectSingle', trace.value)
            consoleLog('UsersProject.vue/refreshUsersProject', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadLinkedUsersData()
        }


        // --------------------------------------------------------------------------
        // User cancel the action, leave the screen and returns to the list
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            actionCancel = 1
            consoleLog('UsersProject.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'Projects' })
        }

        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = () => {

            if (actionCancel == 1) return 1
            consoleLog('UsersProject.vue/handleSubmit', 2, 'User Submit the action', trace.value)

        }


        // --------------------------------------------------------------------------
        // User asks to add a new linked user
        // --------------------------------------------------------------------------
        const handleAdd = () => {
            consoleLog('UsersProject.vue/handleAdd', 2, 'Add a new linked user - workspaceID:' + workspaceID.value + ', workspace: ' + workspace.value + ', projectID: ' + projectID.value + ', projectName: ' + projectName.value, trace.value)
            router.push({ name: 'UserProjectAdd', params: { workspaceID: workspaceID.value, workspace: workspace.value, projectID: projectID.value, projectName: projectName.value } })
        }


        return {
            errorMessage, styleMessage, linkedUsers, workspaceID, project, projectName, projectID, superUser, trace,
            handleCancel, handleSubmit, refreshUsersProject, handleAdd
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

.linkedUser {
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