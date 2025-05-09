<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ projectName }}<br>-- Performance --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">


                <button @click="handleExportJSON" class="action" title="Export current performance into a .json file"
                    v-if="actionAllowed">
                    <i class="fa-solid fa-file-code"></i>
                    JSON Export</button>
                <a :href="URL + jsonFile" :key="jsonFile" v-if="viewLink">{{ jsonFile }}</a>


                <form @submit.prevent="">

                    <table>
                        <tr>
                            <td class="menu">
                                <div class="actions3">
                                    <div class="input-container focus" style="min-width: 30rem; max-width: 30rem">
                                        <input type="text" name="dataFilter" class="input" @focus="handleFocus($event)"
                                            title="You can filter by the Environment, Scenario or by Topic"
                                            @blur="handleBlur($event)" v-model="filterValue" />
                                        <label>Filter {{ filteredRows }}</label>
                                        <span>Filter {{ filteredRows }}</span>
                                    </div>
                                    <i class="fa-regular fa-trash-can" @click="filterValue = ''"
                                        title="Reset the filter"></i>
                                </div>
                            </td>
                        </tr>

                    </table>
                </form>


                <div class="entities" height="150px">
                    <div v-if="error"> {{ error }}</div>
                    <div v-if="filteredData.length" class="layout">
                        <PerformancesList class="performancesList" :performances="filteredData"
                            :workspaceID="workspaceID" :workspace="workspace" :superUser="superUser"
                            :projectID="projectID" :performanceID="performanceID" :userID="userID" :trace="trace"
                            :location="location"
                            @storelocation="storeLocation" />
                    </div>
                </div>
                <div class="input-group">
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
import PerformancesList from '../../components/performance/PerformancesList.vue'
import getPerformanceByProject from '../../composables/performance/getPerformanceByProject'
import exportPerformance from '../../composables/performance/exportPerformance'


import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Performance',
    props: ['id', 'trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'subprojectID', 'subprojectName', 'location'],
    components: { PerformancesList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const actionAllowed = ref(true)

        displayMsg('Performances.vue', trace.value)
        consoleLog('Performances.vue - props', 1, props, trace.value)

        const workspaceID = ref(props.workspaceID)
        const workspace = ref(props.workspace)
        const projectID = ref(props.projectID)
        const projectName = ref(props.projectName)
        const subprojectID = ref(props.subprojectID)
        const subprojectName = ref(props.subprojectName)
        const userID = ref(props.userID)
        const superUser = ref(props.superUser)
        const performances = ref([])
        const backToDataHeaderID = ref(0)

        const displayInfo = ref('')
        const location = ref(props.location)
        const filterValue = ref('')
        const loadBySubproject = ref(false)

        const userName = ref(props.currentuser)
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
        const year = currentDate.getFullYear();
        let today = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year

        const URL = ref(process.env.VUE_APP_MYSQL_API + 'performance/download/')
        const jsonFile = ref(userName.value + '_performance.json')
        const viewLink = ref(false)


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
            consoleLog('Performances.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        // -------------------------------------------
        // load all the performances of the project 
        // -------------------------------------------
        const loadPerformanceData = async () => {
            consoleLog('Performances.vue/loadPerformanceData', 2, 'Loading performance by subproject: ' + projectID.value, trace.value)
            const { error, loadPerformance } = getPerformanceByProject(projectID.value)
            loadPerformance(performances, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Performances.vue/loadPerformanceData', 2, 'Performance Load by subproject status: ' + performances.value.success, trace.value)
                    if (performances.value.success && performances.value.data.length) {
                        performances.value = performances.value.data
                        filteredData.value = performances.value
                        consoleLog('Performances.vue/loadPerformanceData', 2, performances.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('Performances.vue/loadPerformanceData', 2, 'No performance found!', trace.value)
                        return (0)
                    }
                })
        }


        // Load projects data
        loadPerformanceData()


        // ---------------------------------------------
        // Compute the performances depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('Performances.vue/filteredData', 2, 'computed value', trace.value)
            if (performances.value.length) {
                return performances.value.filter((ar) => ar.space.toUpperCase().includes(filterValue.value.toUpperCase())
                    || ar.scenario.toUpperCase().includes(filterValue.value.toUpperCase()) || ar.topic.toUpperCase().includes(filterValue.value.toUpperCase()))
            } else {
                filteredRows.value = ''
                return performances.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })


        // --------------------------------------------------------------------------
        // PerformancesList emits a request to update the location
        // --------------------------------------------------------------------------
        const storeLocation = (location) => {
            consoleLog('Performances.vue/storeLocation', 2, 'Emit a request to the parent to update the location', trace.value)
            context.emit('storelocation', location)
        }


        // --------------------------------------------------------------------------
        // Call the API to export the performance into a json file 
        // --------------------------------------------------------------------------
        const doExportJSON = async () => {
            let performance = []
            let filename = './data/' + jsonFile.value

            consoleLog('Performances.vue/doExport', 2, 'Export performance in ' + filename, trace.value)
            const { error, exportThePerformance } = exportPerformance(projectID.value, filename)
            return await exportThePerformance(performance, trace.value)
                .then(function () {
                    // check the status of the export
                    consoleLog('Performances.vue/doExport', 2, 'Performance export status: ' + performance.value.success, trace.value)
                    if (performance.value.success) {
                        consoleLog('Performances.vue/doExport', 2, performance, trace.value)
                        return (1)
                    } else {
                        consoleLog('Performances.vue/doExport', 2, 'Error during the export of the performances', trace.value)
                        return (0)
                    }
                })
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
        // User asks to Export performance into a json file
        // --------------------------------------------------------------------------
        const handleExportJSON = async (event) => {
            let ret = await doExportJSON()
            if (ret) viewLink.value = true
        }


        // --------------------------------------------------------------------------
        // User cancel the action, Back to the control panel or the dashboard
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('Performances.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'ControlPanel' })
        }

        return {
            errorMessage, styleMessage, performances, filteredData, filterValue, filteredRows, workspaceID, workspace, actionAllowed,
            superUser, projectID, projectName, subprojectName, userID, displayInfo, trace, URL, jsonFile, viewLink,
            handleCancel, handleFocus, handleBlur, storeLocation, handleExportJSON
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
    display: flex;
    justify-content: center;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.2);
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
    padding: 0 2.3rem 2.2rem;
    color: #fff;
    font-weight: bold;
    font-size: 1.5rem;
    line-height: 1;
    margin-bottom: 0.7rem;
}

.subtitle {
    padding: 1rem 1rem;
    background-color: #cfc9c9;
    color: #1abc9c;
    border-radius: 25px;
}

.entity {
    /* padding: 2.3rem 2.2rem; */
    position: relative;
    background-color: #eee;
}


form {
    padding: 0 2.3rem 2.2rem;
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

th.menu,
td.menu {
    padding: 0 1.2rem 0 0;
    text-align: left;
}

button.action {
    background-color: #7cbcbc;
}

button.action:hover {
    background-color: white;
    color: black;
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

.entities {
    overflow: scroll;
    /* scrollbar-color: red orange; */
    scrollbar-width: thin;
    height: 50rem;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>