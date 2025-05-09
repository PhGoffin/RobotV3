<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">

            <div class="banner">
                <h3 class="title">{{ projectName }}<br>-- Dummy User --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <form @submit.prevent="handleSubmit">

                    <div class="actions2">
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
                        <input type="text" name="project" class="input disabled" v-model="projectName" disabled />
                        <label>Project</label>
                        <span>Project</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="code" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            maxlength="40" v-model="dummy" />
                        <label>Dummy</label>
                        <span>Dummy</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="code" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            maxlength="80" v-model="user" />
                        <label>User</label>
                        <span>User</span>
                    </div>

                    <div class="input-container focus">
                        <select id="encrypted" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            v-model="selectedCrypted" title="Passwords must be encrypted for the real users!">
                            <option v-for="crypted in cryptedvalues" :key="crypted.cryptedID"
                                v-bind:value="{ id: crypted.cryptedID }">
                                {{ crypted.crypted }}</option>
                        </select>
                        <label>Encrypted</label>
                        <span>Encrypted</span>
                    </div>

                    <div class="actions">

                        <div class="input-container focus">
                            <input type="text" name="password" class="input" @focus="handleFocus($event)"
                                @blur="handleBlur($event)" maxlength="40" v-model="password" style="width: 180%"
                                title="Use the crypt icon to protect your password " />
                            <label>Password</label>
                            <span>Password</span>
                        </div>
                        <i class="fa-regular fa-pen-to-square" title="crypt the password" @click="handleCrypt"></i>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="extrainfo" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            maxlength="80" v-model="extraInfo" />
                        <label>Extra Information</label>
                        <span>Extra Information</span>
                    </div>                    

                    <div class="input-container focus">
                        <select id="active" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            v-model="selectedActive">
                            <option v-for="active in actives" :key="active.activeID" v-bind:value="{ id: active.activeID }">
                                {{ active.active }}</option>
                        </select>
                        <label>Active</label>
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
import updateDummyuser from '../../composables/dummyuser/updateDummyuser'
import getDummyuser from '../../composables/dummyuser/getDummyuser'
import cryptDummyuser from '../../composables/dummyuser/cryptDummyuser'

