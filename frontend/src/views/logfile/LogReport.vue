<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">Log Report</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>

            </div>


            <div class="entity">
                <h3 class="title"> {{ scenarioName }}</h3>
                <div class="actions">
                    <button @click="handleGallery">
                        <i class="fa-solid fa-camera"></i>
                        Gallery</button>
                </div>

                <div class="entities">
                    <table class="scroll">
                        <tbody>
                            <tr>
                                <th class="ref">Category</th>
                                <th class="ref">Message</th>
                            </tr>

                            <tr v-for="log in logfiles" :key="log.logID" v-bind:value="{ id: log.logID }">
                                <td class="ref bold label begin" :class="log.category">
                                    {{ log.category }}
                                </td>
                                <td class="ref bold value end" :class="log.category">
                                    {{ log.message }}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>

                <div class="input-container">
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
import Spinner from '../../components/Spinner.vue'
import getLogfilesByUser from '../../composables/logfile/getLogfilesByUser'
import getReferenceByCode from '../../composables/reference/getReferenceByCode'
import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'Logdile',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'connected', 'workspaceID', 'workspace', 'projectID', 'projectName', 'location'],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const logfiles = ref([])
        const reference = ref([])
        const scenarioName = ref('toto')
        const location = ref(props.location)
        const userID = ref(props.userID)
        const projectID = ref(props.projectID)

        displayMsg('LogReport.vue', trace.value)
        consoleLog('LogReport.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }


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
            consoleLog('LogReport.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        // ----------------------------------------------------------------------------------------------
        // Get the name of the scenario stored in the reference table (during the excution the scenario)
        // ----------------------------------------------------------------------------------------------
        const { error1, loadReference } = getReferenceByCode(projectID.value, userID.value, 'Scenario Name')
        loadReference(reference, trace.value)
            .then(function () {
                consoleLog('LogReport.vue/getReferenceByCode', 2, '------ projectID: ' + projectID.value + ', userID: ' + userID.value, trace.value)
                consoleLog('LogReport.vue/getReferenceByCode', 2, reference, trace.value)
                if (reference.value.success && reference.value.data.length) {
                    reference.value = reference.value.data
                    consoleLog('LogReport.vue/getReferenceByCode', 2, reference, trace.value)
                    consoleLog('LogReport.vue/getReferenceByCode', 2, reference.value[0].label, trace.value)
                    scenarioName.value = reference.value[0].label
                    return (1)
                } else {
                    consoleLog('LogReport.vue/getReferenceByCode', 2, 'No reference found for the code: Scenario Name!', trace.value)
                    scenarioName.value = 'Unknown scenario!'
                    return (0)
                }
            })


        // --------------------------------------------------------------------------
        // Get the logfile data
        // --------------------------------------------------------------------------
        const { error2, loadLogfile } = getLogfilesByUser(userID.value)
        loadLogfile(logfiles, trace.value)
            .then(function () {
                consoleLog('LogReport.vue/getLogfilesByUser', 2, '------ userID: ' + userID.value, trace.value)
                consoleLog('LogReport.vue/getLogfilesByUser', 2, logfiles, trace.value)
                if (logfiles.value.success && logfiles.value.data.length) {
                    logfiles.value = logfiles.value.data
                    consoleLog('LogReport.vue/getLogfilesByUser', 2, logfiles, trace.value)

                    // Filter the data to keep only Describe, It, Title, Execute
                    // for (let elt = 0; elt < size; elt++) {
                    for (let id = 0; id < logfiles.value.length; id++) {
                        if ('*Describe*It*Title*Execute*Warning*Error*'.includes(logfiles.value[id].category)) {
                            logfiles.value[id].position = 1
                            console.log('Item:', logfiles.value[id])
                        } else logfiles.value[id].position = -1
                    }
                    console.log('Before:', logfiles.value.length)
                    logfiles.value = logfiles.value.filter((ar) => ar.position == 1)
                    console.log('After:', logfiles.value.length)

                    return (1)
                } else {
                    consoleLog('LogReport.vue/getLogfilesByUser', 2, 'No logfile found!', trace.value)
                    return (0)
                }
            })


        // --------------------------------------------------------------------------
        // User cancel the action, Back to the control panel
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('LogReport.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            if (location.value == 'dashboard') {
                router.push({ name: 'Dashboard' })
            } else if (location.value == 'AIdashboard') {
                router.push({ name: 'AIDashboard' })
            } else if (location.value == 'scenario') {
                router.push({ name: 'Scenarios' })
            } else if (location.value == 'suite') {
                router.push({ name: 'Suite Set' })
            } else if (location.value == 'story') {
                router.push({ name: 'Story Set' })
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
        // User ask to go to the gallery
        // --------------------------------------------------------------------------
        const handleGallery = (event) => {
            router.push({ name: 'Gallery' })
        }



        return {
            errorMessage, styleMessage, trace, logfiles, scenarioName,
            handleCancel, handleFocus, handleBlur, handleGallery
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
    width: 70%;
    display: flex;
    justify-content: center;
}

.banner .button {
    position: absolute;
    top: -2rem;
    background-color: blue;
}

table.scroll {
    position: relative;
    padding: 2rem;
    margin: 0.5rem 5rem 0 0;
    overflow: auto;

    display: block;
    margin-left: auto;
    margin-right: auto;


}

td.ref.Describe {
    background-color: #f4c788;
}

td.ref.It {
    background-color: #afbee6;
}

td.ref.Step {
    background-color: #d1d7dd;
}

td.ref.Skip {
    background-color: #c2c6ca;
    border-left: 4px solid #f57575;
}

td.ref.Loop {
    background-color: #e9cff3;
}

td.ref.Warning {
    background-color: #e8de78;
}

td.ref.Watch {
    background-color: #e7b4ee;
}

td.ref.Error {
    background-color: #eb9d9d;
}

td.ref.Message {
    background-color: #bfdfc4;
}

td.ref.Execute {
    background-color: #9df7ac;
}


td.ref.Info {
    background-color: #ddeedf;
}

td.ref.Title {
    background-color: #b0faf6;
}


th.ref,
td.ref {
    padding: 0.1rem 1.2rem 0.1rem 2rem;
    text-align: left;
}

td.ref {
    background-color: #d7d1d1;
}

td.bold {
    font-weight: bold;
}

td.begin {
    border-top-left-radius: 3rem;
    border-bottom-left-radius: 3rem;
}

td.end {
    border-top-right-radius: 3rem;
    border-bottom-right-radius: 3rem;
}



td.label {
    color: blue;
}

td.value {
    color: rgb(66, 64, 64);
}

.actions {
    position: relative;
    display: flex;
    align-items: center;
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
    top: 10rem;
    width: 12rem;
    height: 12rem;
    max-width: 12rem;
    max-height: 12rem;
    animation: rotatehead 1.0s linear;
}

img.smiley {
    width: 80px;
    height: 80px;
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

.entity .title {
    padding: 2.3rem 2.2rem;
    color: #1abc9c;
    font-weight: bold;
    font-size: 1.5rem;
    line-height: 1;
    margin-bottom: 0.7rem;
}

.barchart {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    left: -15%;
    height: 90%;
    width: 100%;
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

.select {
    margin-left: 0.5rem;
    background-color: #b7c39a;
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
    margin: 0 1.5rem 0 1.5rem
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

button.execute {
    background-color: #80d365;
}

button.execute:hover {
    background-color: white;
    color: black;
}

button.init {
    background-color: #24a2eb;
}

button.init:hover {
    background-color: white;
    color: black;
}

button.reset {
    background-color: #9ac038;
}

button.reset:hover {
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
    background-color: #1abc9c;
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