<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">

            <div class="banner">
                <h3 class="title">{{ projectName }}<br>-- Rule --</h3>
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

                    <div class="input-container focus">
                        <input type="text" name="rule" class="input disabled" v-model="ruleName"
                            title="Name of the rule" disabled />
                        <label>Rule</label>
                        <span>Rule</span>
                    </div>

                    <div class="input-container focus" v-if="activeID != 2">
                        <select id="rulecontinue" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            v-model="selectedContinue" title="Yes or Skip ( if previous condition is true )">
                            <option v-for="ruleContinue in ruleContinues" :key="ruleContinue.continueID"
                                v-bind:value="{ id: ruleContinue.continueID }">
                                {{ ruleContinue.label }}</option>
                        </select>
                        <label>Continue</label>
                        <span>Continue</span>
                    </div>

                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="rulecondition" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" maxlength="80" v-model="ruleCondition" :title="titleCondition"
                            required />
                        <label>Condition</label>
                        <span>Condition</span>
                    </div>

                    <div class="input-container focus" v-if="activeID != 2">
                        <div class="actions3">
                            <input type="text" name="ruleresult" class="input" @focus="handleFocus($event)"
                                @blur="handleBlur($event)" maxlength="512" v-model="ruleResult" :title="titleResult" />
                            <label>Result</label>
                            <span>Result</span>
                            <i class="fa-regular fa-trash-can" @click="ruleResult = ''" title="Reset the result"></i>
                            <i class="fa-solid fa-spell-check" @click="handleDictionary(1)"
                                title="Go to Dictionary"></i>
                            <i class="fa-solid fa-database" @click="handleDataset(1)" title="Go to Dataset"></i>
                            <i class="fa-solid fa-gears" @click="handleRuleWizard()" title="Go to Functions"></i>
                        </div>
                    </div>


                    <div class="input-container focus" v-if="activeID != 2">
                        <input type="text" name="rulemessage" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" maxlength="80" v-model="ruleMessage"
                            title="optional: display a message in the logfile" />
                        <label>Message</label>
                        <span>Message</span>
                    </div>

                    <div class="actions3">
                        <div class="input-container textarea focus" style="width: 100%;">
                            <textarea name="comment" class="input" maxlength="80" v-model="comment"
                                @focus="handleFocus($event)" @blur="handleBlur($event)"
                                title="Comment for the documentation"></textarea>
                            <label>Comment</label>
                            <span>Comment</span>
                        </div>
                        <i class="fa-solid fa-lightbulb" @click="commentType = !commentType" v-if="commentType"
                            title="Comment for the Business" style="color: #c5b807;"></i>                        
                            <i class="fa-solid fa-gear" @click="commentType = !commentType" v-if="!commentType"
                            title="Comment for the Designer" style="color: blue;"></i>                            
                    </div>

                    <div class="input-container focus">
                        <select id="active" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            @change="handleActiveChange()" v-model="selectedActive" title="Status of the rule">
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
import updateRule from '../../composables/rule/updateRule'
import getRule from '../../composables/rule/getRule'