import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'DummyuserEdit',
    props: ['trace', 'id', 'projectID', 'projectName', 'userID', 'currentuser', 'userName', 'connected'],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('DummyuserEdit.vue', trace.value)
        consoleLog('DummyuserEdit.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }        


        const dummyuser = ref([])
        const dummyuserID = ref(props.id)
        const projectName = ref(props.projectName)
        const projectID = ref(props.projectID)
        const userID = ref(props.userID)
        const userName = ref(props.currentuser)
        const dummy = ref('')
        const user = ref('')
        const password = ref('')

        const active = ref(1)
        const actives = ref([{ activeID: '1', active: 'Yes' }, { activeID: '0', active: 'No' }])
        const selectedActive = ref({ id: active.value })

        const crypted = ref(0)
        const cryptedvalues = ref([{ cryptedID: '1', crypted: 'Yes' }, { cryptedID: '0', crypted: 'No' }])
        const selectedCrypted = ref({ id: crypted.value })
        const extraInfo = ref('')

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
            consoleLog('DummyuserEdit.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        // --------------------------------------------------------------------------
        // Get the dummyuser data
        // --------------------------------------------------------------------------
        const { error, loadDummyuser } = getDummyuser(dummyuserID.value)
        loadDummyuser(dummyuser, trace.value)
            .then(function () {
                consoleLog('DummyuserEdit.vue/getDummyuser', 2, '------ dummyuser: ' + dummyuserID.value, trace.value)
                //console.log(dummyuser.value)
                if (dummyuser.value.success && dummyuser.value.data.length) {
                    dummyuser.value = dummyuser.value.data
                    consoleLog('Dummyusers.vue/loadDummyuserData', 2, dummyuser, trace.value)
                    //projectID.value = dummyuser.value.projectID
                    dummy.value = dummyuser.value[0].dummy
                    user.value = dummyuser.value[0].user
                    password.value = dummyuser.value[0].password
                    crypted.value = dummyuser.value[0].crypted
                    extraInfo.value = dummyuser.value[0].extraInfo
                    selectedActive.value = ({ id: dummyuser.value[0].active })
                    selectedCrypted.value = ({ id: dummyuser.value[0].crypted })
                    createdBy.value = dummyuser.value[0].createdby + ' on: ' + dummyuser.value[0].created
                    updatedBy.value = dummyuser.value[0].updatedby + ' on: ' + dummyuser.value[0].updated
                    return (1)
                } else {
                    consoleLog('Dummyusers.vue/loadDummyuserData', 2, 'No dummyuser found!', trace.value)
                    return (0)
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
            consoleLog('DummyuserEdit.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'Dummy Users' })
        }


        // --------------------------------------------------------------------------
        // User asks to crypt a password
        // --------------------------------------------------------------------------
        const handleCrypt = async () => {
            consoleLog('DummyuserEdit.vue/handleCrypt', 2, 'User asks to crypt the password: ' + password.value, trace.value)

            let dummypassword = []

            const { error, cryptPassword } = cryptDummyuser(password.value)
            return await cryptPassword(dummypassword, trace.value)
                .then(function () {
                    // check the status of the crypt
                    consoleLog('Dummyuser.vue/handleCrypt', 2, 'Dummy user crypt status: ' + dummypassword.value.success, trace.value)
                    if (dummypassword.value.success) {
                        consoleLog('Dummyuser.vue/handleCrypt', 2, 'Crypted password: ' + dummypassword.value.password, trace.value)
                        password.value = dummypassword.value.password
                        selectedCrypted.value.id = 1
                        return (1)
                    } else {
                        consoleLog('Dummyuser.vue/handleCrypt', 2, 'Error during the password crypt', trace.value)
                        return (0)
                    }
                })

        }




        // -----------------------------------------------------------------------------------
        // leave the screen and go to the Dummyusers screen (used by the function DisplayError)
        // -----------------------------------------------------------------------------------
        const gotoDummyusers = () => {
            router.push({ name: 'Dummy Users' })
        }

        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = () => {
            consoleLog('DummyuserEdit.vue/handleSubmit', 2, 'User Submit the action - projectID: ' + projectID.value, trace.value)
            const { error, updateTheDummyuser } = updateDummyuser(dummy.value, user.value, selectedCrypted.value.id, password.value, extraInfo.value, selectedActive.value.id, dummyuserID.value, projectID.value, userName.value, today)
            updateTheDummyuser(dummyuser, trace.value)
                .then(function () {
                    consoleLog('DummyuserEdit.vue/handleSubmit', 2, '------ Update a dummyuser - projectID: ' + projectID.value + ', dummyuserID: ' + dummyuserID.value + ', user: ' + user.value, trace.value)
                    consoleLog('DummyuserEdit.vue/handleSubmit', 2, dummyuser.value, trace.value)
                    consoleLog('DummyuserEdit.vue/handleSubmit', 2, 'Success: ' + dummyuser.value.success, trace.value)
                    if (dummyuser.value.success) {
                        consoleLog('DummyuserEdit.vue/handleSubmit', 2, 'Message OK: ' + dummyuser.value.message, trace.value)
                        DisplayError(dummyuser.value.message, 'Info', gotoDummyusers)
                    } else {
                        // Error during insert found!
                        consoleLog('DummyuserEdit.vue/handleSubmit', 2, 'Message KO: ' + dummyuser.value.message, trace.value)
                        DisplayError(dummyuser.value.message, 'Alert')
                    }
                })
        }


        return {
            errorMessage, styleMessage, dummyuser, projectName, projectID, userID, userName, dummy, user, password, extraInfo,
            actives, selectedActive, crypted, cryptedvalues, selectedCrypted, createdBy, updatedBy,
            handleCancel, handleSubmit, handleFocus, handleBlur, handleCrypt
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
    justify-content: space-between;
    align-items: center;
}

.actions i {
    font-size: 24px;
    margin-left: 10px;
    color: #bbb;
    cursor: pointer;
}

.actions i.blue {
    font-size: 24px;
    margin-left: 10px;
    color: #072af5;
    cursor: pointer;
}

.actions i:hover {
    color: #777;
}
.actions2 {
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
}


</style>