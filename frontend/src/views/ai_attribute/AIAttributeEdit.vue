<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">

            <div class="banner">
                <h3 class="title">Attribute</h3>
                <img src="../../assets/AIRobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <form @submit.prevent="handleSubmit">

                    <div class="input-container focus">
                        <input type="text" name="name" class="input disabled"
                            title="name of the project" v-model="projectName" disabled/>
                        <label>Project</label>
                        <span>Project</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="name" class="input" maxlength="80"
                            title="Full Attribute" v-model="name" />
                        <label>Name</label>
                        <span>Name</span>
                    </div>

                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="first" class="input" maxlength="200"
                            title="Number of descendant(s) to analyse" v-model="first" />
                        <label>First</label>
                        <span>First</span>
                    </div>

                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="intermediate" class="input" maxlength="200"
                            title="Number of descendant(s) to analyse" v-model="intermediate" />
                        <label>Intermediate</label>
                        <span>Intermediate</span>
                    </div>

                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="last" class="input" maxlength="200"
                            title="Number of descendant(s) to analyse" v-model="last" />
                        <label>Last</label>
                        <span>Last</span>
                    </div>

                    <div class="input-container textarea focus">
                        <textarea name="comment" class="input" maxlength="80" v-model="comment" @focus="handleFocus($event)"
                            @blur="handleBlur($event)"></textarea>
                        <label>Comment</label>
                        <span>Comment</span>
                    </div>

                    <div class="input-container focus">
                        <select id="active" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)" @change="handleActiveChange()"
                            v-model="selectedActive">
                            <option v-for="active in actives" :key="active.activeID" v-bind:value="{ id: active.activeID }">
                                {{ active.active }}</option>
                        </select>
                        <label>Status</label>
                        <span>Status</span>
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
import updateAI_Attribute from '../../composables/ai_attribute/updateAI_Attribute'
import getAI_Attribute from '../../composables/ai_attribute/getAI_Attribute'

import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'aiAttributeEdit',
    props: ['trace', 'id', 'projectID', 'projectName', 'userID', 'userName', 'connected'],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('AIAttributeEdit.vue', trace.value)
        consoleLog('AIAttributeEdit.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }        


        const aiAttribute = ref([])
        const attributeID = ref(props.id)
        const projectName = ref(props.projectName)
        const projectID = ref(props.projectID)
        const userID = ref(props.userID)
        const name = ref('')
        const first = ref(0)
        const intermediate = ref(0)
        const last = ref(0)
        const comment = ref('')
        const activeID = ref(1)
        const actives = ref([{ activeID: '1', active: 'Active' }, { activeID: '0', active: 'Not Active' }])
        const selectedActive = ref({ id: activeID.value })

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
            consoleLog('AIAttributeEdit.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }



        // --------------------------------------------------------------------------
        // Get the aiAttribute data
        // --------------------------------------------------------------------------
        const { error, getTheAI_Attribute } = getAI_Attribute(attributeID.value)
        getTheAI_Attribute(aiAttribute, trace.value)
            .then(function () {
                consoleLog('AIAttributeEdit.vue/getAI_Attribute', 2, '------ Attribute: ' + attributeID.value, trace.value)
                if (aiAttribute.value.success && aiAttribute.value.data.length) {
                    aiAttribute.value = aiAttribute.value.data
                    consoleLog('AIAttributeEdit.vue/getAI_Attribute', 2, aiAttribute, trace.value)
                    name.value = aiAttribute.value[0].name
                    first.value = aiAttribute.value[0].first
                    intermediate.value = aiAttribute.value[0].intermediate
                    last.value = aiAttribute.value[0].last
                    comment.value = aiAttribute.value[0].comment
                    activeID.value = aiAttribute.value[0].active
                    selectedActive.value = ({ id: aiAttribute.value[0].active })
                    return (1)
                } else {
                    consoleLog('AIAttributeEdit.vue/getAI_Attribute', 2, 'No Attribute found!', trace.value)
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
        // User selects another active value, store the current ID
        // --------------------------------------------------------------------------
        const handleActiveChange = () => {
            consoleLog('RuleEdit.vue/handleActiveChange', 2, 'User changed the active value: ' + selectedActive.value.id, trace.value)
            activeID.value = selectedActive.value.id
        }        

        // --------------------------------------------------------------------------
        // User cancel the action, leave the screen and returns to the list
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('AIAttributeEdit.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'AIAttribute' })
        }

        // -----------------------------------------------------------------------------------
        // leave the screen and go to the Attribute screen (used by the function DisplayError)
        // -----------------------------------------------------------------------------------
        const gotoFunctions = () => {
            router.push({ name: 'AIAttribute' })
        }

        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = () => {
            consoleLog('AIAttributeEdit.vue/handleSubmit', 2, 'User Submit the action - attributeID: ' + attributeID.value, trace.value)
            // attributeID, name, first, intermediate, last, comment, active
            const { error, updateTheAI_Attribute } = updateAI_Attribute(attributeID.value, name.value, first.value, intermediate.value, last.value, comment.value, selectedActive.value.id)
                updateTheAI_Attribute(aiAttribute, trace.value)
                .then(function () {
                    consoleLog('AIAttributeEdit.vue/handleSubmit', 2, '------ Update a Attribute - attributeID: ' + attributeID.value, trace.value)
                    consoleLog('AIAttributeEdit.vue/handleSubmit', 2, aiAttribute.value, trace.value)
                    consoleLog('AIAttributeEdit.vue/handleSubmit', 2, 'Success: ' + aiAttribute.value.success, trace.value)
                    if (aiAttribute.value.success) {
                        consoleLog('AIAttributeEdit.vue/handleSubmit', 2, 'Message OK: ' + aiAttribute.value.message, trace.value)
                        DisplayError(aiAttribute.value.message, 'Info', gotoFunctions)
                    } else {
                        // Error during insert found!
                        consoleLog('AIAttributeEdit.vue/handleSubmit', 2, 'Message KO: ' + aiAttribute.value.message, trace.value)
                        DisplayError(aiAttribute.value.message, 'Alert')
                    }
                })
        }


        return {
            errorMessage, styleMessage, aiAttribute, projectName, projectID, userID, name, first, intermediate, last, comment, actives, activeID, selectedActive,
            handleCancel, handleSubmit, handleFocus, handleBlur, handleActiveChange
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
    width: 15rem;
    height: 15rem;
    max-width: 15rem;
    max-height: 15rem;
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