import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'RuleEdit',
    props: ['trace', 'id', 'projectID', 'projectName', 'userID', 'currentuser', 'userName', 'connected', 'location'],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('RuleEdit.vue', trace.value)
        consoleLog('RuleEdit.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }


        const projectName = ref(props.projectName)
        const projectID = ref(props.projectID)
        const userID = ref(props.userID)
        const userName = ref(props.currentuser)
        const rule = ref([])
        const ruleID = ref(props.id)
        const ruleheaderID = ref(0)
        const ruleName = ref('')
        const ruleCondition = ref('')
        const ruleResult = ref('')
        const ruleMessage = ref('')
        const comment = ref('')
        const location = ref(props.location)
        const rulePosition = ref(0)
        const commentType = ref(1)


        const activeID = ref(1)
        const actives = ref([{ activeID: '1', active: 'Active' }, { activeID: '0', active: 'Not Active' }, { activeID: '2', active: 'Comment' }])
        const selectedActive = ref({ id: activeID.value })

        const ruleContinue = ref(1)
        const ruleContinues = ref([{ continueID: '1', label: 'Yes' }, { continueID: '0', label: 'Skip' }])
        const selectedContinue = ref({ id: ruleContinue.value })
        const titleCondition = ref('A JavaScript expression that returns true or false\nNote:$P1, $P2 and $P3 are the parameters of the rule')
        const titleResult = ref('A JavaScript expression; you can reuse the variables of the scenarios\nor $P1, $P2 and $P3 as the parameters of the rule\nFor special function use the syntax: #function: param1, param2, param3')



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
            consoleLog('RuleEdit.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        // --------------------------------------------------------------------------
        // Get the rule data
        // --------------------------------------------------------------------------
        const { error, loadRule } = getRule(ruleID.value)
        loadRule(rule, trace.value)
            .then(function () {
                consoleLog('RuleEdit.vue/getRule', 2, '------ rule: ' + ruleID.value, trace.value)
                if (rule.value.success && rule.value.data.length) {
                    rule.value = rule.value.data
                    consoleLog('Rules.vue/loadRuleData', 2, rule, trace.value)
                    projectID.value = rule.value[0].projectID
                    ruleheaderID.value = rule.value[0].ruleheaderID
                    ruleName.value = rule.value[0].rule
                    ruleContinue.value = rule.value[0].ruleContinue
                    selectedContinue.value = ({ id: ruleContinue.value })
                    ruleCondition.value = rule.value[0].ruleCondition
                    ruleResult.value = rule.value[0].ruleResult
                    ruleMessage.value = rule.value[0].ruleMessage
                    comment.value = rule.value[0].comment
                    commentType.value = rule.value[0].commentType
                    activeID.value = rule.value[0].active
                    selectedActive.value = ({ id: activeID.value })
                    rulePosition.value = rule.value[0].position

                    if (location.value.includes('rulewizard=')) {
                        // split the location to find the keyword
                        // Syntax rulewizard=<rule expression>
                        let data = location.value.split("=");
                        consoleLog('RuleEdit.vue/getRule - rulewizard', 2, data, trace.value)

                        if (data[1] != undefined) {
                            ruleResult.value = data[1]
                        }
                    } else if (location.value.includes('dictionary=')) {
                        // split the location to find the keyword
                        // Syntax dictionary=<ruleID>=1=<Dictionary word>===
                        let data = location.value.split("=");
                        consoleLog('RuleEdit.vue/getRule - dictionary', 2, data, trace.value)
                        if (data[2] != undefined) {
                            if (ruleResult.value == undefined) ruleResult.value = ''
                            ruleResult.value = ruleResult.value + ' ' + data[2]
                        }
                    } else if (location.value.includes('dataset=')) {
                        // split the location to find the keyword
                        // Syntax dataset=<ruleID>=1=<Data word>===
                        let data = location.value.split("=");
                        consoleLog('RuleEdit.vue/getRule - dataset', 2, data, trace.value)
                        if (data[3] != undefined) {
                            if (ruleResult.value == undefined) ruleResult.value = ''
                            ruleResult.value = ruleResult.value + ' ' + data[3]
                        }
                    }



                    return (1)
                } else {
                    consoleLog('Rules.vue/loadRuleData', 2, 'No rule found!', trace.value)
                    DisplayError('Internal error: Cannot find the rule: ' + ruleID.value, 'Alert')
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
            consoleLog('RuleEdit.vue/handleCancel', 2, 'User Cancel the action - ruleheaderID: ' + ruleheaderID.value, trace.value)
            context.emit('storelocation', 'controlpanel=' + rulePosition.value)
            router.push({ name: 'Rules', params: { id: ruleheaderID.value } })
        }


        // --------------------------------------------------------------------------
        // User ask to go to the Dataset
        // --------------------------------------------------------------------------
        const handleDataset = async (position) => {
            consoleLog('RuleEdit.vue/handleDataset', 2, 'User ask to go to the Dataset', trace.value)
            let ret = await saveData()
            if (!ret) {
                // Error during insert found!
                consoleLog('RuleEdit.vue/handleDataset', 2, 'Message KO: ' + rule.value.message, trace.value)
                DisplayError(rule.value.message, 'Alert')
            } else {
                context.emit('storelocation', 'rule=' + ruleID.value + '=0=1====')
                router.push({ name: 'Dataset' })
            }
        }


        // --------------------------------------------------------------------------
        // User ask to go to the dictionary
        // --------------------------------------------------------------------------
        const handleDictionary = async (position) => {
            consoleLog('RuleEdit.vue/handleDictionary', 2, 'User ask to go to the Dictionary for rule: ' + ruleID.value, trace.value)
            let ret = await saveData()
            if (!ret) {
                // Error during insert found!
                consoleLog('RuleEdit.vue/handleDictionary', 2, 'Message KO: ' + rule.value.message, trace.value)
                DisplayError(rule.value.message, 'Alert')
            } else {
                context.emit('storelocation', 'rule=' + ruleID.value + '=0=1====')
                router.push({ name: 'Dictionary Set' })
            }
        }


        // --------------------------------------------------------------------------
        // User ask to go to the rules
        // --------------------------------------------------------------------------
        const handleRuleWizard = async (position) => {
            consoleLog('RuleEdit.vue/handleRuleWizard', 2, 'User ask to go to the Rule Wizard', trace.value)
            let ret = await saveData()
            if (!ret) {
                // Error during insert found!
                consoleLog('RuleEdit.vue/handleRuleWizard', 2, 'Message KO: ' + rule.value.message, trace.value)
                DisplayError(rule.value.message, 'Alert')
            } else {
                context.emit('storelocation', 'rule=' + ruleID.value)
                router.push({ name: 'RuleWizard' })
            }
        }

        // -----------------------------------------------------------------------------------
        // leave the screen and go to the Rules screen (used by the function DisplayError)
        // -----------------------------------------------------------------------------------
        const gotoRules = () => {
            consoleLog('RuleEdit.vue/gotoRules', 2, 'goto the rules screen - ruleheaderID: ' + ruleheaderID.value, trace.value)
            context.emit('storelocation', 'controlpanel')
            router.push({ name: 'Rules', params: { id: ruleheaderID.value } })
        }

        // --------------------------------------------------------------------------
        // User selects another active value, store the current ID
        // --------------------------------------------------------------------------
        const handleActiveChange = () => {
            consoleLog('RuleEdit.vue/handleActiveChange', 2, 'User changed the active value: ' + selectedActive.value.id, trace.value)
            activeID.value = selectedActive.value.id
        }

        // --------------------------------------------------------------------------
        // Save the data
        // --------------------------------------------------------------------------
        const saveData = async () => {
            consoleLog('RuleEdit.vue/saveData', 2, 'Save the data', trace.value)
            const { error, updateTheRule } = updateRule(selectedContinue.value.id, ruleCondition.value, ruleResult.value, ruleMessage.value, comment.value, commentType.value, selectedActive.value.id, ruleID.value)
            return await updateTheRule(rule, trace.value)
                .then(function () {
                    consoleLog('RuleEdit.vue/handleSubmit', 2, '------ Update a rule - ruleID: ' + ruleID.value, trace.value)
                    consoleLog('RuleEdit.vue/handleSubmit', 2, rule.value, trace.value)
                    consoleLog('RuleEdit.vue/handleSubmit', 2, 'Success: ' + rule.value.success, trace.value)
                    return rule.value.success
                })
        }



        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = async () => {
            consoleLog('RuleEdit.vue/handleSubmit', 2, 'User Submit the action', trace.value)
            context.emit('storelocation', 'controlpanel=' + rulePosition.value)
            let ret = await saveData()
            if (ret) {
                consoleLog('RuleEdit.vue/handleSubmit', 2, 'Message OK: ' + rule.value.message, trace.value)
                DisplayError(rule.value.message, 'Info', gotoRules)
            } else {
                // Error during insert found!
                consoleLog('RuleEdit.vue/handleSubmit', 2, 'Message KO: ' + rule.value.message, trace.value)
                DisplayError(rule.value.message, 'Alert')
            }

        }


        return {
            errorMessage, styleMessage, rule, projectName, projectID, userID, userName, commentType,
            ruleName, ruleCondition, ruleResult, ruleMessage, comment, titleCondition, titleResult,
            activeID, actives, selectedActive, ruleContinues, selectedContinue,
            handleCancel, handleSubmit, handleFocus, handleBlur, handleActiveChange,
            handleRuleWizard, handleDataset, handleDictionary
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