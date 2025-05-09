<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">

            <div class="banner">
                <h3 class="title">Pattern</h3>
                <img src="../../assets/AIRobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <form @submit.prevent="handleSubmit">

                    <div class="input-container focus">
                        <input type="text" name="Name" class="input disabled"
                            title="Name of the project" v-model="projectName" disabled/>
                        <label>Project</label>
                        <span>Project</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="Name" class="input" maxlength="20"
                            title="Name of the pattern" v-model="selectorName" />
                        <label>Selector</label>
                        <span>Selector</span>
                    </div>

                    <div class="input-container textarea focus">
                        <textarea name="path" class="input" maxlength="500" v-model="path" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" title="Path of the pattern"></textarea>
                        <label>Path</label>
                        <span>Path</span>
                    </div>


                    <div class="input-container textarea focus">
                        <textarea name="tag" class="input" maxlength="500" v-model="tag" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" title="Tag of the pattern"></textarea>
                        <label>Tag</label>
                        <span>Tag</span>
                    </div>         
                    
                    <div class="input-container textarea focus">
                        <textarea name="attribute" class="input" maxlength="500" v-model="attribute" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" title="Attribute of the pattern"></textarea>
                        <label>Attribute</label>
                        <span>Attribute</span>
                    </div>
                    
                    <div class="input-container textarea focus">
                        <textarea name="result" class="input" maxlength="500" v-model="result" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" title="Result of the pattern"></textarea>
                        <label>Result</label>
                        <span>Result</span>
                    </div>
                    

                    <div class="input-container focus">
                        <input type="text" name="weight" class="input"
                            title="Weight of the pattern (between 0 - 100)" v-model="weight" />
                        <label>Weight</label>
                        <span>Weight</span>
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
import updatePattern from '../../composables/pattern/updatePattern'
import getPattern from '../../composables/pattern/getPattern'

import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'patternEdit',
    props: ['trace', 'id', 'projectID', 'projectName', 'userID', 'userName', 'connected'],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('patternEdit.vue', trace.value)
        consoleLog('patternEdit.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }        


        const pattern = ref([])
        const patternID = ref(props.id)
        const projectName = ref(props.projectName)
        const projectID = ref(props.projectID)
        const userID = ref(props.userID)
        const selectorName = ref('')
        const path = ref('')
        const tag = ref('')
        const attribute = ref('')
        const result = ref('')
        const weight = ref('')
        const comment = ref('')
        const activeID = ref(1)
        const actives = ref([{ activeID: '1', active: 'Active' }, { activeID: '0', active: 'Not Active' }, { activeID: '2', active: 'Comment' }])
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
            consoleLog('patternEdit.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }



        // --------------------------------------------------------------------------
        // Get the pattern data
        // --------------------------------------------------------------------------
        const { error, getThePattern } = getPattern(patternID.value)
        getThePattern(pattern, trace.value)
            .then(function () {
                consoleLog('patternEdit.vue/getPattern', 2, '------ Pattern: ' + patternID.value, trace.value)
                if (pattern.value.success && pattern.value.data.length) {
                    pattern.value = pattern.value.data
                    consoleLog('patternEdit.vue/getPattern', 2, pattern, trace.value)
                    selectorName.value = pattern.value[0].selector
                    path.value = pattern.value[0].path
                    tag.value = pattern.value[0].tag
                    attribute.value = pattern.value[0].attribute
                    result.value = pattern.value[0].result
                    weight.value = pattern.value[0].weight
                    comment.value = pattern.value[0].comment
                    activeID.value = pattern.value[0].active
                    selectedActive.value = ({ id: pattern.value[0].active })
                    return (1)
                } else {
                    consoleLog('patternEdit.vue/getPattern', 2, 'No Pattern found!', trace.value)
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
            consoleLog('patternEdit.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'Patterns' })
        }

        // -----------------------------------------------------------------------------------
        // leave the screen and go to the selector screen (used by the function DisplayError)
        // -----------------------------------------------------------------------------------
        const gotoFunctions = () => {
            router.push({ name: 'Patterns' })
        }

        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = () => {
            consoleLog('patternEdit.vue/handleSubmit', 2, 'User Submit the action - patternID: ' + patternID.value, trace.value)
            // patternID, selectorName, selector, tag, attribute, result, weight, comment, active
            const { error, updateThePattern } = updatePattern(patternID.value, selectorName.value, path.value, tag.value, attribute.value, result.value, weight.value,  comment.value, selectedActive.value.id)
                updateThePattern(pattern, trace.value)
                .then(function () {
                    consoleLog('patternEdit.vue/handleSubmit', 2, '------ Update a pattern - patternID: ' + patternID.value, trace.value)
                    consoleLog('patternEdit.vue/handleSubmit', 2, pattern.value, trace.value)
                    consoleLog('patternEdit.vue/handleSubmit', 2, 'Success: ' + pattern.value.success, trace.value)
                    if (pattern.value.success) {
                        consoleLog('patternEdit.vue/handleSubmit', 2, 'Message OK: ' + pattern.value.message, trace.value)
                        DisplayError(pattern.value.message, 'Info', gotoFunctions)
                    } else {
                        // Error during insert found!
                        consoleLog('patternEdit.vue/handleSubmit', 2, 'Message KO: ' + pattern.value.message, trace.value)
                        DisplayError(pattern.value.message, 'Alert')
                    }
                })
        }


        return {
            errorMessage, styleMessage, pattern, projectName, projectID, userID, selectorName, path, tag, attribute, result, weight, comment, 
            actives, activeID, selectedActive,
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
    position: relative;
    width: 60%;
    min-height: 65vh;
    background-color: #eee;
    border-radius: 3rem;
    box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    overflow: hidden;
    display: grid;
    /*grid-template-columns: repeat(2, 1fr);*/
    grid-template-columns: 3fr 5fr;
}


.banner {
    background-color: #1abc9c;
    max-width: 60%;
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
    /* max-width: 800px;*/
    position: relative;
    background-color: #eee;
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