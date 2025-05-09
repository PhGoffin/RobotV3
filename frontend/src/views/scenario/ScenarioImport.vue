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
                        <select id="subproject" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            @change="handleSubprojectChange()" v-model="selectedSubproject"
                            title="Select a subproject for the import">
                            <option v-for="subproject in subprojects" :key="subproject.subprojectID"
                                v-bind:value="{ id: subproject.subprojectID }">
                                {{ subproject.subproject }}
                            </option>
                        </select>
                        <label>Subproject</label>
                        <span>Subproject</span>
                    </div>


                    <div class="input-container focus">
                        <select id="scenario" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            @change="handleScenarioChange()" v-model="selectedScenario"
                            title="Select a scenario for the import">
                            <option v-for="scenario in scenarios" :key="scenario.scenarioID"
                                v-bind:value="{ id: scenario.scenarioID, name: scenario.scenario }">
                                {{ scenario.scenario }}
                            </option>
                        </select>
                        <label>Scenario</label>
                        <span>Scenario</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="label" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" maxlength="40" v-model="scenarioName" title="Rename the scenario" />
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
import getAllSubprojects from '../../composables/subproject/getAllSubprojects'
import getAllScenariosBySubproject from '../../composables/scenario/getAllScenariosBySubproject'
import getScenarioByCode from '../../composables/scenario/getScenarioByCode'
import importScenario from '../../composables/scenario/importScenario'
import reorderScenarios from '../../composables/scenario/reorderScenarios'
import copyAllTests from '../../composables/test/copyAllTests'


import { displayMsg, consoleLog } from "../../util/debug";


