<template>
    <div class="my-container">

        <div class="form">
            <div class="banner">
                <div class="actions">
                    <h3 class="title">Dashboard</h3>
                    <i class="fa-solid fa-face-smile-wink" title="Status of the execution" @click="handleGraphType()"
                        style="text-shadow: 2px 5px 5px black; color: rgb(240, 240, 141);font-size: 2.5rem;cursor: pointer;"
                        v-if="graphType == 0"></i>
                    <span v-if="graphType == 0" style="color: #3d3c3c; cursor: pointer;"
                        @click="handleGraphType()">&nbsp;&nbsp;Status</span>
                    <i class="fa-solid fa-chart-line" title="Story performance" @click="handleGraphType()"
                        style="text-shadow: 2px 5px 5px black; color: violet;font-size: 2.5rem; cursor: pointer;"
                        v-if="graphType == 1"></i>
                    <span v-if="graphType == 1" style="color: #3d3c3c; cursor: pointer;"
                        @click="handleGraphType()">&nbsp;&nbsp;Story</span>
                    <i class="fa-solid fa-chart-column" title="Step performance" @click="handleGraphType()"
                        style="text-shadow: 2px 5px 5px black; color: Orange;font-size: 2.5rem;cursor: pointer;"
                        v-if="graphType == 2"></i>
                    <span v-if="graphType == 2" style="color: #3d3c3c;cursor: pointer;"
                        @click="handleGraphType()">&nbsp;&nbsp;Step</span>

                </div>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>

                <div class="actions">

                    <table class="scroll2">
                        <tbody>
                            <tr>
                                <td colspan="2">
                                    <div class="input-container focus">
                                        <select id="test" class="input select" @focus="handleFocus($event)"
                                            @change="handleStoryheaderChange()" title="Select a story to test"
                                            @blur="handleBlur($event)" v-model="selectedStoryheader">
                                            <option v-for="story in storiesheader" :key="story.storyheaderID"
                                                :title="story.comment" v-bind:value="{ id: story.storyheaderID }">
                                                {{ story.label }}</option>
                                        </select>
                                        <label>Story</label>
                                        <span>Story</span>
                                    </div>
                                </td>
                                <td>
                                    <span>&nbsp;&nbsp;</span>
                                </td>

                            </tr>
                            <tr>
                                <td>
                                    <div class="input-container focus">
                                        <select id="test" class="input select" @focus="handleFocus($event)"
                                            @change="handleStepChange()" title="Select a step to execute"
                                            @blur="handleBlur($event)" v-model="selectedStory">
                                            <option v-for="test in stories" :key="test.storyheaderID"
                                                :title="test.comment" v-bind:value="{ id: test.storyID }">
                                                {{ test.story }}</option>
                                        </select>
                                        <label>Step</label>
                                        <span>Step</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="input-container">
                                        <button @click="handleLogfile" class="init" title="Goto the Logfile">
                                            <i class="fa-regular fa-eye"></i>
                                            Log</button>
                                    </div>

                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <div class="input-container">
                                        <button @click="handleExecute" class="init" title="Execute the scenario"
                                            v-if="status != 99">
                                            <i class="fa-regular fa-circle-play"></i>
                                            Execute</button>
                                        <i class="fa-solid fa-rotate" :style="executeStyle"
                                            @click="continuousExec = !continuousExec" :title="executeTitle"></i>
                                        <i class="fa-solid fa-hand icon" @click="storyRetry = !storyRetry"
                                            title="Stop in case of error" v-if="continuousExec && !storyRetry"></i>
                                        <i class="fa-solid fa-person-running icon" @click="storyRetry = !storyRetry"
                                            title="retry 5 times in case of error"
                                            v-if="continuousExec && storyRetry"></i>

                                    </div>

                                    <div class="input-container" v-if="status == 99">
                                        <button
                                            @click="handleEmergency(); status = -1; mainTitle = 'Emergency stop in progress, please wait...'"
                                            class="stop" title="Emergency Stop scenario">
                                            <i class="fa-regular fa-circle-play"></i>
                                            Stop</button>
                                    </div>


                                </td>

                                <td>
                                    <div class="input-container" v-if="status != 99">
                                        <button @click="handleCancel" class="cancel" title="Back to the Control Panel">
                                            <i class="fa-solid fa-ban"></i>
                                            Cancel</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>


                <div class="actions">
                    <table class="scroll">
                        <tbody>
                            <tr>
                                <td colspan="2">
                                    <div class="input-container">
                                        <button @click="handleReference" class="init" title="Goto the Reference">
                                            <i class="fa-regular fa-eye"></i>
                                            Reference</button>
                                    </div>

                                </td>
                            </tr>

                            <tr v-for="ref in references" :key="ref.code">
                                <td class="ref bold label">
                                    <i class="fa-regular fa-pen-to-square" title="You can edit this value"
                                        v-if="ref.inputoutput"></i>
                                    <i class="fa-solid fa-circle-info" title="Just for your information" v-else></i>
                                    {{ ref.paramComment }}
                                </td>
                                <td class="ref bold value" :title="ref.comment">
                                    <i class="fa-regular fa-copy"
                                        @click="handleClipboard(ref.label, 1, ref.referenceID)"
                                        title="Copy the value to the clipboard" v-if="!clipboard1"></i>
                                    <i class="fa-solid fa-copy" @click="handleClipboard(ref.label, 1, ref.referenceID)"
                                        title="Copy the value to the clipboard"
                                        v-if="clipboard1 == 1 && clipboardID == ref.referenceID"></i>
                                    {{ ref.label }}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>

            </div>


            <div class="entity">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div>
                                    <h2 class="title" :key="mainTitle">{{ mainTitle }}
                                        <p>{{ graphTitle }}</p>
                                    </h2>
                                </div>
                            </td>
                            <td>
                                <div class="input-container focus" v-if="graphType == 1 || graphType == 2">
                                    <select id="test" class="input select" @focus="handleFocus($event)"
                                        @change="handleEnvironmentChange()" title="Select a environment"
                                        @blur="handleBlur($event)" v-model="selectedEnvironment">
                                        <option v-for="Env in AllEnvironment" :key="Env" title="Select an environment"
                                            v-bind:value="{ Env }">
                                            {{ Env }}</option>
                                    </select>
                                    <label style="background-color: #B7C39A;">Environment</label>
                                    <span>Environment</span>
                                </div>
                            </td>
                            <td>
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <i class="fa-solid fa-magnifying-glass" @click="handleGraphDetail()"
                                    style="font-size: 25px;" title="Display data performance"
                                    v-if="graphType > 0 && graphDetail == 0"></i>
                                <i class="fa-regular fa-circle-xmark" @click="handleGraphDetail()"
                                    style="font-size: 25px;" title="Hide data performance"
                                    v-if="graphType > 0 && graphDetail == 1"></i>
                            </td>

                        </tr>
                    </tbody>
                </table>




                <div>
                    <span>&nbsp;</span>
                    <img src="../../assets/think.png" alt="status" class="smiley spin" v-if="status == 99">
                    <img src="../../assets/success.png" alt="status" class="smiley" v-if="status == 1">
                    <img src="../../assets/emergency.png" alt="status" class="smiley" v-if="status == -1">
                    <img src="../../assets/error1.png" alt="status" class="smiley" v-if="status == 2">
                    <img src="../../assets/error2.png" alt="status" class="smiley" v-if="status == 3">
                    <img src="../../assets/error3.png" alt="status" class="smiley" v-if="status == 4">
                    <img src="../../assets/error4.png" alt="status" class="smiley" v-if="status == 5">
                    <img src="../../assets/fail.png" alt="status" class="smiley" v-if="status == 0">
                    <!-- <Spinner v-if="executing" /> -->

                </div>

                <div class="barchart">
                    <Bar id="status-chart-id" :options="chartOptions" :data="chartData" v-if="graphType == 0" />
                    <Bar id="performance-chart-id" :options="chartOptions" :data="chartDataPerf"
                        v-if="graphType > 0 && graphDetail == 0" />
                    <Bar id="performancedetail-chart-id" :options="chartOptions" :data="chartDataDetail"
                        v-if="graphType > 0 && graphDetail == 1" />
                </div>

            </div>
        </div>


    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import useClipboard from 'vue-clipboard3'
