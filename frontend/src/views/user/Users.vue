<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">

            <div class="banner">
                <h3 class="title" v-if="superUser">All the Users</h3>
                <h3 class="title" v-else>{{ workspace }}<br>-- Users --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>


            <div class="user">

                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <button @click="handleAdd">
                    <i class="fa-solid fa-circle-plus"></i>
                    User</button>


                <form @submit.prevent="handleSubmit">

                    <div class="actions3">
                        <div class="input-container focus" style="min-width: 30rem; max-width: 30rem">
                            <input type="text" name="dataFilter" class="input" @focus="handleFocus($event)"
                                title="You can filter by the login or by first or last name" @blur="handleBlur($event)"
                                v-model="filterValue" />
                            <label>Filter {{ filteredRows }}</label>
                            <span>Filter {{ filteredRows }}</span>
                        </div>
                        <i class="fa-regular fa-trash-can" @click="filterValue = ''" title="Reset the filter"></i>
                    </div>

                </form>

                <div class="entities"  height="150px">
                    <div v-if="error"> {{ error }}</div>
                    <div v-if="filteredData.length" class="layout">
                        <UsersList class="usersList" :users="filteredData" :workspaceID="workspaceID" :trace="trace"
                            :superUser="superUser" :workspace="workspace" @refreshusers="refreshUsers" />
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import UsersList from '../../components/user/UsersList.vue'
import Spinner from '../../components/Spinner.vue'
import getAllUsersByWorkspace from '../../composables/user/getAllUsersByWorkspace'
import getAllUsers from '../../composables/user/getAllUsers'
import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'Users',
    props: ['trace', 'workspaceID', 'workspace', 'superUser', 'connected'],
    components: { Spinner, UsersList },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('Users.vue', trace.value)
        consoleLog('Users.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }


        const workspaceID = ref(props.workspaceID)
        const workspace = ref(props.workspace)
        const users = ref([])
        const superUser = ref(props.superUser)
        const filterValue = ref('')

        let actionCancel = 0;


        const rowNb = ref(1)



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

        // -------------------------------------------
        // load all the users data 
        // -------------------------------------------
        const loadUsersData = () => {

            // Load all the users
            if (superUser.value) {
                // Load all the users
                consoleLog('Users.vue/loadUsersData', 2, 'Loading all users - Superuser: ' + superUser.value, trace.value)
                const { error, loadTheUsers } = getAllUsers()
                loadTheUsers(users, trace.value)
                    .then(function () {
                        // check the status of the load
                        consoleLog('Users.vue/loadUsersData', 2, 'All users - status: ' + users.value.success, trace.value)
                        if (users.value.success && users.value.data.length) {
                            users.value = users.value.data
                            filteredData.value = users.value
                            consoleLog('Users.vue/loadUsersData', 2, users, trace.value)
                            return (1)
                        } else {
                            consoleLog('Users.vue/loadUsersData', 2, 'No user found!', trace.value)
                            return (0)
                        }
                    })
            } else {
                // Load all the users of the workspace
                consoleLog('Users.vue/loadUsersData', 2, 'Loading users of a workspace -  workspaceID: ' + workspaceID.value + ', superUser:' + superUser.value, trace.value)
                const { error, loadUsersByWorkspace } = getAllUsersByWorkspace(workspaceID.value)
                loadUsersByWorkspace(users, trace.value)
                    .then(function () {
                        // check the status of the load
                        consoleLog('Users.vue/loadUsersData', 2, 'users of a workspace - status: ' + users.value.success, trace.value)
                        if (users.value.success && users.value.data.length) {
                            users.value = users.value.data
                            filteredData.value = users.value
                            consoleLog('Users.vue/loadUsersData', 2, users, trace.value)
                            return (1)
                        } else {
                            consoleLog('Users.vue/loadUsersData', 2, 'No workspace user found!', trace.value)
                            return (0)
                        }
                    })
            }
        }


        // Load linked user data
        loadUsersData()


        // ---------------------------------------------
        // Compute the users depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('Users.vue/filteredData', 2, 'computed value', trace.value)
            if (users.value.length) {
                return users.value.filter((ar) => ar.login.toUpperCase().includes(filterValue.value.toUpperCase())
                    || ar.lastName.toUpperCase().includes(filterValue.value.toUpperCase())
                    || ar.firstName.toUpperCase().includes(filterValue.value.toUpperCase()))
            } else {
                filteredRows.value = ''
                return users.value
            }
        });


        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })


        // --------------------------------------------------------------------------
        // UserSingle emits a request to refresh the users
        // --------------------------------------------------------------------------
        const refreshUsers = (status, msg) => {
            consoleLog('Users.vue/refreshUsers', 2, 'received a request to refresh the users from UsersList / UserSingle', trace.value)
            consoleLog('Users.vue/refreshUsers', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadUsersData()
        }


        // --------------------------------------------------------------------------
        // User cancel the action, leave the screen and returns to the list
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            actionCancel = 1
            consoleLog('Users.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'ControlPanel' })
        }


        // --------------------------------------------------------------------------
        // User asks to add a new linked user
        // --------------------------------------------------------------------------
        const handleAdd = () => {
            consoleLog('Users.vue/handleAdd', 2, 'Add a new user - workspaceID:' + workspaceID.value + ', workspace: ' + workspace.value, trace.value)
            router.push({ name: 'UserAdd', params: { workspaceID: workspaceID.value, workspace: workspace.value, workspace: trace.value } })
        }


        // --------------------------------------------------------------------------
        // User change the filter
        // --------------------------------------------------------------------------
        const handleFilter = () => {
            return filteredData.value = users.value.filter((ar) => ar.lastName.toUpperCase().includes(filterValue.value.toUpperCase()) || ar.login.includes(filterValue.value))
        }



        return {
            errorMessage, styleMessage, users, filteredData, filteredRows, filterValue, workspaceID, superUser, trace,
            handleCancel, refreshUsers, handleAdd, handleFocus, handleBlur, handleFilter
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

.user {
    /* padding: 2.3rem 2.2rem; */
    position: relative;
    background-color: #eee;
}

form {
    padding: 0 2.3rem 0 2.2rem;
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
.actions3 {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.actions3 i {
    font-size: 24px;
    margin-left: 10px;
    color: #bbb;
    cursor: pointer;
}

.actions3 i.blue {
    font-size: 24px;
    margin-left: 10px;
    color: #072af5;
    cursor: pointer;
}

.actions3 i.green {
    font-size: 24px;
    margin-left: 10px;
    color: #07ca62;
    cursor: pointer;
}

.actions3 i:hover {
    color: #777;
}
.entities {
    overflow: scroll;
    scrollbar-width: thin;
    height: 50rem;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>