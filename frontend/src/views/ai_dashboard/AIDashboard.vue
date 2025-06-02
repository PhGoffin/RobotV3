<template>
    <div class="my-container">

        <div class="form">
            <div class="banner">
                <h3 class="title">Dashboard</h3>
                <img src="../../assets/AIRobotV2.png" alt="robot">

                <div class="actions" style="width: 95%; left: 15px">

                    <table class="scroll2">
                        <tr>
                            <td>
                                <div class="input-container focus">
                                    <select id="selector" class="input select" @focus="handleFocus($event)"
                                        @change="handleSelectorChange()" title="Select a selector"
                                        @blur="handleBlur($event)" v-model="selectedSelector">
                                        <option v-for="selector in selectors" :key="selector.selectorID"
                                            v-bind:value="{ id: selector.selectorID, name: selector.name }">
                                            {{ selector.name }}</option>
                                    </select>
                                    <label>Selector</label>
                                    <span>Selector</span>
                                </div>
                            </td>
                            <td>
                                <div class="input-container" v-if="training == 1">
                                    <button @click="handleStatistic" class="init" title="Execute the Statistics">
                                        <i class="fa-solid fa-chart-line"></i>
                                        Statistics(3)</button>
                                </div>
                                <div class="input-container" v-else>
                                    <button @click="handleStatistic" class="init" title="Execute the Statistics">
                                        <i class="fa-solid fa-chart-line"></i>
                                        Statistics</button>
                                </div>

                            </td>

                        </tr>
                        <tr>
                            <td>
                                <div class="input-container focus">
                                    <input type="text" name="criteria" class="input" v-model="criteria"
                                        title="Label or relevant text to use to detect the element"
                                        style="width: 95%" />
                                    <label>Criteria</label>
                                    <span>Criteria</span>
                                </div>
                            </td>
                            <td>
                                <div class="actions3">
                                    <div class="input-container focus">
                                        <input type="text" name="criteria" class="input" v-model="expected"
                                            title="[For training only - Optional]: expected value of the element"
                                            style="width: 95%" />
                                        <label>Expected value</label>
                                        <span>Expected value</span>
                                    </div>
                                    <div class="input-container focus">
                                        <input type="text" name="occurence" class="input" v-model="occurence"
                                            title="[For Analysis only - Optional]: empty for all the occurences"
                                            style="width: 55%" />
                                        <label>Occurence</label>
                                        <span>Occurence</span>
                                    </div>                                    
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="2">
                                <div class="input-container focus">
                                    <select id="link" class="input select" @focus="handleFocus($event)"
                                        @change="handleLinkChange()" title="Select a link" @blur="handleBlur($event)"
                                        v-model="selectedLink" style="width: 95%">
                                        <option v-for="link in links" :key="link.id" v-bind:value="{ id: link.id }">
                                            {{ link.label }}</option>
                                    </select>
                                    <label>Link</label>
                                    <span>Link</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="input-container focus" v-if="linkID == 1">
                                    <input type="text" name="url" class="input" v-model="targetLink" />
                                    <label>URL</label>
                                    <span>URL</span>
                                </div>
                                <div class="actions3" v-if="linkID == 2">
                                    <div class="input-container focus">
                                        <input type="text" name="scenario" class="input disabled"
                                            title="Use the selector to select a scenario" v-model="targetLink"
                                            disabled  />
                                        <label>Scenario</label>
                                        <span>Scenario</span>
                                    </div>
                                    <i class="fa-solid fa-bars" @click="handleScenario()" title="Go to Scenario"> </i>
                                </div>

                            </td>
                            <td>
                                <div class="input-container">
                                    <button @click="handelGotoScreen" class="init" title="Open the webpage">
                                        <i class="fa-solid fa-globe"></i>
                                        Goto screen</button>
                                </div>
                            </td>

                        </tr>

                        <tr>
                                <div class="input-container focus" v-if="linkID == 2">
                                    <input type="text" name="comment" class="input disabled" style="width: 200%"
                                        v-model="comment" disabled />
                                    <label>Comment</label>
                                    <span>Comment</span>
                                </div>

                        </tr>


                        <tr>
                            <td>
                                <div class="input-container" v-if="started == 1">
                                    <button @click="handelAnalyseTraining" class="init" title="Train the Robot">
                                        <i class="fa-solid fa-chalkboard-user"></i>
                                        Training(1)</button>
                                </div>
                            </td>
                            <td>
                                <div class="input-container" v-if="started == 1">
                                    <button @click="handelAnalyse" class="init"
                                        title="Analyse the page with the existing patterns">
                                        <i class="fa-solid fa-binoculars"></i>
                                        Analysis</button>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div class="input-container" v-if="training == 1">
                                    <button @click="handleAttribute" class="init" title="Attribute after trainings">
                                        <i class="fa-brands fa-elementor"></i>
                                        Session(2)</button>
                                </div>
                                <div class="input-container" v-else>
                                    <button @click="handleAttribute" class="init" title="Attribute after trainings">
                                        <i class="fa-brands fa-elementor"></i>
                                        Session</button>
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
                                    <button @click="handlePattern()" class="init" title="Goto the Patterns">
                                        <i class="fa-solid fa-briefcase-medical"></i>
                                        Patterns</button>
                                </div>
                            </td>

                            <td>
                                <div class="input-container" v-if="started == 0">
                                    <button @click="handleCancel" class="cancel" title="Back to the Control Panel">
                                        <i class="fa-solid fa-ban"></i>
                                        Cancel</button>
                                </div>

                                <div class="input-container" v-else>
                                    <button @click="handleStopBrowser()" class="stop" title="Close the Browser">
                                        <i class="fa-regular fa-circle-play"></i>
                                        Stop</button>
                                </div>

                            </td>

                        </tr>

                    </table>

                </div>

            </div>


            <div class="entity">
                <div>
                    <h2>AI Robot</h2>
                    <Spinner class="spinner" v-if="execute" />
                </div>


                <table class="scroll" v-if="training == 2">
                    <tr>
                        <th class="ref">Occurence</th>
                        <th class="ref">Pattern</th>
                        <th class="ref">GUI</th>
                        <th class="ref">Value</th>
                    </tr>

                    <tr v-for="(analyze, index) in analysis" :key="analyze.Occurence">
                        <td class="ref bold label" title="Occurence of the element">
                            {{ analyze.Occurence }}
                        </td>
                        <td class="ref bold label" title="patternID detected by the detectGUI function">
                            {{ analyze.PatternID }}
                        </td>
                        <td class="ref bold value" title="XPath of the element">
                            <i class="fa-regular fa-copy" @click="handleClipboard(analyze.GUI, index)"
                                title="Copy to the clipboard" v-if="!analyze.Clipboard">&nbsp;</i>
                            <i class="fa-solid fa-copy" @click="handleClipboard(analyze.GUI, index)"
                                title="Copy to the clipboard" v-else>&nbsp;</i>
                            {{ analyze.GUI }}
                        </td>
                        <td class="ref bold value" title="Value of the element">
                            {{ analyze.Value }}
                        </td>
                    </tr>
                </table>

                <table class="scroll" v-if="training == 1">
                    <tr>
                        <th class="ref">ID</th>
                        <th class="ref">PathId</th>
                        <th class="ref">Path</th>
                        <th class="ref">Criteria/Value</th>
                    </tr>

                    <tr v-for="analyze in analysis" :key="analyze.Occurence">
                        <td class="ref bold label" title="Occurence of the element">
                            {{ analyze.Occurence }}
                        </td>
                        <td class="ref bold label" title="patternID detected by the detectGUI function">
                            {{ analyze.PatternID }}
                        </td>
                        <td class="ref bold value" title="XPath of the element">
                            {{ analyze.GUI }}
                        </td>
                        <td class="ref bold value" title="Value of the element">
                            {{ analyze.Value }}
                        </td>
                    </tr>
                </table>



                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>


            </div>
        </div>


    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';
