<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">
        <div class="form">
            <div class="banner">
                <h3 class="title">-- Import --</h3>
                <img src="../../assets/RobotV2.png" alt="robot" />
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage">
                        {{ errorMessage }}
                    </p>
                </Transition>
            </div>

            <div class="entity">
                <form @submit.prevent="handleSubmit">


                    <div class="input-container focus">
                        <select id="project" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            @change="handleProjectChange()" v-model="selectedProject"
                            title="Select a project for the import">
                            <option v-for="project in projects" :key="project.projectID"
                                v-bind:value="{ id: project.projectID }">
                                {{ project.project }}
                            </option>
                        </select>
                        <label>Project</label>
                        <span>Project</span>
                    </div>

                    <div class="input-container focus">
                        <select id="rule" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            @change="handleRuleChange()" v-model="selectedRule" title="Select a rule for the import">
                            <option v-for="rule in rules" :key="rule.ruleID"
                                v-bind:value="{ id: rule.ruleheaderID, name: rule.rule }">
                                {{ rule.rule }}
                            </option>
                        </select>
                        <label>Rule</label>
                        <span>Rule</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="label" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" maxlength="40" v-model="ruleName" title="Rename the rule" />
                        <label>Rename to</label>
                        <span>Rename to</span>
                    </div>


                    <div class="input-container">
                        <button>
                            <i class="fa-solid fa-circle-check"></i>
                            Import
                        </button>
                        <button @click="handleCancel" class="cancel">
                            <i class="fa-solid fa-ban"></i>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>


import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import Spinner from "../../components/Spinner.vue";
import getAllProjectsByWorkspace from '../../composables/project/getAllProjectsByWorkspace'
import getRulesByProject from '../../composables/rule/getRulesByProject'
import getRulesByCode from '../../composables/rule/getRulesByCode'
import importRuleheader from '../../composables/ruleheader/importRuleheader'
import reorderRuleheaders from '../../composables/ruleheader/reorderRuleheaders'
import importRule from '../../composables/rule/importRule'

import { displayMsg, consoleLog } from "../../util/debug";


