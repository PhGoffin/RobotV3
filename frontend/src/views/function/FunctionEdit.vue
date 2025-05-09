<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">

            <div class="banner">
                <h3 class="title">Function</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <form @submit.prevent="handleSubmit">

                    <div class="input-container focus">
                        <input type="text" name="Name" class="input" maxlength="40"
                            title="Info: a comment must start with **" v-model="functionName" />
                        <label>Name</label>
                        <span>Name</span>
                    </div>

                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="rulefunction" class="input" maxlength="80"
                            title="The name of the function in the rules" v-model="ruleFunction" />
                        <label>Rule</label>
                        <span>Rule</span>
                    </div>


                    <div class="input-container textarea focus">
                        <textarea name="comment" class="input" maxlength="80" v-model="comment"
                            @focus="handleFocus($event)" @blur="handleBlur($event)"></textarea>
                        <label>Comment</label>
                        <span>Comment</span>
                    </div>

                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="tip1" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" maxlength="80" v-model="tip1" />
                        <label>Tip 1</label>
                        <span>Tip 1</span>
                    </div>

                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="parameter1" class="input" @focus="handleFocus($event)"
                            title="Info: if no parameter 1 is foreseen, let's the field empty!"
                            @blur="handleBlur($event)" maxlength="20" v-model="parameter1" />
                        <label>Parameter 1</label>
                        <span>Parameter 1</span>
                    </div>

                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="defaultvalue1" class="input" @focus="handleFocus($event)"
                            title="empty or a default value or a list (example: 1:A, 2:B, 3:C) or <DATA>, <DICT>,<RULE>,<USER>, :<SELECTOR>"
                            @blur="handleBlur($event)" maxlength="400" v-model="defaultValue1" />
                        <label>Default Value 1</label>
                        <span>Default Value 1</span>
                    </div>

                    <!-- <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="natural1" class="input" @focus="handleFocus($event)"
                            title="Name of the attribute in the natural" @blur="handleBlur($event)" maxlength="40"
                            v-model="natural1" />
                        <label>Natural 1</label>
                        <span>Natural 1</span>
                    </div> -->

                    <div class="input-container focus">
                        <select id="natural1" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            @change="handleNatural1Change()" v-model="selectedNatural1">
                            <option v-for="natural in naturals1" :key="natural.naturalID"
                                v-bind:value="{ id: natural.naturalID }">
                                {{ natural.naturalID }}</option>
                        </select>
                        <label>Natural 1</label>
                        <span>Natural 1</span>
                    </div>                    

                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="tip2" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" maxlength="80" v-model="tip2" />
                        <label>Tip 2</label>
                        <span>Tip 2</span>
                    </div>

                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="parameter2" class="input" @focus="handleFocus($event)"
                            title="Info: if no parameter 2 is foreseen, let's the field empty!"
                            @blur="handleBlur($event)" maxlength="20" v-model="parameter2" />
                        <label>Parameter 2</label>
                        <span>Parameter 2</span>
                    </div>

                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="defaultvalue2" class="input" @focus="handleFocus($event)"
                            title="empty or a default value or a list (example: 1:A, 2:B, 3:C) or <DATA>, <DICT>,<RULE>,<USER>"
                            @blur="handleBlur($event)" maxlength="400" v-model="defaultValue2" />
                        <label>Default Value 2</label>
                        <span>Default Value 2</span>
                    </div>

                    <!-- <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="natural2" class="input" @focus="handleFocus($event)"
                            title="Name of the attribute in the natural" @blur="handleBlur($event)" maxlength="40"
                            v-model="natural2" />
                        <label>Natural 2</label>
                        <span>Natural 2</span>
                    </div> -->

                    <div class="input-container focus">
                        <select id="natural2" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            @change="handleNatural2Change()" v-model="selectedNatural2">
                            <option v-for="natural in naturals2" :key="natural.naturalID"
                                v-bind:value="{ id: natural.naturalID }">
                                {{ natural.naturalID }}</option>
                        </select>
                        <label>Natural 2</label>
                        <span>Natural 2</span>
                    </div>                    


                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="tip3" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" maxlength="80" v-model="tip3" />
                        <label>Tip 3</label>
                        <span>Tip 3</span>
                    </div>

                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="parameter3" class="input" @focus="handleFocus($event)"
                            title="Info: if no parameter 3 is foreseen, let's the field empty!"
                            @blur="handleBlur($event)" maxlength="20" v-model="parameter3" />
                        <label>Parameter 3</label>
                        <span>Parameter 3</span>
                    </div>

                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="defaultvalue3" class="input" @focus="handleFocus($event)"
                            title="empty or a default value or a list (example: 1:A, 2:B, 3:C) or <DATA>, <DICT>,<RULE>,<USER>"
                            @blur="handleBlur($event)" maxlength="400" v-model="defaultValue3" />
                        <label>Default Value 3</label>
                        <span>Default Value 3</span>
                    </div>

                    <!-- <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="natural3" class="input" @focus="handleFocus($event)"
                            title="Name of the attribute in the natural" @blur="handleBlur($event)" maxlength="40"
                            v-model="natural3" />
                        <label>Natural 3</label>
                        <span>Natural 3</span>
                    </div> -->

                    <div class="input-container focus">
                        <select id="natural3" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            @change="handleNatural3Change()" v-model="selectedNatural3">
                            <option v-for="natural in naturals3" :key="natural.naturalID"
                                v-bind:value="{ id: natural.naturalID }">
                                {{ natural.naturalID }}</option>
                        </select>
                        <label>Natural 3</label>
                        <span>Natural 3</span>
                    </div>                    


                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="tip4" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" maxlength="80" v-model="tip4" />
                        <label>Tip 4</label>
                        <span>Tip 4</span>
                    </div>

                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="parameter4" class="input" @focus="handleFocus($event)"
                            title="Info: if no parameter 4 is foreseen, let's the field empty!"
                            @blur="handleBlur($event)" maxlength="20" v-model="parameter4" />
                        <label>Parameter 4</label>
                        <span>Parameter 4</span>
                    </div>

                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="defaultvalue4" class="input" @focus="handleFocus($event)"
                            title="empty or a default value or a list (example: 1:A, 2:B, 3:C) or <DATA>, <DICT>,<RULE>,<USER>"
                            @blur="handleBlur($event)" maxlength="400" v-model="defaultValue4" />
                        <label>Default Value 4</label>
                        <span>Default Value 4</span>
                    </div>

                    <!-- <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="natural4" class="input" @focus="handleFocus($event)"
                            title="Name of the attribute in the natural" @blur="handleBlur($event)" maxlength="40"
                            v-model="natural4" />
                        <label>Natural 4</label>
                        <span>Natural 4</span>
                    </div> -->

                    <div class="input-container focus">
                        <select id="natural4" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            @change="handleNatural4Change()" v-model="selectedNatural4">
                            <option v-for="natural in naturals4" :key="natural.naturalID"
                                v-bind:value="{ id: natural.naturalID }">
                                {{ natural.naturalID }}</option>
                        </select>
                        <label>Natural 4</label>
                        <span>Natural 4</span>
                    </div>                    

                    <div class="input-container focus">
                        <select id="active" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            @change="handleActiveChange()" v-model="selectedActive">
                            <option v-for="active in actives" :key="active.activeID"
                                v-bind:value="{ id: active.activeID }">
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
import updateFunction from '../../composables/function/updateFunction'
import getFunction from '../../composables/function/getFunction'