import Spinner from '../../components/Spinner.vue'
import getDashboardReference from '../../composables/reference/getDashboardReference'
import getStoryheadersBySubproject from '../../composables/storyheader/getStoryheadersBySubproject'
import getStoryByHeader from '../../composables/story/getStoryByHeader'
import deleteExecutedStory from '../../composables/storyexec/deleteExecutedStory'
import resetExecutedStory from '../../composables/storyexec/resetExecutedStory'
import getExecutedStory from '../../composables/storyexec/getExecutedStory'
import counterExecutedStory from '../../composables/storyexec/counterExecutedStory'
import executeStory from '../../composables/selenium/executeStory'
import getParametersByCode from '../../composables/parameter/getParametersByCode'
import getReferenceByCode from '../../composables/reference/getReferenceByCode'
import storeReference from '../../composables/reference/storeReference'
import getPerformanceByStory from '../../composables/performance/getPerformanceByStory'
import getPerformanceByStep from '../../composables/performance/getPerformanceByStep'
import { displayMsg, consoleLog } from '../../util/debug';
import { Bar, Line, createTypedChart } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, PointElement, LineElement, CategoryScale, LinearScale, LineController } from 'chart.js'



export default {
    name: 'Dashboard',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'connected', 'workspaceID', 'workspace',
        'projectID', 'projectName', 'subprojectID', 'subprojectName'],
    components: { Spinner, Bar },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const { toClipboard } = useClipboard()

        const environment = ref('')
        const myTitle = ref('')
        const executedstories = ref([])
        const graphLabels = ref([])
        const graphLabelID = ref([])
        //const graphexecID = ref([])
        const graphData = ref([])
        const barcolour = '#85c1db'
        const graphType = ref(0)
        const performances = ref([])
        const graphDataPerfAvg = ref([])
        const barcolourPerfAvg = '#1abc9c'
        const graphDataPerf = ref([])
        const barcolourPerf = '#4762f8' // '#24a2eb'
        const graphDataPerfDev = ref([])
        const barcolourPerfDev = '#fff59e'
        const TitlePerfAvg = ref('Average')
        const TitlePerfDev = ref('Deviation')
        const TitlePerf = ref('Last')
        const graphDetail = ref(0)
        const graphDetailDataset = ref([])


        const dataLoaded = ref(false)
        const status = ref(1)
        const oldStatus = ref(1)
        const subprojectName = ref(props.subprojectName)
        const subprojectID = ref(props.subprojectID)
        const projectName = ref(props.projectName)
        const projectID = ref(props.projectID)
        const userID = ref(props.userID)
        const userName = ref(props.currentuser)
        const role = ref(props.role)
        const mainTitle = ref(projectName.value + ' / ' + subprojectName.value)

        const dashboardStoryheaderID = ref(0)
        const storyheaderID = ref(0)
        const storyName = ref('')
        const storiesheader = ref([])
        const selectedStoryheader = ref({ id: storyheaderID.value })
        const storyErrorID = ref('')
        const storyStatus = ref('')
        const storyheaderlastID = ref(0)
        const storylastID = ref(0)
        const storyID = ref(0)
        const stories = ref([])
        const selectedStory = ref({ id: storyID.value })
        const setupID = ref(0)

        const references = ref([])
        const selenium = ref([])
        const executing = ref(0)
        const continuousExec = ref(false)
        const executeTitle = ref('')
        const resetLog = ref(1)

        const parameter = ref([])
        const retryTest = ref(0)
        const storyRetry = ref(0)
        const storyMaxRetry = ref(5)
        const storyWaitRetry = ref(10)
        const clipboard1 = ref(0)
        const clipboard2 = ref(0)
        const clipboardID = ref(0)

        const AllEnvironment = ref([])
        const selectedEnvironment = ref({ Env: '' })


        const executeStyle = computed(() => {
            if (continuousExec.value) {
                executeTitle.value = 'Continuous execution. Click for Single'
                return "cursor: pointer; color: #0011c9;font-size: 1.5rem;background-color: #b7c39a; border-radius: 3rem; padding:4px; border: 2px solid black; animation: spin 1s ease infinite;"
            } else {
                executeTitle.value = 'Single execution. Click for Continuous'
                return "cursor: pointer; color: rgb(66, 64, 64);font-size: 1.5rem;background-color: transparent;"
            }
        })


        displayMsg('Dashboard.vue', trace.value)
        consoleLog('Dashboard.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }

        ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement)

        const graphTitle = computed(() => {
            return myTitle.value
        });

        const graphExecute = computed(() => {
            //console.log('computer graphExecute')
            return executing.value
        });

        const chartData = computed(() => ({
            labels: graphLabels.value,
            datasets: [
                {
                    label: graphTitle.value,
                    backgroundColor: barcolour,
                    data: graphData.value,
                    refresh: graphExecute.value
                }
            ]
        }));

        const chartDataPerf = computed(() => ({
            labels: graphLabels.value,
            datasets: [
                {
                    type: 'bar',
                    label: TitlePerfAvg.value,
                    backgroundColor: barcolourPerfAvg,
                    data: graphDataPerfAvg.value,
                    refresh: graphExecute.value,
                    borderColor: '#1abc9c',
                    borderWidth: 2,
                    borderRadius: 20,
                    order: 3
                },
                {
                    type: 'line',
                    label: TitlePerf.value,
                    backgroundColor: barcolourPerf,
                    //borderColor: '#000000',
                    data: graphDataPerf.value,
                    tension: 0.3,
                    pointRadius: 10,
                    pointHoverRadius: 20,
                    borderDash: [5, 5],
                    order: 1
                },
                // {
                //     type: 'line',
                //     label: TitlePerfDev.value,
                //     backgroundColor: barcolourPerfDev,
                //     //borderColor: '#000000',
                //     data: graphDataPerfDev.value,
                //     tension: 0.3,
                //     pointRadius: 10,
                //     pointHoverRadius: 20,
                //     borderDash: [5, 5],
                //     order: 2
                // }                
            ]
        }));


        const chartDataDetail = computed(() => ({
            type: 'bar',

            labels: graphLabels.value,
            datasets: graphDetailDataset.value
        }));


        let myData = []
        myData[1] = []
        myData[2] = []
        myData[3] = []
        myData[1].push(100)
        myData[1].push(110)
        myData[2].push(600)
        myData[2].push(700)
        myData[3].push(1500)


        const chartDataTest = computed(() => ({
            type: 'bar',

            labels: ['login', 'sanity'],
            datasets: [{
                label: '1',
                data: myData[1], // [2345, 1234],
                backgroundColor: 'blue',
            },
            {
                label: '2',
                data: myData[2], //[3456, 2345],
                backgroundColor: 'red',
            },
            {
                label: '3',
                data: myData[3], //[1500],
                backgroundColor: 'green',
            }

            ]
        }));


        const chartOptions = ref({ responsive: true })

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
            consoleLog('Dashboard.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }

        // --------------------------------------------------------------------------
        // Get the global parameter
        // --------------------------------------------------------------------------
        const getGlobalParameter = async (code) => {
            const { error1, loadParameters } = getParametersByCode(0, code)
            return await loadParameters(parameter, trace.value)
                .then(function () {
                    consoleLog('Dashboard.vue/getParametersByCode - Value: ', 2, parameter.value.data[0].paramValue, trace.value)
                    return parameter.value.data[0].paramValue
                })
        }


        // ------------------------------------------------------------
        // Read the last story executed (using the reference)
        // ------------------------------------------------------------
        const getEnvironment = async () => {
            const code = 'Environment'
            const reference = ref([])
            const { error1, loadReference } = getReferenceByCode(projectID.value, userID.value, code)
            await loadReference(reference, trace.value)
                .then(function () {
                    consoleLog('Dashboard.vue/loadReference - getlastStory', 2, 'Code: ' + code, trace.value)
                    if (reference.value.success && reference.value.data.length) {
                        reference.value = reference.value.data
                        environment.value = reference.value[0].label;
                        consoleLog('Dashboard/loadReference - getEnvironment', 2, 'Value: ' + environment.value, trace.value)
                    } else {
                        //DisplayError("Internal error: Please define an entry 'Environment' in the Reference data!", 'Alert')
                        consoleLog('Dashboard/loadReference - getEnvironment', 2, 'No reference found for ' + code + '!', trace.value)
                        environment.value = '<ERR>'
                    }
                })
        }

        // ------------------------------------------------------------
        // Read the last story executed (using the reference)
        // ------------------------------------------------------------
        const getAllEnvironments = async () => {
            const code = 'AllEnvironments'
            const reference = ref([])
            const { error1, loadReference } = getReferenceByCode(projectID.value, userID.value, code)
            await loadReference(reference, trace.value)
                .then(function () {
                    consoleLog('Dashboard.vue/loadReference - getlastStory', 2, 'Code: ' + code, trace.value)
                    if (reference.value.success && reference.value.data.length) {
                        reference.value = reference.value.data
                        console.log('Reference', reference.value[0].label)
                        AllEnvironment.value = reference.value[0].label.split(',');
                        selectedEnvironment.value.Env = environment.value

                        //console.log ('selectedEnvironment', selectedEnvironment.value)
                        consoleLog('Dashboard/loadReference - getAllEnvironments', 2, 'Value: ' + reference.value[0].label, trace.value)
                    } else {
                        AllEnvironment.value[0] = environment.value
                        selectedEnvironment.value.Env = environment.value
                    }
                })
        }


        // ------------------------------------------------------------
        // Read the last story executed (using the reference)
        // ------------------------------------------------------------
        const getlastStory = async () => {
            const code = 'Story Last ' + subprojectID.value
            const reference = ref([])
            const { error1, loadReference } = getReferenceByCode(projectID.value, userID.value, code)
            await loadReference(reference, trace.value)
                .then(function () {
                    consoleLog('Dashboard.vue/loadReference - getlastStory', 2, 'Code: ' + code, trace.value)
                    if (reference.value.success && reference.value.data.length) {
                        reference.value = reference.value.data
                        let dataRef = reference.value[0].label.split("=");
                        storyheaderlastID.value = dataRef[0]
                        storylastID.value = dataRef[1]
                        consoleLog('Dashboard/loadReference - getlastStory', 2, 'storyheaderlastID: ' + storyheaderlastID.value + ', storylastID: ' + storylastID.value, trace.value)
                    } else {
                        consoleLog('Dashboard/loadReference - getlastStory', 2, 'No reference found!', trace.value)
                        storyheaderlastID.value = 0
                        storylastID.value = 0
                    }
                })
        }

        // ------------------------------------------------------------
        // Store the last story executed (using the reference)
        // ------------------------------------------------------------
        const storelastStory = async (label) => {
            // const reference = ref([])
            // // code, label, comment, projectID, userID
            // const { error, storeTheReference } = storeReference('Story Last ' + subprojectID.value, label, 'Last story executed', projectID.value, userID.value)
            // return await storeTheReference(reference.value, trace.value)
            //     .then(function () {
            //         consoleLog('Dashboard.vue/storelastStory', 2, 'Success: ' + reference.value.success, trace.value)
            //         return reference.value.success
            //     })
            consoleLog('Dashboard.vue/storelastStory', 2, 'Before', trace.value)
            let success = storeReference('Story Last ' + subprojectID.value, label, 'Last story executed', projectID.value, userID.value, trace.value)
            consoleLog('Dashboard.vue/storelastStory', 2, 'Success: ' + success, trace.value)
            return success
        }

        // ------------------------------------------------------------
        // Read the status of the story (using the reference)
        // ------------------------------------------------------------
        const getReference = async () => {
            const code = 'Story Status ' + subprojectID.value + '/' + storyheaderID.value
            const reference = ref([])
            const { error1, loadReference } = getReferenceByCode(projectID.value, userID.value, code)
            await loadReference(reference, trace.value)
                .then(function () {
                    consoleLog('Dashboard.vue/loadReference', 2, 'Code: ' + code, trace.value)
                    if (reference.value.success && reference.value.data.length) {
                        reference.value = reference.value.data
                        let dataRef = reference.value[0].label.split("=");
                        storyStatus.value = dataRef[0]
                        storyErrorID.value = dataRef[1]
                        consoleLog('Dashboard/loadReference', 2, 'Status: ' + storyStatus.value + ', ' + storyErrorID.value, trace.value)
                        if (storyStatus.value == 'OK') storyErrorID.value = ''
                    } else {
                        consoleLog('Dashboard/loadReference', 2, 'No reference found!', trace.value)
                        storyStatus.value = 'OK'
                        storyErrorID.value = ''
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Get the references
        // --------------------------------------------------------------------------
        const loadReferenceData = async (refStoryheaderID) => {
            const { error, loadReference } = getDashboardReference(projectID.value, userID.value, refStoryheaderID)
            return await loadReference(references, trace.value)
                .then(function () {
                    consoleLog('Dashboard.vue/getDashboardReference', 2, '------ projectID: ' + projectID.value + ', userID: ' + userID.value, trace.value)
                    consoleLog('Dashboard.vue/getDashboardReference', 2, references, trace.value)
                    if (references.value.success && references.value.data.length) {
                        references.value = references.value.data
                        consoleLog('Dashboard.vue/getDashboardReference', 2, references, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dashboard.vue/getDashboardReference', 2, 'No reference found!', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Get the storiesheader
        // --------------------------------------------------------------------------
        const loadStoryheader = async () => {
            // Get the storiesheader header (check the accesssibility) 
            let active = 0 // all stories available
            if (role.value == 'Tester') active = 2 // only published stories
            const { error2, loadStoryheader } = getStoryheadersBySubproject(subprojectID.value, active)
            await loadStoryheader(storiesheader, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Dashboard.vue/loadStoryheader', 2, 'Storyheaders status: ' + storiesheader.value.success, trace.value)
                    if (storiesheader.value.success && storiesheader.value.data.length) {
                        storiesheader.value = storiesheader.value.data
                        //graphTitle.value = storiesheader.value[0].label
                        if (storyheaderlastID.value) storyheaderID.value = storyheaderlastID.value
                        else storyheaderID.value = storiesheader.value[0].storyheaderID
                        selectedStoryheader.value = { id: storyheaderID.value }
                        myTitle.value = storiesheader.value[0].label
                        return (1)
                    } else {
                        consoleLog('Dashboard.vue/loadStoryheader', 2, 'No story found!', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Get the stories
        // --------------------------------------------------------------------------
        const loadStory = async (lastStory) => {
            consoleLog('Dashboard.vue/loadStory', 2, 'storyheaderID: ' + storyheaderID.value, trace.value)
            if (lastStory) {
                // Get the status of the story
                await getlastStory()
                if (storyheaderlastID.value) {
                    storyheaderID.value = storyheaderlastID.value
                    selectedStoryheader.value = { id: storyheaderID.value }
                    myTitle.value = await getTitle()
                }
            }

            await getReference()
            consoleLog('****************Dashboard.vue/loadStoryheader', 2, 'story execution status' + storyErrorID.value, trace.value)

            const { error3, loadStory } = getStoryByHeader(storyheaderID.value, '1')
            return await loadStory(stories, trace.value)
                .then(function () {
                    // check the status of the load
                    if (stories.value.success && stories.value.data.length) {
                        stories.value = stories.value.data
                        // Set the story on the last error if any, otherwise set to the first story
                        setupID.value = stories.value[0].storyID
                        if (storyStatus.value == 'OK') {
                            if (storylastID.value) storyID.value = storylastID.value
                            else storyID.value = stories.value[0].storyID
                            status.value = 1
                        } else {
                            storyID.value = storyErrorID.value
                            status.value = 0
                        }
                        selectedStory.value = { id: storyID.value }
                        consoleLog('Dashboard.vue/loadStory', 2, stories.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dashboard.vue/loadStory', 2, 'No story found!', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Get the Executed stories
        // --------------------------------------------------------------------------
        const loadExecutedStory = async () => {
            consoleLog('Dashboard.vue/loadExecutedStory', 2, 'storyheaderID: ' + storyheaderID.value + ', userID: ' + userID.value, trace.value)
            const { error3, loadTheStory } = getExecutedStory(storyheaderID.value, userID.value)
            return await loadTheStory(executedstories, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Dashboard.vue/loadExecutedStory', 2, 'executedstories status: ' + executedstories.value, trace.value)
                    if (executedstories.value.success && executedstories.value.data.length) {
                        executedstories.value = executedstories.value.data
                        //storyID.value = executedstories.value[0].storyheaderID
                        //selectedStory.value = { id: storyID.value }
                        consoleLog('Dashboard.vue/loadExecutedStory', 2, executedstories.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dashboard.vue/loadExecutedStory', 2, 'No executedstories found!', trace.value)
                        return (0)
                    }
                }).then(function (res) {

                    if (res) {
                        // Loop through all the story exec to fill the graph data
                        graphLabels.value = []
                        graphLabelID.value = []
                        graphData.value = []
                        //setupID.value = -99
                        for (let i = 0; i < executedstories.value.length; i++) {
                            if (executedstories.value[i].graphlabel != '') {
                                //console.log('---------------- graphlabel: ', executedstories.value[i].graphlabel)
                                graphLabels.value.push(executedstories.value[i].graphlabel)
                                graphLabelID.value.push(executedstories.value[i].storyID)
                                graphData.value.push(executedstories.value[i].count)
                            } // else if (i == 0) {
                            //     // A setup scenario is the first test and without graph label
                            //     setupID.value = executedstories.value[i].storyID
                            // }
                        }
                        dataLoaded.value = true
                    }

                    return res
                })
        }

        // ------------------------------------------------------------------------
        // delete all the execstorry
        // ------------------------------------------------------------------------
        const deleteExecStory = async () => {
            const { error, deleteTheStory } = deleteExecutedStory(storyheaderID.value, userID.value)
            return await deleteTheStory(executedstories, trace.value)
                .then(function () {
                    consoleLog('Dashboard.vue/deleteExecStory', 2, '------ storyheaderID: ' + storyheaderID.value + ', userID: ' + userID.value, trace.value)
                    consoleLog('Dashboard.vue/deleteExecStory', 2, executedstories, trace.value)
                    if (executedstories.value.success) {
                        consoleLog('Dashboard.vue/deleteExecStory', 2, executedstories, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dashboard.vue/deleteExecStory', 2, 'No execuredStory found!', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Reset Executed stories
        // --------------------------------------------------------------------------
        const resetExecStory = async () => {
            consoleLog('Dashboard.vue/resetExecutedStory', 2, 'storyheaderID: ' + storyheaderID.value + ', userID: ' + userID.value, trace.value)
            const { error3, resetTheStory } = resetExecutedStory(storyheaderID.value, userID.value)
            return await resetTheStory(executedstories, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Dashboard.vue/resetExecutedStory', 2, 'storiesheader status: ' + executedstories.value.success, trace.value)
                    if (executedstories.value.success) {
                        consoleLog('Dashboard.vue/resetExecutedStory', 2, executedstories.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dashboard.vue/resetExecutedStory', 2, 'Error during the reset of story exec!', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Save the Executed stories counter
        // --------------------------------------------------------------------------
        const saveExecStoryCounter = async (counter) => {
            // Write the counter in the database
            const story = ref([])
            consoleLog('Dashboard.vue/saveExecStoryCounter', 2, 'count: ' + counter, trace.value)
            const { error1, updateTheCounter } = counterExecutedStory(counter, selectedStoryheader.value.id, selectedStory.value.id, userID.value)
            return await updateTheCounter(story.value, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('Dashboard.vue/saveExecStoryCounter', 2, 'storiesheader status: ' + story.value.success, trace.value)
                    if (executedstories.value.success) {
                        consoleLog('Dashboard.vue/saveExecStoryCounter', 2, story.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('Dashboard.vue/saveExecStoryCounter', 2, 'Error during the update of story exec counter!', trace.value)
                        return (0)
                    }
                })
        }



        // --------------------------------------------------------------------------
        // Increase the Executed stories counter
        // --------------------------------------------------------------------------
        const increaseExecStoryCounter = async () => {
            consoleLog('Dashboard.vue/increaseExecStoryCounter', 2, graphLabels.value, trace.value)
            executing.value = 0

            for (let i = 0; i < graphLabels.value.length; i++) {
                //console.log ('graphLabelID: ', graphLabelID.value[i])
                if (graphLabelID.value[i] == selectedStory.value.id) {
                    graphData.value[i]++ // increase the count
                    //console.log('---------------- graphlabel: ' + i + ' count : ', graphData.value[i])
                    await saveExecStoryCounter(graphData.value[i])
                }
            }
            executing.value = 1
        }


        // --------------------------------------------------------------------------
        // load all the required data
        // --------------------------------------------------------------------------
        const loadAllData = async () => {

            storyMaxRetry.value = await getGlobalParameter('StoryMaxRetry')
            storyWaitRetry.value = await getGlobalParameter('StoryWaitRetry')

            await loadStoryheader()
            await loadStory(1)
            dashboardStoryheaderID.value = storyheaderID.value
            let ret = await loadReferenceData(dashboardStoryheaderID.value) // specific references for the story
            if (!ret) {
                dashboardStoryheaderID.value = 0
                await loadReferenceData(dashboardStoryheaderID.value) // generic references for the project
            }
            ret = await loadExecutedStory()
            if (!ret) {
                await resetExecStory()
                ret = await loadExecutedStory()
            }
            await getEnvironment()
            await getAllEnvironments()
        }

        loadAllData()


        // ------------------------------------------------------------------------
        // Get the title of the story
        // ------------------------------------------------------------------------
        const getTitle = async () => {
            for (let i = 0; i < storiesheader.value.length; i++) {
                if (storiesheader.value[i].storyheaderID == selectedStoryheader.value.id) {
                    //console.log ('@@@@@@@@@@ ', storiesheader.value[i].label, selectedStoryheader.value.id)
                    return storiesheader.value[i].label
                }
            }
            return 'Title not found!'
        }

        // ------------------------------------------------------------------------
        // Get the next step
        // ------------------------------------------------------------------------
        const getNextStep = async () => {
            let found = 0
            //console.log('stories: ', stories.value)
            //console.log('parameters: ' + selectedStory.value.id)
            for (let i = 0; i < stories.value.length - 1 && !found; i++) {
                console.log('getNextStep - i: ' + i)
                if (stories.value[i].storyID == selectedStory.value.id) {
                    found = i + 1
                    storyID.value = stories.value[found].storyID
                    selectedStory.value = { id: storyID.value }
                    await storelastStory(storyheaderID.value + '=' + storyID.value)
                    //console.log('****** Found: ' + selectedStory.value.id)
                    //console.log('Stories: ', stories.value)
                }
            }
            consoleLog('Dashboard.vue/getNextStep', 2, 'Found: ' + found + ', storyID: ' + storyID.value, trace.value)
            return found

        }


        // --------------------------------------------------------------------------
        // User asks to go to the references
        // --------------------------------------------------------------------------
        const handleReference = () => {
            consoleLog('Dashboard.vue/handleReference', 2, 'User asks to go to the references', trace.value)
            context.emit('storelocation', 'dashboard=' + dashboardStoryheaderID.value)
            router.push({ name: 'References' })
        }


        // --------------------------------------------------------------------------
        // User ask to go to the logfile
        // --------------------------------------------------------------------------
        const handleLogfile = () => {
            consoleLog('Dashboard.vue/handleLogfile', 2, 'User want to view the Logfile', trace.value)
            context.emit('storelocation', 'dashboard')
            //router.push({ name: 'Logfiles' })
            router.push({ name: 'LogReport' })
        }


        // --------------------------------------------------------------------------
        // User cancel the action, Back to the control panel
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('Dashboard.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            context.emit('storeLocation', 'dashboard')
            router.push({ name: 'ControlPanel' })
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
        // Get the story performance
        // --------------------------------------------------------------------------
        const GetStoryPerformance = async () => {
            const { error, loadPerformance } = getPerformanceByStory(projectID.value, storyheaderID.value, environment.value)
            return await loadPerformance(performances, trace.value)
                .then(function () {
                    consoleLog('Dashboard.vue/GetPerformances', 2, '------ storyheaderID: ' + storyheaderID.value + ', environment: ' + environment.value, trace.value)
                    //consoleLog('Dashboard.vue/GetPerformances', 2, performances, trace.value)
                    if (performances.value.success && performances.value.data.length) {
                        return (1)
                    } else {
                        consoleLog('Dashboard.vue/GraphStoryPerformance', 2, 'No Performance found!', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Get the step performance
        // --------------------------------------------------------------------------
        const GetStepPerformance = async () => {
            const { error, loadPerformance } = getPerformanceByStep(projectID.value, storyheaderID.value, storyID.value, environment.value)
            return await loadPerformance(performances, trace.value)
                .then(function () {
                    consoleLog('Dashboard.vue/GetStepPerformance', 2, '------ storyID: ' + storyID.value + ', environment: ' + environment.value, trace.value)
                    //consoleLog('Dashboard.vue/GetStepPerformance', 2, performances, trace.value)
                    if (performances.value.success && performances.value.data.length) {
                        return (1)
                    } else {
                        consoleLog('Dashboard.vue/GetStepPerformance', 2, 'No Performance found!', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Prepare the graph: Performance
        // --------------------------------------------------------------------------
        const GraphPerformance = async () => {
            consoleLog('Dashboard.vue/GraphPerformance', 2, 'Display the graph: Performance', trace.value)

            consoleLog('Dashboard.vue/GraphPerformance', 2, 'Performances: ' + performances.value.data.length, trace.value)
            // Loop on the performance to compute the average
            let id = 0
            let perfAverage = 0
            for (let i = 0; i < performances.value.data.length; i++) {
                consoleLog('Dashboard.vue/GraphPerformance', 2, 'Sequence: ' + performances.value.data[i].sequenceID + ' Measure: ' + performances.value.data[i].measure, trace.value)
                if (performances.value.data[i].sequenceID == 11) {
                    // push the performance Average
                    perfAverage = perfAverage / id
                    consoleLog('Dashboard.vue/GraphPerformance', 2, 'Average: ' + perfAverage, trace.value)
                    graphDataPerfAvg.value.push(perfAverage)
                    // push the last performance
                    graphDataPerf.value.push(performances.value.data[i].measure)
                    //graphDataPerf.value.push(3)
                    consoleLog('Dashboard.vue/GraphPerformance', 2, 'Measure: ' + performances.value.data[i].measure, trace.value)
                    // push the label
                    graphLabels.value.push(performances.value.data[i].scenario + '/' + performances.value.data[i].topic)
                    id = 0
                    perfAverage = 0
                } else {
                    perfAverage = perfAverage + performances.value.data[i].measure
                    id++
                }
            }
            // // Compute the variance
            // id = 0
            // let perfVariance = 0
            // for (let i = 0; i < performances.value.data.length; i++) {
            //     if (performances.value.data[i].sequenceID == 11) {
            //         // push the performance Variance
            //         perfVariance = perfVariance / id
            //         perfVariance = Math.sqrt (perfVariance)
            //         graphDataPerfDev.value.push(perfVariance)
            //         consoleLog('Dashboard.vue/GraphPerformance', 2, 'Variance average: ' + perfVariance, trace.value)
            //         id = 0
            //         perfVariance = 0
            //     } else {
            //         let variance = performances.value.data[i].measure - perfAverage
            //         perfVariance = perfVariance + (variance * variance)
            //         id++
            //         consoleLog('Dashboard.vue/GraphPerformance', 2, 'Variance: ' + id + ' = ' + perfVariance, trace.value)
            //     }
            // }

        }

        // --------------------------------------------------------------------------
        // Prepare the graph: Performance Detail
        // --------------------------------------------------------------------------
        const GraphPerformanceDetail = async () => {
            consoleLog('Dashboard.vue/GraphPerformanceDetail', 2, 'Display the graph: Performance Detail', trace.value)

            //consoleLog('Dashboard.vue/GraphPerformanceDetail', 2, 'Performances: ' + performances.value.data.length, trace.value)
            // Loop on the performance to compute the average
            let graphData = [11]
            let id = 0
            let groupID = 0

            graphLabels.value = []
            graphDetailDataset.value = []

            // Detect the number of group
            for (let i = 0; i < performances.value.data.length; i++) {
                if (performances.value.data[i].sequenceID == 11) {
                    groupID++
                    graphLabels.value.push(performances.value.data[i].scenario + '/' + performances.value.data[i].topic)
                }
            }

            // Reset the graphdata
            for (let i = 0; i < 11; i++) {
                for (let j = 0; j < groupID; j++) {
                    graphData[i] = []
                    graphData[i][j] = null
                }
            }

            // Process the performances
            let seqID = 0
            for (let i = 0; i < performances.value.data.length; i++) {
                let seqID = performances.value.data[i].sequenceID - 1
                if (seqID > 0) {
                    graphData[seqID][id] = performances.value.data[i].measure
                    if (performances.value.data[i].sequenceID == 11) {
                        id++
                    }
                }
            }

            // console.log('GRAPH DATA', graphData)

            let color = ''
            let label = ''
            for (let i = 0; i < 11; i++) {
                label = i + 1
                color = '#1ABC9C'
                if (label == 11) {
                    label = 'Last'
                    color = '#4762F8'
                }
                graphDetailDataset.value.push({
                    label: label, backgroundColor: color, data: graphData[i],
                    borderColor: '#1abc9c', borderWidth: 2, borderRadius: 20
                })
            }
        }



        // --------------------------------------------------------------------------
        // Display the graph: Execution status
        // --------------------------------------------------------------------------
        const GraphExecutionStatus = async () => {
            consoleLog('Dashboard.vue/GraphExecutionStatus', 2, 'Display the graph: Execution Status', trace.value)
            await loadExecutedStory()
            status.value = oldStatus.value
        }

        // --------------------------------------------------------------------------
        // Display the graph: Story Performance
        // --------------------------------------------------------------------------
        const GraphStoryPerformance = async () => {
            consoleLog('Dashboard.vue/GraphStoryPerformance', 2, 'Display the graph: Story Performance', trace.value)

            // get the performances
            await GetStoryPerformance()

            myTitle.value = 'Story Performance'
            oldStatus.value = status.value
            status.value = '11111'

            graphLabels.value = []
            graphLabelID.value = []
            graphDataPerfAvg.value = []
            graphDataPerfDev.value = []
            graphDataPerf.value = []

            consoleLog('Dashboard.vue/GraphStoryPerformance', 2, 'Performances: ' + performances.value.data.length, trace.value)
            if (performances.value.data.length > 0) await GraphPerformance()
        }


        // --------------------------------------------------------------------------
        // Display the graph: Story Performance Detail
        // --------------------------------------------------------------------------
        const GraphStoryPerformanceDetail = async () => {
            consoleLog('Dashboard.vue/GraphStoryPerformanceDetail', 2, 'Display the graph: Story Performance Detail', trace.value)

            // get the performances
            await GetStoryPerformance()

            myTitle.value = 'Story Performance Detail'

            graphLabels.value = []
            graphDetailDataset.value = []

            if (performances.value.data.length > 0) await GraphPerformanceDetail()
        }



        // --------------------------------------------------------------------------
        // Display the graph: Step Performance
        // --------------------------------------------------------------------------
        const GraphStepPerformance = async () => {
            consoleLog('Dashboard.vue/GraphStepPerformance', 2, 'Display the graph: Step Performance', trace.value)

            // get the performances
            await GetStepPerformance()

            graphLabels.value = []
            graphLabelID.value = []
            graphDataPerfAvg.value = []
            graphDataPerfDev.value = []

            graphDataPerf.value = []
            myTitle.value = 'Step Performance'

            consoleLog('Dashboard.vue/GraphStepPerformance', 2, 'Performances: ' + performances.value.data.length, trace.value)
            if (performances.value.data.length > 0) await GraphPerformance()

        }


        // --------------------------------------------------------------------------
        // Display the graph: Step Performance detail
        // --------------------------------------------------------------------------
        const GraphStepPerformanceDetail = async () => {
            consoleLog('Dashboard.vue/GraphStepPerformanceDetail', 2, 'Display the graph: Step Performance Detail', trace.value)

            // get the performances
            await GetStepPerformance()

            myTitle.value = 'Step Performance Detail'
            graphLabels.value = []
            graphDetailDataset.value = []

            if (performances.value.data.length > 0) await GraphPerformanceDetail()

        }



        // --------------------------------------------------------------------------
        // User ask to change the graph
        // --------------------------------------------------------------------------
        const handleGraphType = async () => {
            consoleLog('Dashboard.vue/handleGraphType', 2, 'User want to select another graph', trace.value)
            if (environment.value == '<ERR>') return (0)
            graphType.value++
            graphDetail.value = 0
            if (graphType.value > 2) graphType.value = 0
            if (graphType.value == 0) await GraphExecutionStatus()
            else if (graphType.value == 1) await GraphStoryPerformance()
            else await GraphStepPerformance()
            return (1)
        }

        // --------------------------------------------------------------------------
        // User ask to change the graph
        // --------------------------------------------------------------------------
        const handleGraphDetail = async () => {
            consoleLog('Dashboard.vue/handleGraphDetail', 2, 'User want to change the detail of the graph', trace.value)
            if (environment.value == '<ERR>') return (0)
            graphDetail.value = !graphDetail.value
            if (graphType.value == 1 && graphDetail.value) await GraphStoryPerformanceDetail()
            else if (graphType.value == 1 && !graphDetail.value) await GraphStoryPerformance()
            else if (graphType.value == 2 && graphDetail.value) await GraphStepPerformanceDetail()
            else if (graphType.value == 2 && !graphDetail.value) await GraphStepPerformance()
            return (1)
        }


        // --------------------------------------------------------------------------
        // User ask to change a story header (reload the stories)
        // --------------------------------------------------------------------------
        const handleStoryheaderChange = async () => {
            storyheaderID.value = selectedStoryheader.value.id
            consoleLog('Dashboard.vue/handleStoryheaderChange', 2, 'User want to select another step for the story: ' + storyheaderID.value, trace.value)
            // reload the stories and the executed stories
            storyheaderlastID.value = 0
            storylastID.value = 0
            graphType.value = 0
            graphDetail.value = 0
            await loadStory(0)
            let ret = await loadExecutedStory()
            if (!ret) {
                await resetExecStory()
                ret = await loadExecutedStory()
            }

            // refresh the references
            dashboardStoryheaderID.value = storyheaderID.value
            ret = await loadReferenceData(dashboardStoryheaderID.value) // specific references for the story
            if (!ret) {
                dashboardStoryheaderID.value = 0
                await loadReferenceData(dashboardStoryheaderID.value) // generic references for the project
            }

            // Refresh the screen
            resetLog.value = 1
            continuousExec.value = false
            myTitle.value = await getTitle()
        }


        // --------------------------------------------------------------------------
        // User ask to change a environment 
        // --------------------------------------------------------------------------
        const handleEnvironmentChange = async () => {
            console.log('Change', selectedEnvironment.value.Env)
            environment.value = selectedEnvironment.value.Env
            if (graphType.value == 1) {
                if (graphDetail.value == 0) await GraphStoryPerformance()
                else await GraphStoryPerformanceDetail()
            } else if (graphType.value == 2) {
                if (graphDetail.value == 0) await GraphStepPerformance()
                else await GraphStepPerformanceDetail()
            }
        }


        // --------------------------------------------------------------------------
        // User ask to change a step 
        // --------------------------------------------------------------------------
        const handleStepChange = async () => {
            consoleLog('Dashboard.vue/handleStepChange', 2, 'User want to select another story', trace.value)

            if (graphType.value != 0) {
                graphType.value = 0
                graphDetail.value = 0
                await GraphExecutionStatus()
            }

            storyID.value = selectedStory.value.id
            continuousExec.value = false
            resetLog.value = 1
        }


        // --------------------------------------------------------------------------
        // User ask to execute a test
        // --------------------------------------------------------------------------
        const handleExecute = async () => {
            status.value = 99

            if (graphType.value != 0) {
                graphType.value = 0
                graphDetail.value = 0
                await GraphExecutionStatus()
            }

            let success = await storeReference('Emergency Stop', 0, 'Reset the emergency stop', projectID.value, userID.value, trace.value)

            consoleLog('Dashboard.vue/handleExecute', 2, 'User want to execute a test: ' + selectedStory.value.id + ' setUp: ' + setupID.value, trace.value)
            if (selectedStory.value.id == setupID.value) {
                // User wants to execute the first test (setup), reset all the graph data
                consoleLog('Dashboard.vue/handleExecute', 2, 'Reset the data', trace.value)
                executing.value = 1
                // Reset the exec story
                await deleteExecStory()
                await resetExecStory()
                await loadExecutedStory()
                resetLog.value = 1
            }

            // Execute the scenario
            const { error, execStory } = executeStory(storyName.value, storyheaderID.value, storyID.value, projectID.value, subprojectID.value, userID.value, userName.value, resetLog.value)
            let res = await execStory(selenium, trace.value)
                .then(function () {
                    consoleLog('StoryheaderSingle.vue/handleExecute', 2, '------ storyheaderID: ' + storyheaderID.value + ', userID: ' + userID.value, trace.value)
                    consoleLog('StoryheaderSingle.vue/handleExecute', 2, selenium, trace.value)
                    consoleLog('StoryheaderSingle.vue/handleExecute', 2, 'Status: ' + selenium.value.success, trace.value)
                    //executing.value = 0 // Hide the spinner
                    return selenium.value.success
                })

            // Increase the counter 
            await increaseExecStoryCounter()
            if (res) {
                // success
                status.value = 1
                retryTest.value = 0
                let ret = await getNextStep()
                await loadReferenceData(dashboardStoryheaderID.value)
                if (ret && continuousExec.value) {
                    //await handleExecute()
                    let delay = 2000
                    if (continuousExec.value) resetLog.value = 0
                    setTimeout(async () => await handleExecute(), delay)
                    executing.value = 0 // force to refresh the page
                } else {
                    continuousExec.value = false
                    resetLog.value = 1
                }
            } else {
                //failure
                status.value = 0
                retryTest.value++
                consoleLog('StoryheaderSingle.vue/handleExecute', 2, 'KO - retryTest: ' + retryTest.value, trace.value)
                if (continuousExec.value) {
                    if (retryTest.value < storyMaxRetry.value && storyRetry.value) {
                        status.value = retryTest.value + 1
                        executing.value = 0 // force to refresh the page
                        consoleLog('StoryheaderSingle.vue/handleExecute', 2, "KO - Let's try again!", trace.value)
                        // wait a few seconds (define in the golbal parameter)
                        //await handleExecute()
                        resetLog.value = 0
                        let delay = storyWaitRetry.value * 1000
                        setTimeout(async () => await handleExecute(), delay)
                    } else {
                        continuousExec.value = false
                        status.value = 0
                        await loadReferenceData(dashboardStoryheaderID.value)
                    }

                } else {
                    resetLog.value = 1
                    await loadReferenceData(dashboardStoryheaderID.value)
                }
            }

            executing.value = 0 // force to refresh the page
            mainTitle.value = projectName.value + ' / ' + subprojectName.value

        }



        // --------------------------------------------------------------------------
        // User ask to stop in emergency a story
        // --------------------------------------------------------------------------
        const handleEmergency = async () => {
            consoleLog('Dashboard.vue/handleEmergency', 2, 'User ask to stop in, emergency a story', trace.value)
            continuousExec.value = false
            await storeReference('Emergency Stop', 1, 'Reset the emergency stop', projectID.value, userID.value, trace.value)
            status.value = -1
            resetLog.value = 1
            executing.value = 0 // force to refresh the page
        }


        // --------------------------------------------------------------------------
        // User wants to copy a value into the clipboard
        // --------------------------------------------------------------------------
        const handleClipboard = async (value, clipboardNo, clipId) => {
            consoleLog('Dashboard.vue/handleClipboard', 2, 'value: ' + value, trace.value)
            clipboardID.value = clipId
            try {
                await toClipboard(value)
                consoleLog('Dashboard.vue/handleClipboard', 2, 'Copy to the clipboard!', trace.value)
                if (clipboardNo == 1) {
                    clipboard1.value = !clipboard1.value
                    setTimeout(() => clipboard1.value = 0, 2000)
                } else {
                    clipboard2.value = !clipboard2.value
                    setTimeout(() => clipboard2.value = 0, 2000)
                    clipboardID.value = 0
                }
            } catch (e) {
                consoleLog('Dashboard.vue/handleClipboard', 2, e, trace.value)
            }
        }


        return {
            errorMessage, styleMessage, trace, stories, selectedStory, storiesheader, selectedStoryheader, graphTitle, graphDetail, chartDataDetail, chartDataTest,
            graphLabels, graphData, status, references, executing, dataLoaded, chartOptions, chartData, chartDataPerf, graphType, GraphExecutionStatus, GraphStoryPerformance, GraphStepPerformance,
            continuousExec, executeStyle, executeTitle, subprojectName, mainTitle, clipboard1, clipboard2, clipboardID, storyRetry, AllEnvironment, selectedEnvironment,
            handleCancel, handleFocus, handleBlur, handleLogfile, handleReference, handleExecute, handleEnvironmentChange, GraphStepPerformanceDetail,
            handleStepChange, handleStoryheaderChange, handleEmergency, handleClipboard, handleGraphType, handleGraphDetail
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
    width: 80%;
    /* max-width: 2000px; */
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
    width: 70%;
}

table.scroll {
    padding: 2rem;
    overflow: auto;
    box-shadow: 0 1rem 1rem 1rem rgba(0, 0, 0, 0.2);
}

table.scroll2 {
    position: relative;
    box-shadow: 0 1rem 1rem 1rem rgba(0, 0, 0, 0.2);
    border-top-right-radius: 2rem;
    border-top-left-radius: 2rem;
    top: 0.5rem;
}


th.ref,
td.ref {
    padding: 0 0.8rem 0 0.5rem;
    text-align: left;
    border-radius: 3rem;
}

td.ref {
    background-color: #d3f5e0;
}

td.bold {
    font-weight: bold;
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
    top: 1.5%;
    left: 5%;
    width: 100px;
    height: 100px;
    animation: rotatehead 1.0s linear;
}

img.smiley {
    position: absolute;
    top: 1.5%;
    left: 60%;
    width: 80px;
    height: 80px;
}

.icon {
    font-size: 1.5rem;
}

img.smiley.spin {
    position: absolute;
    left: 60%;
    width: 80px;
    height: 80px;
    animation: spin 2s ease infinite;
}

@keyframes spin {
    to {
        -webkit-transform: rotateZ(360deg);
    }
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
    top: 10%;
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
    box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.3);
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
    margin: 0 1.5rem 0 1.5rem;
    box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.3);
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

button.stop {
    background-color: #f54b53;
}

button.stop:hover {
    background-color: white;
    color: black;
}



button.reset {
    background-color: #b7c39a;
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

@keyframes spin {
    to {
        -webkit-transform: rotateZ(360deg);
    }
}
</style>