import getAI_SelectorByProject from '../../composables/ai_selector/getAI_SelectorByProject'
import AIAnalyse from '../../composables/selenium/AIAnalyse'
import AIAnalyseScreen from '../../composables/selenium/AIAnalyseScreen'
import AITraining from '../../composables/selenium/AITraining'
import AIStopBrowser from '../../composables/selenium/AIStopBrowser'
import AIStatistic from '../../composables/selenium/AIStatistic'
import getReferenceByCode from '../../composables/reference/getReferenceByCode'
import storeReference from '../../composables/reference/storeReference'
import useClipboard from 'vue-clipboard3'



export default {
    name: 'Dashboard',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'connected', 'location', 'workspaceID', 'workspace',
        'projectID', 'projectName', 'subprojectID', 'subprojectName'],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter()
        const { toClipboard } = useClipboard()
        const trace = ref(props.trace)

        const subprojectName = ref(props.subprojectName)
        const subprojectID = ref(props.subprojectID)
        const projectName = ref(props.projectName)
        const projectID = ref(props.projectID)
        const userID = ref(props.userID)
        const userName = ref(props.currentuser)
        const role = ref(props.role)
        const location = ref(props.location)

        const selectors = ref([])
        const selectorID = ref(0)
        const selectedSelector = ref({ id: selectorID.value })
        const criteria = ref('')
        const expected = ref('')
        const occurence = ref('')
        const linkID = ref(2)
        const links = ref([{ id: '1', label: 'URL' }, { id: '2', label: 'Scenario' }])
        const selectedLink = ref({ id: linkID.value })
        const targetLink = ref('')
        const comment = ref('')

        const execute = ref(false)
        const started = ref(false)
        const training = ref(0) // 1: Analysis 2: Training
        const analysis = ref([])
        const clipboard = ref(0)


        // DEBUG
        //analysis.value.push({ 'GUI': 'this is a test', 'Occurence': 1, 'Value': 'My value', 'PatternID': 99, 'Clipboard': 0 })
        //analysis.value.push({ 'GUI': 'this is another test', 'Occurence': 2, 'Value': 'My value', 'PatternID': 99, 'Clipboard': 0 })
        //training.value = 2


        displayMsg('AIDashboard.vue', trace.value)
        consoleLog('AIDashboard.vue - props', 1, props, trace.value)

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
            consoleLog('AIDashboard.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        const clipboardFunction = async (i) => {
            analysis.value[i].Clipboard = !analysis.value[i].Clipboard
        }

        // --------------------------------------------------------------------
        // Check if we received a scenarioID from the scenario screen
        // format: scenario=<suiteID>=<scenarioID>=<comment>
        // --------------------------------------------------------------------
        console.log('Location: ', location.value)
        if (location.value != undefined) {
            if (location.value.includes('scenario=')) {
                // split the location to find the keywords
                let data = location.value.split("=");
                console.log('location: scenario - data: ', data)
                if (data[2] != undefined) targetLink.value = data[2]
                if (data[3] != undefined) comment.value = data[3]
            }
        }


        // ------------------------------------------------------------
        // Read the last analysis executed (using the reference)
        // ------------------------------------------------------------
        const getlastAnalyis = async () => {
            const code = 'AI Analysis_' + subprojectID.value
            const reference = ref([])
            const { error1, loadReference } = getReferenceByCode(projectID.value, userID.value, code)
            await loadReference(reference, trace.value)
                .then(function () {
                    consoleLog('AIDashboard.vue/loadReference - getlastAnalyis', 2, 'Code: ' + code, trace.value)
                    if (reference.value.success && reference.value.data.length) {
                        reference.value = reference.value.data
                        let dataRef = reference.value[0].label.split("=");
                        //              0              1            2        3        4         5           6           7         8
                        // Syntax <selectorID>=<selectorName>=<Criteria>=<expected><linkID>=<targetLink>=<comment>=<started>=<training>
                        selectorID.value = dataRef[0]
                        selectedSelector.value = ({ id: selectorID.value, name: dataRef[1] })
                        criteria.value = dataRef[2]
                        expected.value = dataRef[3]
                        linkID.value = dataRef[4]
                        if (dataRef[7] == 'true') dataRef[7] = 1
                        else if (dataRef[7] == 'false') dataRef[7] = 0
                        started.value = dataRef[7]
                        training.value = dataRef[8]
                        selectedLink.value = ({ id: linkID.value })
                        if (!location.value.includes('scenario=')) {
                            targetLink.value = dataRef[5]
                            comment.value = dataRef[6]
                        }
                        consoleLog('Dashboard/loadReference - getlastAnalyis', 2, 'criteria: ' + criteria.value, trace.value)
                    } else {
                        consoleLog('Dashboard/loadReference - getlastAnalyis', 2, 'No reference found!', trace.value)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Get the selector
        // --------------------------------------------------------------------------
        const loadSelectorData = async () => {
            // Get the selector 
            const { error1, getTheAI_Selector } = getAI_SelectorByProject(projectID.value)
            await getTheAI_Selector(selectors, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('AIDashboard.vue/loadSelectorData', 2, 'Selectors status: ' + selectors.value.success, trace.value)
                    if (selectors.value.success && selectors.value.data.length) {
                        selectors.value = selectors.value.data
                        selectorID.value = selectors.value[0].selectorID
                        selectedSelector.value = ({ id: selectorID.value, name: selectors.value[0].name })
                        return (1)
                    } else {
                        consoleLog('AIDashboard.vue/loadSelectorData', 2, 'No selector found!', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Load all the data
        // --------------------------------------------------------------------------
        const loadAllData = async () => {
            consoleLog('AIDashboard.vue/loadAllData', 2, '', trace.value)
            await loadSelectorData()
            await getlastAnalyis()
        }
        loadAllData()


        // --------------------------------------------------------------------------
        // User set the focus on a field
        // --------------------------------------------------------------------------
        const handleFocus = (event) => {
            event.target.parentElement.classList.add("focus")
        }


        // --------------------------------------------------------------------------
        // User wants to copy a value into the clipboard
        // --------------------------------------------------------------------------
        const handleClipboard = async (value, index) => {
            consoleLog('AIDashboard.vue/handleClipboard', 2, 'value: ' + value + ' ,index: ' + index, trace.value)
            try {
                await toClipboard(value)
                consoleLog('AIDashboard.vue/handleClipboard', 2, 'Copy to the clipboard!', trace.value)
                await clipboardFunction(index)
                console.log('Analysis: ', analysis.value)
                setTimeout(() => clipboardFunction(index), 2000)
            } catch (e) {
                consoleLog('AIDashboard.vue/handleClipboard', 2, e, trace.value)
            }
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
        // User cancel the action, Back to the control panel
        // --------------------------------------------------------------------------
        const handleCancel = async () => {
            consoleLog('AIDashboard.vue/handleCancel', 2, 'User Cancel the action', trace.value)

            context.emit('storeLocation', 'AIdashboard')
            router.push({ name: 'AIRobot' })
        }

        // --------------------------------------------------------------------------
        // User ask to go to the logfile
        // --------------------------------------------------------------------------
        const handleLogfile = () => {
            consoleLog('Dashboard.vue/handleLogfile', 2, 'User want to view the Logfile', trace.value)
            context.emit('storelocation', 'AIdashboard')
            router.push({ name: 'Logfiles' })
        }

        
        // --------------------------------------------------------------------------
        // User ask to go to the pattern
        // --------------------------------------------------------------------------
        const handlePattern = () => {
            consoleLog('Dashboard.vue/handlePattern', 2, 'User want to view the Pattern', trace.value)
            context.emit('storelocation', 'AIdashboard')
            router.push({ name: 'Patterns' })
        }


        // --------------------------------------------------------------------------
        // User ask to change a selector
        // --------------------------------------------------------------------------
        const handleSelectorChange = async () => {
            selectorID.value = selectedSelector.value.id
            consoleLog('AIDashboard.vue/handleSelectorChange', 2, 'User want to select another selector: ' + selectedSelector.value.id, trace.value)
        }


        // --------------------------------------------------------------------------
        // User ask to change a link
        // --------------------------------------------------------------------------
        const handleLinkChange = async () => {
            linkID.value = selectedLink.value.id
            consoleLog('AIDashboard.vue/handleLinkChange', 2, 'User want to select another link: ' + selectedLink.value.id, trace.value)
        }

        // --------------------------------------------------------------------------
        // User ask to go to Tag Attribute
        // --------------------------------------------------------------------------
        const handleAttribute = async () => {
            router.push({ name: 'AITraining' })
        }


        // --------------------------------------------------------------------------
        // User ask to go to the scenario
        // --------------------------------------------------------------------------
        const handleScenario = async () => {
            consoleLog('AIDashboard.vue/handleScenario', 2, 'User ask to go to scenario', trace.value)
            // store the parameters of the analyis
            const code = 'AI Analysis_' + subprojectID.value
            const label = selectedSelector.value.id + '=' + selectedSelector.value.name + '=' + criteria.value + '=' + expected.value + '=' + linkID.value + '=' + targetLink.value + '=' + comment.value + '=' + started.value + '=' + training.value
            let success = storeReference(code, label, 'Last AI Dashboard parameters', projectID.value, userID.value, trace.value)

            context.emit('storelocation', 'aidashboard')
            router.push({ name: 'Scenarios' })
        }


        // --------------------------------------------------------------------------
        // User ask to open the screen (scenario or webpage)
        // --------------------------------------------------------------------------
        const handelGotoScreen = async () => {
            consoleLog('AIDashboard.vue/handelGotoScreen', 2, 'User ask to go to screen', trace.value)
            execute.value = true
            //started.value = true
            errorMessage.value = ''
            analysis.value = []

            const selenium = ref([])
            const { error1, analysePage } = AIAnalyseScreen(projectID.value, subprojectID.value, userID.value, userName.value, selectedLink.value.id, targetLink.value, selectedSelector.value.name, criteria.value)
            await analysePage(selenium, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('AIDashboard.vue/handelGotoScreen', 2, 'Browser status: ' + selenium.value, trace.value)
                    if (selenium.value.success) {
                        selenium.value = selenium.value.data
                        DisplayError("Screen ready!", 'Info')
                        execute.value = false
                        started.value = true
                        training.value = 2
                        return (1)
                    } else {
                        consoleLog('AIDashboard.vue/handelGotoScreen', 2, 'Error while opening the screen!', trace.value)
                        DisplayError(selenium.value.message, 'Alert')
                        execute.value = false
                        started.value = true
                        return (0)
                    }
                })

            // store the parameters of the analyis
            const code = 'AI Analysis_' + subprojectID.value
            const label = selectedSelector.value.id + '=' + selectedSelector.value.name + '=' + criteria.value + '=' + expected.value + '=' + linkID.value + '=' + targetLink.value + '=' + comment.value + '=' + started.value + '=' + training.value
            let success = storeReference(code, label, 'Last AI Dashboard parameters', projectID.value, userID.value, trace.value)

        }


        // --------------------------------------------------------------------------
        // User ask to analyse a webpage/scenario
        // --------------------------------------------------------------------------
        const handelAnalyse = async () => {
            consoleLog('AIDashboard.vue/handelAnalyse', 2, 'User want to analyse a wepage/scenario ', trace.value)
            execute.value = true
            training.value = 2
            errorMessage.value = ''
            analysis.value = []

            // store the parameters of the analyis
            const code = 'AI Analysis_' + subprojectID.value
            const label = selectedSelector.value.id + '=' + selectedSelector.value.name + '=' + criteria.value + '=' + expected.value + '=' + linkID.value + '=' + targetLink.value + '=' + comment.value + '=' + started.value + '=' + training.value
            let success = storeReference(code, label, 'Last AI Dashboard parameters', projectID.value, userID.value, trace.value)

            const selenium = ref([])
            const { error1, analysePage } = AIAnalyse(projectID.value, subprojectID.value, userID.value, userName.value, selectedLink.value.id, targetLink.value, selectedSelector.value.id, criteria.value, occurence.value)
            await analysePage(selenium, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('AIDashboard.vue/handelAnalyse', 2, 'Analyse status: ' + selenium.value, trace.value)
                    if (selenium.value.success) {
                        selenium.value = selenium.value.data
                        for (let i = 0; i < selenium.value.length; i++) {
                            //console.log ('Gui: ', selenium.value[i].GUI )
                            analysis.value.push({ 'GUI': selenium.value[i].GUI, 'Occurence': selenium.value[i].Occurence, 'Value': selenium.value[i].Value, 'PatternID': selenium.value[i].PatternID, 'Clipboard': 0 })
                        }
                        DisplayError("Analysis OK!", 'Info')
                        execute.value = false
                        //started.value = false
                        return (1)
                    } else {
                        consoleLog('AIDashboard.vue/handelAnalyse', 2, 'Error during the analysis!', trace.value)
                        DisplayError(selenium.value.message, 'Alert')
                        execute.value = false
                        //started.value = false
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // User ask to prepare the training of a webpage/scenario
        // --------------------------------------------------------------------------
        const handelAnalyseTraining = async () => {
            consoleLog('AIDashboard.vue/handelAnalyseTraining', 2, 'User want to perform the training analyse a wepage/scenario ', trace.value)
            execute.value = true
            training.value = 1
            errorMessage.value = ''
            analysis.value = []

            // store the parameters of the analyis
            const code = 'AI Analysis_' + subprojectID.value
            const label = selectedSelector.value.id + '=' + selectedSelector.value.name + '=' + criteria.value + '=' + expected.value + '=' + linkID.value + '=' + targetLink.value + '=' + comment.value + '=' + started.value + '=' + training.value
            let success = storeReference(code, label, 'Last AI Dashboard parameters', projectID.value, userID.value, trace.value)

            const selenium = ref([])
            const { error1, analysePage } = AITraining(projectID.value, subprojectID.value, userID.value, userName.value, selectedLink.value.id, targetLink.value, selectedSelector.value.name, selectedSelector.value.id, criteria.value, expected.value)
            await analysePage(selenium, trace.value)
                .then(function () {
                    // check the status of the analysis
                    consoleLog('AIDashboard.vue/handelAnalyseTraining', 2, 'Training Analysis status: ' + selenium.value, trace.value)
                    if (selenium.value.success) {
                        selenium.value = selenium.value.data
                        for (let i = 0; i < selenium.value.length; i++) {
                            //console.log ('Gui: ', selenium.value[i].GUI )
                            analysis.value.push({ 'GUI': selenium.value[i].GUI, 'Occurence': selenium.value[i].Occurence, 'Value': selenium.value[i].Value, 'PatternID': selenium.value[i].PatternID, 'Clipboard': 0 })
                        }
                        DisplayError("Training Analysis OK!", 'Info')
                        execute.value = false
                        return (1)
                    } else {
                        consoleLog('AIDashboard.vue/handelAnalyseTraining', 2, 'Error during the training analysis!', trace.value)
                        DisplayError(selenium.value.message, 'Alert')
                        execute.value = false
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // User ask to close the browser
        // --------------------------------------------------------------------------
        const handleStopBrowser = async () => {
            consoleLog('AIDashboard.vue/handleStopBrowser', 2, 'User want to close the Browser', trace.value)
            const selenium = ref([])
            const { error1, StopBrowser } = AIStopBrowser()
            await StopBrowser(selenium, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('AIDashboard.vue/handleStopBrowser', 2, 'Stop Browser status: ' + selenium.value, trace.value)
                    if (selenium.value.success) {
                        DisplayError("Browser closed!", 'Info')
                        execute.value = false
                        started.value = false

                        // store the parameters of the analyis
                        const code = 'AI Analysis_' + subprojectID.value
                        const label = selectedSelector.value.id + '=' + selectedSelector.value.name + '=' + criteria.value + '=' + expected.value + '=' + linkID.value + '=' + targetLink.value + '=' + comment.value + '=' + started.value + '=' + training.value
                        let success = storeReference(code, label, 'Last AI Dashboard parameters', projectID.value, userID.value, trace.value)

                        return (1)
                    } else {
                        consoleLog('AIDashboard.vue/handleStopBrowser', 2, 'Error during the closure of the browser!', trace.value)
                        DisplayError(selenium.value.message, 'Alert')
                        execute.value = false
                        started.value = false
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // User ask to perform statistics on a selector
        // --------------------------------------------------------------------------
        const handleStatistic = async () => {
            consoleLog('AIDashboard.vue/handleStatistic', 2, 'User want to perform the statistics on a selector ', trace.value)
            execute.value = true
            errorMessage.value = ''

            const selenium = ref([])
            // projectID, subprojectID, userID, userName, selector, selectorID
            const { error1, generateStatistic } = AIStatistic(projectID.value, subprojectID.value, userID.value, userName.value, selectedSelector.value.name, selectedSelector.value.id)
            await generateStatistic(selenium, trace.value)
                .then(function () {
                    // check the status of the statistics
                    consoleLog('AIDashboard.vue/generateStatistic', 2, 'Statistics status: ' + selenium.value, trace.value)
                    if (selenium.value.success) {
                        selenium.value = selenium.value.data
                        DisplayError("Statistics OK!", 'Info')
                        execute.value = false
                        return (1)
                    } else {
                        consoleLog('AIDashboard.vue/generateStatistic', 2, 'Error during the Statistics!', trace.value)
                        DisplayError(selenium.value.message, 'Alert')
                        execute.value = false
                        return (0)
                    }
                })
        }


        return {
            errorMessage, styleMessage, trace, selectors, selectedSelector, criteria, selectedLink, links, targetLink,
            linkID, execute, analysis, expected, training, comment, clipboard, started, occurence,
            handleSelectorChange, handleFocus, handleBlur, handleLinkChange, handelAnalyse, handleCancel, handleLogfile,
            handleAttribute, handelAnalyseTraining, handleScenario, handleStatistic, handleClipboard, handlePattern,
            handelGotoScreen, handleStopBrowser
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
    position: absolute;
    width: 110%;
    min-width: 110%;
    left: -160px;
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

th.ref {
    padding: 0 0.8rem 0 0.5rem;
    font-weight: bold;
    color: blue;
    text-align: left;
    border-radius: 3rem;
}

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
    text-align: center;
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

.actions3 {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.actions3 i {
    font-size: 24px;
    margin-left: 10px;
    /* color: #bbb; */
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

.entity .message {
    position: absolute;
    bottom: 1rem;
    left: -15%;
    width: 100%;
    max-width: 100%;
    max-height: 15%;
    height: 15%;
    padding: 1.2rem;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.2);
}

.entity .message.alert {
    background-color: #d1a8a8;
    color: #fff;
}

.entity .message.warning {
    background-color: #f1d995;
    color: black;
}

.entity .message.info {
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
    left: 60%;
    width: 80px;
    height: 80px;
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
    /* background: none; */
    margin-left: 0.5rem;
    background-color: #b7c39a;
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
    background-color: #939e7c;
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

button.disabled {
    background-color: #f8a9ad;
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