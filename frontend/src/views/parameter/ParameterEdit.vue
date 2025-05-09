<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">

            <div class="banner">
                <h3 class="title">Parameter</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <form @submit.prevent="handleSubmit">

                    <div class="input-container focus">
                        <input type="text" name="project" class="input disabled" v-model="projectName" disabled />
                        <label>Project</label>
                        <span>Project</span>
                    </div>


                    <div class="input-container focus" v-if="location == 'project'">
                        <select id="code" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            v-model="selectedCode">
                            <option v-for="code in codes" :key="code.codeID" v-bind:value="{ id: code.codeID }">
                                {{ code.code }}</option>
                        </select>
                        <label>Code</label>
                        <span>Code</span>
                    </div>

                    <div class="input-container focus" v-else>
                        <input type="text" name="code" class="storyheaderID == 0 ? input : input disabled" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" v-model="code" />
                        <label>Code</label>
                        <span>Code</span>
                    </div>


                    <div class="input-container focus">
                        <div class="actions">
                            <input type="text" name="value" class="input" @focus="handleFocus($event)"
                                @blur="handleBlur($event)" v-model="paramValue" />
                            <label>Value</label>
                            <span>Value</span>
                            <i class="fa-solid fa-bookmark" @click="handleReference()" title="Go to Reference"
                                v-if="code == 'Reference'"> </i>
                        </div>
                    </div>

                    <div class="input-container focus"  v-if="code == 'Reference'"> 
                        <select id="inout" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            v-model="selectedInputOutput">
                            <option v-for="IO in inOut" :key="IO.id"
                                v-bind:value="{ id: IO.id }">
                                {{ IO.label }}</option>
                        </select>
                        <label>Input/Output</label>
                        <span>Input/Output</span>
                    </div>                    

                    <div class="input-container textarea focus">
                        <textarea name="comment" class="input" v-model="comment" @focus="handleFocus($event)"
                            @blur="handleBlur($event)"></textarea>
                        <label>Comment</label>
                        <span>Comment</span>
                    </div>

                    <div class="input-container focus">
                        <select id="active" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            v-model="selectedActive">
                            <option v-for="active in actives" :key="active.activeID"
                                v-bind:value="{ id: active.activeID }">
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
import updateParameter from '../../composables/parameter/updateParameter'
import getParameter from '../../composables/parameter/getParameter'
import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'ParameterEdit',
    props: ['trace', 'id', 'location', 'projectID', 'projectName', 'connected'],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('ParameterEdit.vue', trace.value)
        consoleLog('ParameterEdit.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }

        const parameter = ref([])
        const parameterID = ref(props.id)
        const projectID = ref(props.projectID)
        const projectName = ref(props.projectName)
        const location = ref(props.location)
        const paramValue = ref('')
        const inputOutput = ref(0)
        const inOut = ref([{ id: '1', label: 'Input' }, { id: '0', label: 'Output' }])
        const selectedInputOutput = ref({ id: inputOutput.value })
        const comment = ref('')
        const storyheaderID = ref(0)

        const code = ref('Reference')
        const codes = ref([{ codeID: 'Reference', code: 'Dashboard Reference' }, { codeID: 'Email Host', code: 'Email host' }
        , { codeID: 'Email From', code: 'Email From' }, { codeID: 'Proxy', code: 'Proxy' }])
        const selectedCode = ref({ id: code.value })



        const active = ref(1)
        const actives = ref([{ activeID: '1', active: 'Yes' }, { activeID: '0', active: 'No' }])
        const selectedActive = ref({ id: active.value })

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
            consoleLog('ParameterEdit.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }

        if (location.value.includes('story=')) {
            let data = location.value.split("=");
            if (data[1] != undefined) storyheaderID.value = data[1]
        }


        // --------------------------------------------------------------------------
        // Get the parameter data
        // --------------------------------------------------------------------------
        const { error, loadParameter } = getParameter(parameterID.value)
        loadParameter(parameter, trace.value)
            .then(function () {
                consoleLog('ParameterEdit.vue/getParameter', 2, '------ parameterID: ' + parameterID.value, trace.value)
                if (parameter.value.success && parameter.value.data.length) {
                    parameter.value = parameter.value.data
                    consoleLog('ParameterEdit.vue/getParameter', 2, parameter, trace.value)
                    code.value = parameter.value[0].code
                    selectedCode.value = ({ id: parameter.value[0].code })
                    paramValue.value = parameter.value[0].paramValue
                    comment.value = parameter.value[0].comment
                    selectedActive.value = ({ id: parameter.value[0].active })
                    selectedInputOutput.value = ({id: parameter.value[0].inputoutput})

                    if (location.value.includes('reference=')) {
                        let data = location.value.split("=");
                        if (data[1] != undefined) paramValue.value = data[1]
                        if (data[2] != undefined) storyheaderID.value = data[2]
                    }

                    return (1)
                } else {
                    consoleLog('ParameterEdit.vue/getParameter', 2, 'No parameter found!', trace.value)
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
        // User ask to go to the Reference
        // --------------------------------------------------------------------------
        const handleReference = () => {
            consoleLog('ParameterEdit.vue/handleReference', 2, 'User asks to go to the reference', trace.value)
            context.emit('storelocation', 'parameter=' + storyheaderID.value + '=' + parameterID.value)
            router.push({ name: 'References' })
        }


        // --------------------------------------------------------------------------
        // User cancel the action, leave the screen and returns to the list
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('ParameterEdit.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            if (storyheaderID.value) context.emit('storelocation', 'story=' + storyheaderID.value)
            router.push({ name: 'Parameters' })
        }

        // -----------------------------------------------------------------------------------
        // leave the screen and go to the Parameters screen (used by the function DisplayError)
        // -----------------------------------------------------------------------------------
        const gotoParameters = () => {
            if (storyheaderID.value) context.emit('storelocation', 'story=' + storyheaderID.value)
            router.push({ name: 'Parameters' })
        }

        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = () => {

            consoleLog('ParameterEdit.vue/handleSubmit', 2, 'User Submit the action ', trace.value)
            // in case the parameter is called from the project sceen, the code is in a lisbox (not a free text)
            if (location.value == 'project') {
                code.value = selectedCode.value.id
            }
            const { error, updateTheParameter } = updateParameter(parameterID.value, code.value, paramValue.value, selectedInputOutput.value.id, comment.value, selectedActive.value.id)
            updateTheParameter(parameter, trace.value)
                .then(function () {
                    consoleLog('ParameterEdit.vue/handleSubmit', 2, '------ Add new parameter: ' + code.value + ', parameterID: ' + parameterID.value, trace.value)
                    consoleLog('ParameterEdit.vue/handleSubmit', 2, parameter.value, trace.value)
                    consoleLog('ParameterEdit.vue/handleSubmit', 2, 'Success: ' + parameter.value.success, trace.value)
                    if (parameter.value.success) {
                        consoleLog('ParameterEdit.vue/handleSubmit', 2, 'Message OK: ' + parameter.value.message, trace.value)
                        DisplayError(parameter.value.message, 'Info', gotoParameters)
                    } else {
                        // Error during insert found!
                        consoleLog('ParameterEdit.vue/handleSubmit', 2, 'Message KO: ' + parameter.value.message, trace.value)
                        DisplayError(parameter.value.message, 'Alert')
                    }
                })
        }


        return {
            errorMessage, styleMessage, projectName, code, paramValue, comment, actives, selectedActive, codes, selectedCode, location, inOut, selectedInputOutput, storyheaderID,
            handleCancel, handleSubmit, handleFocus, handleBlur, handleReference
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

.actions i:hover {
    color: #777;
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
</style>