import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'FunctionEdit',
    props: ['trace', 'id', 'projectID', 'projectName', 'userID', 'userName', 'connected'],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('FunctionEdit.vue', trace.value)
        consoleLog('FunctionEdit.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }


        const testfunction = ref([])
        const functionID = ref(props.id)
        const projectName = ref(props.projectName)
        const projectID = ref(props.projectID)
        const userID = ref(props.userID)
        const functionName = ref('')
        const ruleFunction = ref('')
        const comment = ref('')
        const parameter1 = ref('')
        const defaultValue1 = ref('')
        //const natural1 = ref('')
        const tip1 = ref('')
        const parameter2 = ref('')
        const defaultValue2 = ref('')
        //const natural2 = ref('')
        const tip2 = ref('')
        const parameter3 = ref('')
        const defaultValue3 = ref('')
        //const natural3 = ref('')
        const tip3 = ref('')
        const parameter4 = ref('')
        const defaultValue4 = ref('')
        //const natural4 = ref('')
        const tip4 = ref('')

        const activeID = ref(1)
        const actives = ref([{ activeID: '1', active: 'Active' }, { activeID: '0', active: 'Not Active' }, { activeID: '2', active: 'Comment' }])
        const selectedActive = ref({ id: activeID.value })
        const naturals1 = ref([{ naturalID: 'value:text' }, { naturalID: 'value:number' }, { naturalID: 'expression:text' }, { naturalID: 'data:text' }, { naturalID: 'data:number' },
        { naturalID: 'variable:text' }, { naturalID: 'dictionary:text' }, {naturalID: 'position:number'}, {naturalID: 'wait:number'}, {naturalID: 'before:number'},
        { naturalID: 'codevalue:text'}, { naturalID: 'comment:text'}, {naturalID: 'reference:text'}, {naturalID: 'element:text'}])
        const natural1ID = ref('value:text')
        const selectedNatural1 = ref({ id: natural1ID.value })
        const naturals2 = ref([])
        naturals2.value = naturals1.value
        const natural2ID = ref('value:text')
        const selectedNatural2 = ref({ id: natural2ID.value })    
        const naturals3 = ref([])
        naturals3.value = naturals1.value
        const natural3ID = ref('value:text')
        const selectedNatural3 = ref({ id: natural3ID.value })  
        const naturals4 = ref([])
        naturals4.value = naturals1.value
        const natural4ID = ref('value:text')
        const selectedNatural4 = ref({ id: natural4ID.value })                      

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
            consoleLog('FunctionEdit.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }



        // --------------------------------------------------------------------------
        // Get the testfunction data
        // --------------------------------------------------------------------------
        const { error, loadFunction } = getFunction(functionID.value)
        loadFunction(testfunction, trace.value)
            .then(function () {
                consoleLog('FunctionEdit.vue/getFunction', 2, '------ Function: ' + functionID.value, trace.value)
                if (testfunction.value.success && testfunction.value.data.length) {
                    testfunction.value = testfunction.value.data
                    consoleLog('FunctionEdit.vue/getFunction', 2, testfunction, trace.value)
                    functionName.value = testfunction.value[0].functionName
                    ruleFunction.value = testfunction.value[0].rulefunction
                    parameter1.value = testfunction.value[0].parameter1
                    defaultValue1.value = testfunction.value[0].defaultValue1
                    //natural1.value = testfunction.value[0].natural1
                    natural1ID.value = testfunction.value[0].natural1
                    selectedNatural1.value = ({ id: natural1ID.value })              
                    tip1.value = testfunction.value[0].tip1
                    parameter2.value = testfunction.value[0].parameter2
                    defaultValue2.value = testfunction.value[0].defaultValue2
                    //natural2.value = testfunction.value[0].natural2
                    natural2ID.value = testfunction.value[0].natural2
                    selectedNatural2.value = ({ id: natural2ID.value })              
                    tip2.value = testfunction.value[0].tip2
                    parameter3.value = testfunction.value[0].parameter3
                    defaultValue3.value = testfunction.value[0].defaultValue3
                    //natural3.value = testfunction.value[0].natural3
                    natural3ID.value = testfunction.value[0].natural3
                    selectedNatural3.value = ({ id: natural3ID.value })              
                    tip3.value = testfunction.value[0].tip3
                    parameter4.value = testfunction.value[0].parameter4
                    defaultValue4.value = testfunction.value[0].defaultValue4
                    //natural4.value = testfunction.value[0].natural4
                    natural4ID.value = testfunction.value[0].natural4
                    selectedNatural4.value = ({ id: natural4ID.value })              
                    tip4.value = testfunction.value[0].tip4
                    comment.value = testfunction.value[0].comment
                    activeID.value = testfunction.value[0].active
                    selectedActive.value = ({ id: testfunction.value[0].active })
                    return (1)
                } else {
                    consoleLog('FunctionEdit.vue/getFunction', 2, 'No function found!', trace.value)
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
        // User selects another natural 1 value, store the current value
        // --------------------------------------------------------------------------
        const handleNatural1Change = () => {
            consoleLog('RuleEdit.vue/handleNatural1Change', 2, 'User changed the natural 1 value: ' + selectedNatural1.value.id, trace.value)
            natural1ID.value = selectedNatural1.value.id
        }

        // --------------------------------------------------------------------------
        // User selects another natural 2 value, store the current value
        // --------------------------------------------------------------------------
        const handleNatural2Change = () => {
            consoleLog('RuleEdit.vue/handleNatural2Change', 2, 'User changed the natural 2 value: ' + selectedNatural2.value.id, trace.value)
            natural2ID.value = selectedNatural2.value.id
        }

        // --------------------------------------------------------------------------
        // User selects another natural 3 value, store the current value
        // --------------------------------------------------------------------------
        const handleNatural3Change = () => {
            consoleLog('RuleEdit.vue/handleNatural3Change', 2, 'User changed the natural 3 value: ' + selectedNatural3.value.id, trace.value)
            natural3ID.value = selectedNatural3.value.id
        }

        // --------------------------------------------------------------------------
        // User selects another natural 4 value, store the current value
        // --------------------------------------------------------------------------
        const handleNatural4Change = () => {
            consoleLog('RuleEdit.vue/handleNatural4Change', 2, 'User changed the natural 4 value: ' + selectedNatural4.value.id, trace.value)
            natural4ID.value = selectedNatural4.value.id
        }


        // --------------------------------------------------------------------------
        // User cancel the action, leave the screen and returns to the list
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('FunctionEdit.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'Functions' })
        }

        // -----------------------------------------------------------------------------------
        // leave the screen and go to the References screen (used by the function DisplayError)
        // -----------------------------------------------------------------------------------
        const gotoFunctions = () => {
            router.push({ name: 'Functions' })
        }

        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = () => {
            consoleLog('FunctionEdit.vue/handleSubmit', 2, 'User Submit the action - functionID: ' + functionID.value, trace.value)
            // functionName, comment, tip1, parameter1, defaultValue1, tip2, parameter2, defaultValue2, tip3, parameter3, defaultValue3, active, functionID
            const { error, updateTheFunction } = updateFunction(functionName.value, ruleFunction.value, comment.value, tip1.value, parameter1.value, defaultValue1.value, selectedNatural1.value.id,
                tip2.value, parameter2.value, defaultValue2.value, selectedNatural2.value.id, tip3.value, parameter3.value, defaultValue3.value, selectedNatural3.value.id,
                tip4.value, parameter4.value, defaultValue4.value, selectedNatural4.value.id, selectedActive.value.id, functionID.value)
            updateTheFunction(testfunction, trace.value)
                .then(function () {
                    consoleLog('FunctionEdit.vue/handleSubmit', 2, '------ Update a function - functionID: ' + functionID.value, trace.value)
                    consoleLog('FunctionEdit.vue/handleSubmit', 2, testfunction.value, trace.value)
                    consoleLog('FunctionEdit.vue/handleSubmit', 2, 'Success: ' + testfunction.value.success, trace.value)
                    if (testfunction.value.success) {
                        consoleLog('FunctionEdit.vue/handleSubmit', 2, 'Message OK: ' + testfunction.value.message, trace.value)
                        DisplayError(testfunction.value.message, 'Info', gotoFunctions)
                    } else {
                        // Error during insert found!
                        consoleLog('FunctionEdit.vue/handleSubmit', 2, 'Message KO: ' + testfunction.value.message, trace.value)
                        DisplayError(testfunction.value.message, 'Alert')
                    }
                })
        }


        return {
            errorMessage, styleMessage, testfunction, projectName, projectID, userID, functionName, ruleFunction, comment,
            tip1, parameter1, defaultValue1, tip2, parameter2, defaultValue2, tip3, parameter3, defaultValue3, 
            naturals1, selectedNatural1, naturals2, selectedNatural2, naturals3, selectedNatural3, naturals4, selectedNatural4,
            tip4, parameter4, defaultValue4, actives, activeID, selectedActive,  
            handleCancel, handleSubmit, handleFocus, handleBlur, handleActiveChange, 
            handleNatural1Change, handleNatural2Change, handleNatural3Change, handleNatural4Change
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