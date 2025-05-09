<template>

    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">
        <div class="form">

            <div class="banner">
                <h3 class="title">{{ projectName }}<br>-- Dictionary --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <div v-if="showPopup">
                    <PopupConfirm @close="handleCancelRename" @confirm="handleConfirmRename" />
                </div>

                <form @submit.prevent="handleConfirmation">

                    <div class="actions">
                        <div class="input-container focus">
                            <input type="text" name="createdby" class="input disabled info" v-model="createdBy"
                                disabled />
                            <label>Created By</label>
                            <span>Created By</span>
                        </div>
                        <div class="input-container focus">
                            <input type="text" name="updatedby" class="input disabled info" v-model="updatedBy"
                                disabled />
                            <label>Updated By</label>
                            <span>Updated By</span>
                        </div>
                    </div>

                    <div class="actions">
                        <h3 title="Example: @URL_$Environment cannot be detected by the tool">Please note, if you used
                            expressions to manage the dictionary, the renaming cannot take
                            place and will have to be done manually!</h3>
                    </div>


                    <div class="input-container textarea focus">
                        <textarea name="comment" class="input disabled" maxlength="80" v-model="comment"
                            @focus="handleFocus($event)" @blur="handleBlur($event)" disabled></textarea>
                        <label>Comment</label>
                        <span>Comment</span>
                    </div>


                    <div class="input-container focus">
                        <input type="text" name="subproject" class="input disabled" v-model="projectName" disabled />
                        <label>Project</label>
                        <span>Project</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="codeheader" class="input disabled" v-model="codeHeader" disabled
                            title="The full code is equal to the dictionary set code + this code" />
                        <label>Header Code</label>
                        <span>Header Code</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="code" class="input disabled" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" maxlength="40" v-model="code" disabled />
                        <label>Code</label>
                        <span>Code</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="newcode" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" maxlength="40" v-model="newCode"
                            title="New Code to be used in the Tests and the Rules" />
                        <label>Renamed Code</label>
                        <span>Renamed Code</span>
                    </div>

                    <div class="input-container focus">
                        <h3>Test(s) detected: {{ testNb }}</h3>
                        <h3>Rule(s) detected: {{ ruleNb }}</h3>
                    </div>

                    <div class="input-container">
                        <button>
                            <i class="fa-solid fa-circle-check"></i>
                            Rename</button>
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
import PopupConfirm from '../../components/PopupConfirm.vue'
import updateDictionary from '../../composables/dictionary/updateDictionary'
import getDictionary from '../../composables/dictionary/getDictionary'
import getTestsByDictionary from '../../composables/test/getTestsByDictionary'
import updateTestParameter from '../../composables/test/updateTestParameter'
import getRulesByDictionary from '../../composables/rule/getRulesByDictionary'
import updateRuleResult from '../../composables/rule/updateRuleResult'