export default {
    name: "ImportScenario",
    props: ["trace", "projectID", "projectName", "subprojectID", "userID", "currentuser", "userName", "workspaceID", "connected"],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter();
        const trace = ref(props.trace);

        displayMsg("ScenarioImport.vue", trace.value);
        consoleLog("ScenarioImport.vue - props", 1, props, trace.value);

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
        const currentSubprojectID = ref(props.subprojectID);

        const projects = ref([]);
        const projectID = ref(0);
        const selectedProject = ref({ id: projectID.value });

        const subprojects = ref([])
        const subprojectID = ref(0);
        const selectedSubproject = ref({ id: subprojectID.value });

        const scenarios = ref([])
        const scenarioID = ref(0);
        const selectedScenario = ref({ id: scenarioID.value });
        const scenarioName = ref("");


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
            consoleLog("ScenarioImport.vue/DisplayError", 2, "Message: " + errorMessage.value + ", Style: " + styleMessage.value, trace.value);
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
            return await loadProjects(projects, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('ScenarioImport.vue/loadProjectData', 2, 'Projects status: ' + projects.value.success, trace.value)
                    if (projects.value.success && projects.value.data.length) {
                        projects.value = projects.value.data
                        consoleLog('ScenarioImport.vue/loadProjectData', 2, projects.value, trace.value)
                        projectID.value = projects.value[0].projectID
                        selectedProject.value = ({ id: projectID.value })
                        return (1)
                    } else {
                        consoleLog('ScenarioImport.vue/loadProjectData', 2, 'No project found!', trace.value)
                        DisplayError('No project found!', 'Alert')
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Load the subprojects
        // --------------------------------------------------------------------------
        const loadSubrojectData = async () => {
            const { error, loadSubprojects } = getAllSubprojects(projectID.value)
            return await loadSubprojects(subprojects, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('ScenarioImport.vue/loadSubrojectData', 2, 'Subprojects status: ' + subprojects.value.success, trace.value)
                    if (subprojects.value.success && subprojects.value.data.length) {
                        subprojects.value = subprojects.value.data
                        consoleLog('ScenarioImport.vue/loadSubrojectData', 2, subprojects.value, trace.value)
                        subprojectID.value = subprojects.value[0].subprojectID
                        selectedSubproject.value = ({ id: subprojectID.value })
                        return (1)
                    } else {
                        consoleLog('ScenarioImport.vue/loadSubrojectData', 2, 'No subproject found!', trace.value)
                        DisplayError('No subproject found!', 'Alert')
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Load the scenarios
        // --------------------------------------------------------------------------
        const loadScenarioData = async () => {
            const { error, loadScenarios } = getAllScenariosBySubproject(subprojectID.value)
            return await loadScenarios(scenarios, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('ScenarioImport.vue/loadScenarioData', 2, 'Subprojects status: ' + scenarios.value.success, trace.value)
                    if (scenarios.value.success && scenarios.value.data.length) {
                        scenarios.value = scenarios.value.data
                        consoleLog('ScenarioImport.vue/loadScenarioData', 2, scenarios.value, trace.value)
                        scenarioName.value = scenarios.value[0].scenario
                        scenarioID.value = scenarios.value[0].scenarioID
                        selectedScenario.value = ({ id: scenarioID.value, name: scenarioName.value })
                        return (1)
                    } else {
                        consoleLog('ScenarioImport.vue/loadScenarioData', 2, 'No Scenario found!', trace.value)
                        DisplayError('No scenario found!', 'Alert')
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Check if scenario exists
        // --------------------------------------------------------------------------
        const checkScenarioExist = async () => {
            let scenario = [{}]
            const { error, getScenario } = getScenarioByCode(currentSubprojectID.value, scenarioName.value)
            return await getScenario(scenario, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('ScenarioImport.vue/checkScenarioExist', 2, 'Scenario status: ' + scenario.value.success, trace.value)
                    if (scenario.value.success && scenario.value.data.length) {
                        consoleLog('ScenarioImport.vue/getScenario', 2, 'Scenario found!', trace.value)
                        return (1)
                    } else {
                        consoleLog('ScenarioImport.vue/getScenario', 2, 'No Scenario found!', trace.value)
                        return (0)
                    }
                })
        }


        const loadAllData = async () => {
            let ret = await loadProjectData()
            if (ret) ret = await loadSubrojectData()
            if (ret) ret = await loadScenarioData()
        }
        loadAllData()


        // --------------------------------------------------------------------------
        // User selects another project
        // --------------------------------------------------------------------------
        const handleProjectChange = async () => {
            consoleLog("ScenarioImport.vue/handleProjectChange", 2, 'reload the rule', trace.value);
            projectID.value = selectedProject.value.id
            let ret = await loadSubrojectData()
            if (ret) ret = await loadScenarioData()
        }

        // --------------------------------------------------------------------------
        // User selects another subproject
        // --------------------------------------------------------------------------
        const handleSubprojectChange = async () => {
            consoleLog("ScenarioImport.vue/handleSubprojectChange", 2, ' select another subproject ', trace.value);
            subprojectID.value = selectedSubproject.value.id
            await loadScenarioData()
        }

        // --------------------------------------------------------------------------
        // User selects another scenario
        // --------------------------------------------------------------------------
        const handleScenarioChange = async () => {
            consoleLog("ScenarioImport.vue/handleScenarioChange", 2, ' select another scenario ', trace.value);
            scenarioName.value = selectedScenario.value.name
            scenarioID.value = selectedScenario.value.id
        }


        // --------------------------------------------------------------------------
        // User cancels the action, leave the screen and returns to the list
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog("ScenarioImport.vue/handleCancel", 2, "User Cancel the action", trace.value);
            router.push({ name: "Scenarios" });
        };

        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = async () => {
            // Check if the scenario is not already in the current subproject
            let ret = await checkScenarioExist()
            if (ret) {
                DisplayError('A scenario with that name already exists in your subproject', 'Alert')
            } else {
                DisplayError('Import in progress', 'Info')
                // Import the scenario
                let scenario = ref([])
                let currentScenarioID = 0
                const { error, importTheScenario } = importScenario(currentSubprojectID.value, scenarioName.value, scenarioID.value)
                await importTheScenario(scenario, trace.value)
                    .then(function () {
                        // check the status of the load
                        consoleLog('ScenarioImport.vue/importTheScenario', 2, 'Scenario status: ' + scenario.value.success, trace.value)
                        if (scenario.value.success) {
                            currentScenarioID = scenario.value.id
                            consoleLog('ScenarioImport.vue/importTheScenario', 2, 'Scenario imported! - new scenarioID: ' + currentScenarioID, trace.value)
                            return (1)
                        } else {
                            consoleLog('ScenarioImport.vue/importTheScenario', 2, 'Error during the import of the Scenario', trace.value)
                            DisplayError('Error during the import of the Scenario', 'Warning')
                            return (0)
                        }
                    }).then(function (res) {
                        if (res) {
                            // import the Tests 
                            let test = ref([])
                            const { error, copyTheTest } = copyAllTests(currentScenarioID, scenarioID.value)
                            copyTheTest(test, trace.value)
                                .then(function () {
                                    // check the status of the load
                                    consoleLog('ScenarioImport.vue/copyTheTest', 2, 'Test status: ' + test.value.success, trace.value)
                                    if (test.value.success) {
                                        consoleLog('ScenarioImport.vue/copyTheTest', 2, 'Tests imported!', trace.value)
                                        DisplayError('Tests imported', 'Info')
                                        return (1)
                                    } else {
                                        consoleLog('ScenarioImport.vue/copyTheTest', 2, 'Error during the import of the Tests', trace.value)
                                        DisplayError('Error during the import of the Tests', 'Warning')
                                        return (0)
                                    }
                                })
                        }
                    }).then(function (res) {
                        // Reorder the scenario
                        let scenario = ref([])
                        const { error, reorderTheScenarios } = reorderScenarios(currentSubprojectID.value)
                        reorderTheScenarios(scenario, trace.value)
                    })
            }
        };

        return {
            errorMessage, styleMessage, projects, selectedProject, subprojects, selectedSubproject, scenarios, selectedScenario, scenarioName,
            handleCancel, handleSubmit, handleFocus, handleBlur, handleProjectChange, handleSubprojectChange, handleScenarioChange
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