export default {
    name: "ImportRule",
    props: ["trace", "projectID", "projectName", "userID", "currentuser", "userName", "workspaceID", "connected"],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter();
        const trace = ref(props.trace);

        displayMsg("ImportRuleheaderImport.vue", trace.value);
        consoleLog("ImportRuleheaderImport.vue - props", 1, props, trace.value);

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }

        const userID = ref(props.userID);
        const userName = ref(props.currentuser);
        const workspaceID = ref(props.workspaceID)
        const currentProjectID = ref(props.projectID);

        const projects = ref([]);
        const projectID = ref(0);
        const selectedProject = ref({ id: projectID.value });

        const rules = ref([])
        const ruleID = ref(0);
        const selectedRule = ref({ id: ruleID.value });
        const ruleName = ref("");


        // -------------------------------------------
        // Management of the errors
        // -------------------------------------------
        const errorMessage = ref("");
        const styleMessage = ref("");

        // --------------------------------------------------------------------------
        // Execute a function from an error message
        // --------------------------------------------------------------------------
        const displayErrorFunction = (myCallback) => {
            errorMessage.value = "";
            if (myCallback != null && myCallback != undefined) {
                // call the function
                myCallback();
            }
        };

        // --------------------------------------------------------------------------
        // Display error message on the screen and trigger a function after a delay
        // --------------------------------------------------------------------------
        const DisplayError = (myMessage, myStyle, myCallback) => {
            errorMessage.value = myMessage;
            styleMessage.value = myStyle.toLowerCase();
            consoleLog("ImportRuleheaderImport.vue/DisplayError", 2, "Message: " + errorMessage.value + ", Style: " + styleMessage.value, trace.value);
            if (myStyle != "Alert") {
                setTimeout(() => displayErrorFunction(myCallback), 3000);
            }
        };

        // --------------------------------------------------------------------------
        // User sets the focus on a field
        // --------------------------------------------------------------------------
        const handleFocus = (event) => {
            event.target.parentElement.classList.add("focus");
        }

        // --------------------------------------------------------------------------
        // User leaves a field
        // --------------------------------------------------------------------------
        const handleBlur = (event) => {
            if (event.target.value == "") {
                event.target.parentElement.classList.remove("focus");
            }
        }

        // --------------------------------------------------------------------------
        // Load the projects
        // --------------------------------------------------------------------------
        const loadProjectData = async () => {
            const { error, loadProjects } = getAllProjectsByWorkspace(workspaceID.value)
            await loadProjects(projects, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('RuleheaderImport.vue/loadProjectData', 2, 'Projects status: ' + projects.value.success, trace.value)
                    if (projects.value.success && projects.value.data.length) {
                        projects.value = projects.value.data
                        consoleLog('RuleheaderImport.vue/loadProjectData', 2, projects.value, trace.value)
                        // filter the project to remove the current project
                        projects.value = projects.value.filter((ar) => ar.projectID != currentProjectID.value)
                        projectID.value = projects.value[0].projectID
                        selectedProject.value = ({ id: projectID.value })
                        return (1)
                    } else {
                        consoleLog('RuleheaderImport.vue/loadProjectData', 2, 'No project found!', trace.value)
                        DisplayError('No project found!', 'Alert')
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Load the rules
        // --------------------------------------------------------------------------
        const loadRuleData = async () => {
            rules.value = [{}]
            const { error, loadRule } = getRulesByProject(projectID.value)
            await loadRule(rules, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('RuleheaderImport.vue/loadRuleData', 2, 'Rules status: ' + rules.value.success, trace.value)
                    if (rules.value.success && rules.value.data.length) {
                        rules.value = rules.value.data
                        ruleID.value = rules.value[0].ruleheaderID
                        selectedRule.value = ({ id: ruleID.value, name: rules.value[0].rule })
                        ruleName.value = rules.value[0].rule
                        consoleLog('RuleheaderImport.vue/loadRuleData', 2, rules.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('RuleheaderImport.vue/loadRuleData', 2, 'No rule found!', trace.value)
                        DisplayError('No rule found!', 'Warning')
                        return (0)
                    }
                })

        }


        // --------------------------------------------------------------------------
        // Load the rules
        // --------------------------------------------------------------------------
        const checkRuleExist = async () => {
            let rule = [{}]
            const { error, loadRule } = getRulesByCode(currentProjectID.value, ruleName.value)
            return await loadRule(rule, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('RuleheaderImport.vue/checkRuleExist', 2, 'Rule status: ' + rule.value.success, trace.value)
                    if (rule.value.success && rule.value.data.length) {
                        consoleLog('RuleheaderImport.vue/loadRuleData', 2, 'Rule found!', trace.value)
                        return (1)
                    } else {
                        consoleLog('RuleheaderImport.vue/loadRuleData', 2, 'No rule found!', trace.value)
                        return (0)
                    }
                })
        }

        const loadAllData = async () => {
            await loadProjectData()
            await loadRuleData()
        }
        loadAllData()


        // --------------------------------------------------------------------------
        // User selects another project
        // --------------------------------------------------------------------------
        const handleProjectChange = async () => {
            consoleLog("ImportRuleheaderImport.vue/handleProjectChange", 2, 'reload the rule', trace.value);
            projectID.value = selectedProject.value.id
            await loadRuleData()
        }

        // --------------------------------------------------------------------------
        // User selects another rule
        // --------------------------------------------------------------------------
        const handleRuleChange = async () => {
            consoleLog("ImportRuleheaderImport.vue/handleRuleChange", 2, 'refresh the rule name: ' + selectedRule.value.name, trace.value);
            ruleName.value = selectedRule.value.name
        }


        // --------------------------------------------------------------------------
        // User cancels the action, leave the screen and returns to the list
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog("ImportRuleheaderImport.vue/handleCancel", 2, "User Cancel the action", trace.value);
            router.push({ name: "Rules Set" });
        };

        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = async () => {
            // Check if the rule is not already in the current project
            let ret = await checkRuleExist()
            if (ret) {
                DisplayError('A rule with that name already exists in your project', 'Alert')
            } else {
                DisplayError('Import in progress', 'Info')
                // Import the rule header from the other project
                let rule = ref([])
                let currentRuleheaderID = 0
                // ruleID contains the ruleheaderID
                let ruleheaderID =  selectedRule.value.id //ruleID.value
                const { error, importTheRule } = importRuleheader(ruleName.value, currentProjectID.value, projectID.value, ruleheaderID)
                await importTheRule(rule, trace.value)
                    .then(function () {
                        // check the status of the load
                        consoleLog('RuleheaderImport.vue/importRuleheader', 2, 'Rule status: ' + rule.value.success, trace.value)
                        if (rule.value.success) {
                            currentRuleheaderID = rule.value.id
                            consoleLog('RuleheaderImport.vue/importRuleheader', 2, 'Rule header imported! - new ruleheader: ' + currentRuleheaderID, trace.value)
                            return (1)
                        } else {
                            consoleLog('RuleheaderImport.vue/importRuleheader', 2, 'Error in the rule set import', trace.value)
                            DisplayError('Error during the import of the Rule set', 'Warning')
                            return (0)
                        }
                    }).then(function (res) {
                        if (res) {
                            // import the rules from the other project
                            const { error, importTheRule } = importRule(currentProjectID.value, currentRuleheaderID, projectID.value, ruleheaderID)
                            importTheRule(rule, trace.value)
                                .then(function () {
                                    // check the status of the load
                                    consoleLog('RuleheaderImport.vue/importRule', 2, 'Rule status: ' + rule.value.success, trace.value)
                                    if (rule.value.success) {
                                        consoleLog('RuleheaderImport.vue/importRule', 2, 'Rules imported!', trace.value)
                                        DisplayError('Rules imported', 'Info')
                                        return (1)
                                    } else {
                                        consoleLog('RuleheaderImport.vue/importRule', 2, 'Error in the rules import', trace.value)
                                        DisplayError('Error during the import of the Rules', 'Warning')
                                        return (0)
                                    }
                                })
                        }
                    }).then(function (res) {
                        // Reorder the rule header
                        let rule = ref([])
                        const { error, reorderTheRuleheaders } = reorderRuleheaders(currentProjectID.value)
                        reorderTheRuleheaders(rule, trace.value)
                    })
            }
        };

        return {
            errorMessage, styleMessage, projects, selectedProject, rules, selectedRule, ruleName,
            handleCancel, handleSubmit, handleFocus, handleBlur, handleProjectChange, handleRuleChange
        };
    },
};
</script>

<style scoped>
.custom-font {
    font-family: "Quicksand", sans-serif;
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
    font-family: "Quicksand", sans-serif;
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
    animation: rotatehead 1s linear;
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