import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'DictionaryRename',
    props: ['trace', 'id', 'projectID', 'projectName', 'subprojectID', 'subprojectName', 'userID', 'currentuser', 'connected'],
    components: { Spinner, PopupConfirm },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const showPopup = ref(false)

        displayMsg('DictionaryRename.vue', trace.value)
        consoleLog('DictionaryRename.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }


        const dictionary = ref([])
        const dictionaryID = ref(props.id)
        const dictionaryheaderID = ref(0)
        const projectName = ref(props.projectName)
        const projectID = ref(props.projectID)
        const subprojectName = ref(props.subprojectName)
        const subprojectID = ref(props.subprojectID)
        const userID = ref(props.userID)
        const comment = ref('')
        const code = ref('')
        const fullCodeOriginal = ref('')
        const fullCode = ref('')
        const newCode = ref('')
        const codeHeader = ref('')
        const language = ref('')
        const label = ref('')
        const createdBy = ref('')
        const updatedBy = ref('')

        const tests = ref([])
        const testID = ref(0)
        const testNb = ref(0)
        const parameter1 = ref('')
        const parameter2 = ref('')
        const parameter3 = ref('')
        const parameter4 = ref('')
        const rules = ref([])
        const ruleID = ref(0)
        const ruleNb = ref(0)
        const ruleResult = ref('')

        const active = ref(1)
        const actives = ref([{ activeID: '1', active: 'Active' }, { activeID: '0', active: 'Not Active' }, { activeID: '2', active: 'Comment' }])
        const selectedActive = ref({ id: active.value })

        const userName = ref(props.currentuser)
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
            consoleLog('DictionaryRename.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        // --------------------------------------------------------------------------
        // Get the dictionary data
        // --------------------------------------------------------------------------
        const loadDictionaryData = async () => {
            const { error, loadDictionary } = getDictionary(dictionaryID.value)
            await loadDictionary(dictionary, trace.value)
                .then(function () {
                    consoleLog('DictionaryRename.vue/getDictionary', 2, '------ dictionary: ' + dictionaryID.value, trace.value)
                    if (dictionary.value.success && dictionary.value.data.length) {
                        dictionary.value = dictionary.value.data
                        consoleLog('DictionaryRename.vue/loadDictionaryData', 2, dictionary, trace.value)
                        //projectID.value = dictionary.value.projectID
                        dictionaryheaderID.value = dictionary.value[0].dictionaryheaderID
                        code.value = dictionary.value[0].code
                        newCode.value = dictionary.value[0].code
                        codeHeader.value = dictionary.value[0].headercode
                        fullCode.value = codeHeader.value + code.value
                        fullCode.value = fullCode.value.trim()
                        language.value = dictionary.value[0].language
                        label.value = dictionary.value[0].label
                        comment.value = dictionary.value[0].comment
                        createdBy.value = dictionary.value[0].createdby + ' on: ' + dictionary.value[0].created
                        updatedBy.value = dictionary.value[0].updatedby + ' on: ' + dictionary.value[0].updated
                        selectedActive.value = ({ id: dictionary.value[0].active })
                        return (1)
                    } else {
                        consoleLog('DictionaryRename.vue/loadDictionaryData', 2, 'No dictionary found!', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Get the Tests data
        // --------------------------------------------------------------------------
        const loadTestData = async () => {
            const { error, loadTest } = getTestsByDictionary(subprojectID.value, fullCode.value)
            await loadTest(tests, trace.value)
                .then(function () {
                    consoleLog('DictionaryRename.vue/getTestsByDictionary', 2, '------ test: ' + subprojectID.value + ', code: ' + code.value, trace.value)
                    if (tests.value.success && tests.value.data.length) {
                        tests.value = tests.value.data
                        consoleLog('DictionaryRename.vue/getTestsByDictionary', 2, dictionary, trace.value)
                        //projectID.value = dictionary.value.projectID
                        testID.value = tests.value[0].testID
                        parameter1.value = tests.value[0].parameter1
                        parameter2.value = tests.value[0].parameter2
                        parameter3.value = tests.value[0].parameter3
                        parameter4.value = tests.value[0].parameter4
                        testNb.value = tests.value.length
                        return (1)
                    } else {
                        consoleLog('DictionaryRename.vue/getTestsByDictionary', 2, 'No test found!', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Get the Rules data
        // --------------------------------------------------------------------------
        const loadRuleData = async () => {
            const { error, loadRule } = getRulesByDictionary(projectID.value, fullCode.value)
            await loadRule(rules, trace.value)
                .then(function () {
                    consoleLog('DictionaryRename.vue/getRulesByDictionary', 2, '------ rules: ' + projectID.value + ', code: ' + code.value, trace.value)
                    if (rules.value.success && rules.value.data.length) {
                        rules.value = rules.value.data
                        consoleLog('DictionaryRename.vue/getRulesByDictionary', 2, rules.value, trace.value)
                        ruleID.value = rules.value[0].ruleID
                        ruleResult.value = rules.value[0].ruleResult
                        return (1)
                    } else {
                        consoleLog('DictionaryRename.vue/getRulesByDictionary', 2, 'No rule found!', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Compute the exact number of rules concerned
        // --------------------------------------------------------------------------
        const computeRuleData = async () => {
            ruleNb.value = 0
            //console.log ('Rules length: ', rules.value.length)
            for (let elt = 0; elt < rules.value.length; elt++) {
                //console.log ('Rule Id: ' + rules.value[elt].ruleID + ' Result: ' + rules.value[elt].ruleResult)
                // split the result to find the 
                let data = rules.value[elt].ruleResult.split(":");
                if (data.length == 2) {
                    let data2 = data[1].split(",");
                    for (let i = 0; i < data2.length; i++) {
                        //console.log ('Data: **', data2[i].trim(), '** versus **' + fullCode.value + '**')
                        if (data2[i].trim() == fullCode.value) ruleNb.value++
                    }
                }
            }
        }


        // --------------------------------------------------------------------------
        // Load all the Data
        // --------------------------------------------------------------------------
        const loadAllData = async () => {
            await loadDictionaryData()
            await loadTestData()
            await loadRuleData()
            await computeRuleData()
        }
        loadAllData()

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
        // User ask to rename the code
        // --------------------------------------------------------------------------
        const handleConfirmation = () => {
            consoleLog('DictionaryRename.vue/handleConfirmation', 2, 'Ask for a confirmation to rename', trace.value)
            showPopup.value = true
        }

        // --------------------------------------------------------------------------
        // User cancel the rename action
        // --------------------------------------------------------------------------
        const handleCancelRename = () => {
            consoleLog('DictionaryRename.vue/handleCancelRename', 2, 'Cancel the rename', trace.value)
            showPopup.value = false
        }

        // --------------------------------------------------------------------------
        // User confirm the rename action
        // --------------------------------------------------------------------------
        const handleConfirmRename = () => {
            consoleLog('DictionaryRename.vue/handleConfirmRename', 2, 'Confirm the rename', trace.value)
            showPopup.value = false
            handleSubmit()
        }

        // --------------------------------------------------------------------------
        // User cancel the action, leave the screen and returns to the list
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('DictionaryRename.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'Dictionary', params: { id: dictionaryheaderID.value } })
        }

        // -----------------------------------------------------------------------------------
        // leave the screen and go to the Dictionary screen (used by the function DisplayError)
        // -----------------------------------------------------------------------------------
        const gotoDictionary = () => {
            router.push({ name: 'Dictionary', params: { id: dictionaryheaderID.value } })
        }

        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = () => {
            consoleLog('DictionaryRename.vue/handleSubmit', 2, 'User Submit the action - projectID: ' + projectID.value, trace.value)
            let newFullCode = codeHeader.value + newCode.value

            // ----------------------------------------
            // Rename the dictionary code in the Tests
            // ----------------------------------------
            // Get the tests with a code used in parameter1, 2, 3 or 4
            if (testNb.value) {
                const test = ref([])
                for (let elt = 0; elt < tests.value.length; elt++) {
                    testID.value = tests.value[elt].testID
                    parameter1.value = tests.value[elt].parameter1.replace(fullCode.value, newFullCode)
                    parameter2.value = tests.value[elt].parameter2.replace(fullCode.value, newFullCode)
                    parameter3.value = tests.value[elt].parameter3.replace(fullCode.value, newFullCode)
                    parameter4.value = tests.value[elt].parameter4.replace(fullCode.value, newFullCode)
                    console.log('testID: ' + testID.value + ', parameter1: ' + parameter1.value + ', parameter2: ' + parameter2.value + ', parameter3: ' + parameter3.value + ', parameter4: ' + parameter4.value)
                    const { error, updateTheParameter } = updateTestParameter(testID.value, parameter1.value, parameter2.value, parameter3.value, parameter4.value)
                    updateTheParameter(test, trace.value)
                        .then(function () {
                            consoleLog('DictionaryRename.vue/updateTestParameter', 2, test.value, trace.value)
                            consoleLog('DictionaryRename.vue/updateTestParameter', 2, 'Success: ' + test.value.success, trace.value)
                            if (test.value.success) {
                                consoleLog('DictionaryRename.vue/updateTestParameter', 2, 'Message OK: ' + test.value.message, trace.value)
                            } else {
                                // Error during insert found!
                                consoleLog('DictionaryRename.vue/updateTestParameter', 2, 'Message KO: ' + test.value.message, trace.value)
                                DisplayError(test.value.message, 'Alert')
                            }
                        })
                }
            }

            // ----------------------------------------
            // Rename the dictionary code in the Rules
            // ----------------------------------------
            // Get the rules with a code used in ruleResult
            if (ruleNb.value) {
                const rule = ref([])
                for (let elt = 0; elt < rules.value.length; elt++) {
                    // Update all the code in the ruleResult
                    ruleID.value = rules.value[elt].ruleID
                    ruleResult.value = rules.value[elt].ruleResult.replace(fullCode.value, newFullCode)
                    console.log('ruleResult - ruleID: ' + ruleID.value + ', ruleResult: ' + ruleResult.value)

                    const { error, updateTheResult } = updateRuleResult(ruleID.value, ruleResult.value)
                    updateTheResult(rule, trace.value)
                        .then(function () {
                            consoleLog('DictionaryRename.vue/updateRuleResult', 2, rule.value, trace.value)
                            consoleLog('DictionaryRename.vue/updateRuleResult', 2, 'Success: ' + rule.value.success, trace.value)
                            if (rule.value.success) {
                                consoleLog('DictionaryRename.vue/updateRuleResult', 2, 'Message OK: ' + rule.value.message, trace.value)
                            } else {
                                // Error during insert found!
                                consoleLog('DictionaryRename.vue/updateRuleResult', 2, 'Message KO: ' + rule.value.message, trace.value)
                                DisplayError(rule.value.message, 'Alert')
                            }

                        })
                }
            }

            // ----------------------------------------
            // Rename the dictionary code in the Dictionary
            // ----------------------------------------
            code, label, comment, language, active, projectID, dictionaryID
            const { error, updateTheDictionary } = updateDictionary(newCode.value, label.value, comment.value, language.value, selectedActive.value.id, projectID.value, dictionaryID.value, userName.value, today)
            updateTheDictionary(dictionary, trace.value)
                .then(function () {
                    consoleLog('DictionaryRename.vue/updateDictionary', 2, '------ Update a dictionary - projectID: ' + projectID.value + ', dictionaryID: ' + dictionaryID.value + ', code: ' + code.value, trace.value)
                    consoleLog('DictionaryRename.vue/updateDictionary', 2, dictionary.value, trace.value)
                    consoleLog('DictionaryRename.vue/updateDictionary', 2, 'Success: ' + dictionary.value.success, trace.value)
                    if (dictionary.value.success) {
                        consoleLog('DictionaryRename.vue/updateDictionary', 2, 'Message OK: ' + dictionary.value.message, trace.value)
                        DisplayError(dictionary.value.message, 'Info', gotoDictionary)
                    } else {
                        // Error during insert found!
                        consoleLog('DictionaryRename.vue/updateDictionary', 2, 'Message KO: ' + dictionary.value.message, trace.value)
                        DisplayError(dictionary.value.message, 'Alert')
                    }
                })
        }


        return {
            errorMessage, styleMessage, dictionary, projectName, projectID, subprojectName, subprojectID, userID, testNb, ruleNb, showPopup,
            code, newCode, codeHeader, label, language, comment, actives, selectedActive, createdBy, updatedBy,
            handleCancel, handleFocus, handleBlur, handleConfirmation, handleCancelRename, handleConfirmRename
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

.actions h3 {
    color: blue
}
</style>