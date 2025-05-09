<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">

            <div class="banner">
                <h3 class="title">{{ scenarioName }}<br>-- Rule Wizard --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <form @submit.prevent="handleSubmit">


                    <div class="actions3" v-if="filterFlag">
                        <div class="input-container focus">
                            <input type="text" name="filterfunction" class="input"
                                title="Filter the function on the name" v-model="filterFunction" style="width: 20rem" />
                            <label>Filter {{ filteredRows }}</label>
                            <span>Filter {{ filteredRows }}</span>
                        </div>
                        <i class="fa-solid fa-circle-check" @click="handleFilter" title="Submit the filter"></i>

                    </div>

                    <div class="actions3" v-if="!filterFlag">
                        <div class="input-container focus">
                            <select id="function" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                                @change="handleFunctionChange" title="Select a function" v-model="selectedFunction"
                                style="width: 20rem">
                                <option v-for="testfunction in filteredData" :key="testfunction.functionID"
                                    v-bind:value="{ id: testfunction.functionID, name: testfunction.rulefunction }">
                                    {{ testfunction.rulefunction }}</option>
                            </select>
                            <label>Function</label>
                            <span>Function</span>
                        </div>
                        <i class="fa-solid fa-filter" :class="filterFunction ? classColor : ''"
                            @click="filterFlag = !filterFlag" title="Filter functions"></i>
                    </div>

                    <div class="input-container focus" v-if="label1 && !filterFlag">

                        <div v-if="!defVal1">
                            <div class="actions">
                                <input type="text" name="param1" class="input" @focus="handleFocus($event)"
                                    @blur="handleBlur($event)" maxlength="80" v-model="parameter1" :title="tip1" />
                                <i class="fa-solid fa-spell-check" @click="handleDictionary(1)" title="Go to Dictionary"
                                    v-if="dict1"> </i>
                                <i class="fa-solid fa-database" @click="handleDataset(1)" title="Go to Dataset"
                                    v-if="data1"></i>
                                <i class="fa-regular fa-face-grin-tongue-squint" @click="handleDummy(1)"
                                    title="Go to Dummy User" v-if="dummy1"></i>
                            </div>

                        </div>
                        <div v-else>
                            <select id="listval1" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                                @change="handleListValue1Change" v-model="selectVal1" :title="tip1">
                                <option v-for="defval1 in defLists1" :key="defval1.id"
                                    v-bind:value="{ id: defval1.id }">
                                    {{ defval1.name }}</option>
                            </select>
                        </div>
                        <label>{{ label1 }}</label>
                        <span>{{ label1 }}</span>

                    </div>

                    <div class="input-container focus" v-if="label2 && !filterFlag">

                        <div v-if="!defVal2">
                            <div class="actions">
                                <input type="text" name="param2" class="input" @focus="handleFocus($event)"
                                    @blur="handleBlur($event)" maxlength="80" v-model="parameter2" :title="tip2" />
                                <i class="fa-solid fa-spell-check" @click="handleDictionary(2)" title="Go to Dictionary"
                                    v-if="dict2"> </i>
                                <i class="fa-solid fa-database" @click="handleDataset(2)" title="Go to Dataset"
                                    v-if="data2"></i>
                                <i class="fa-regular fa-face-grin-tongue-squint" @click="handleDummy(2)"
                                    title="Go to Dummy User" v-if="dummy2"></i>
                            </div>
                        </div>
                        <div v-else>
                            <select id="listval2" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                                @change="handleListValue2Change" v-model="selectVal2" :title="tip2">
                                <option v-for="defval2 in defLists2" :key="defval2.id"
                                    v-bind:value="{ id: defval2.id }">
                                    {{ defval2.name }}</option>
                            </select>
                        </div>
                        <label>{{ label2 }}</label>
                        <span>{{ label2 }}</span>
                    </div>

                    <div class="input-container focus" v-if="label3 && !filterFlag">
                        <div v-if="!defVal3">
                            <div class="actions">
                                <input type="text" name="param3" class="input" @focus="handleFocus($event)"
                                    @blur="handleBlur($event)" maxlength="80" v-model="parameter3" :title="tip3" />
                                <i class="fa-solid fa-spell-check" @click="handleDictionary(3)" title="Go to Dictionary"
                                    v-if="dict3"> </i>
                                <i class="fa-solid fa-database" @click="handleDataset(3)" title="Go to Dataset"
                                    v-if="data3"></i>
                                <i class="fa-regular fa-face-grin-tongue-squint" @click="handleDummy(3)"
                                    title="Go to Dummy User" v-if="dummy3"></i>
                            </div>
                        </div>
                        <div v-else>
                            <select id="listval3" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                                @change="handleListValue3Change" v-model="selectVal3" :title="tip3">
                                <option v-for="defval3 in defLists3" :key="defval3.id"
                                    v-bind:value="{ id: defval3.id }">
                                    {{ defval3.name }}</option>
                            </select>
                        </div>
                        <label>{{ label3 }}</label>
                        <span>{{ label3 }}</span>
                    </div>


                    <div class="input-container focus" v-if="label4 && !filterFlag">
                        <div v-if="!defVal4">
                            <div class="actions">
                                <input type="text" name="param4" class="input" @focus="handleFocus($event)"
                                    @blur="handleBlur($event)" maxlength="80" v-model="parameter4" :title="tip4" />
                                <i class="fa-solid fa-spell-check" @click="handleDictionary(4)" title="Go to Dictionary"
                                    v-if="dict4"> </i>
                                <i class="fa-solid fa-database" @click="handleDataset(4)" title="Go to Dataset"
                                    v-if="data4"></i>
                                <i class="fa-regular fa-face-grin-tongue-squint" @click="handleDummy(4)"
                                    title="Go to Dummy User" v-if="dummy4"></i>
                            </div>
                        </div>
                        <div v-else>
                            <select id="listval4" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                                @change="handleListValue4Change" v-model="selectVal4" :title="tip4">
                                <option v-for="defval4 in defLists4" :key="defval4.id"
                                    v-bind:value="{ id: defval4.id }">
                                    {{ defval4.name }}</option>
                            </select>
                        </div>
                        <label>{{ label4 }}</label>
                        <span>{{ label4 }}</span>
                    </div>

                    <div class="input-container">
                        <button v-if="!filterFlag">
                            <i class="fa-solid fa-circle-check"></i>
                            Submit</button>
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Spinner from '../../components/Spinner.vue'
import getAllFunctions from '../../composables/function/getAllFunctions'
import storeReference from '../../composables/reference/storeReference'
import getReferenceByCode from '../../composables/reference/getReferenceByCode'
import getAI_SelectorByProject from '../../composables/ai_selector/getAI_SelectorByProject'


import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'RuleWizard',
    props: ['trace', 'id', 'projectID', 'projectName', 'userID', 'userName', 'location', 'connected'],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        let actionCancel = 0;

        displayMsg('RuleWizard', trace.value)
        consoleLog('RuleWizard - props', 1, props, trace.value)

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
        const location = ref(props.location)
        const classColor = ref('green')

        const testfunctionID = ref(0)
        const rulefunction = ref('Not selected')
        const testfunctions = ref([])
        const selectedFunction = ref({ id: testfunctionID.value, name: rulefunction.value })
        const filterFunction = ref('')
        const filterFlag = ref(false)

        const selectors = ref([])

        const parameter1 = ref('')
        const defaultValue1 = ref('')
        const label1 = ref('')
        const tip1 = ref('')
        const data1 = ref(false)
        const dict1 = ref(false)
        const rule1 = ref(false)
        const dummy1 = ref(false)
        const parameter2 = ref('')
        const defaultValue2 = ref('')
        const label2 = ref('')
        const tip2 = ref('')
        const data2 = ref(false)
        const dict2 = ref(false)
        const rule2 = ref(false)
        const dummy2 = ref(false)
        const parameter3 = ref('')
        const defaultValue3 = ref('')
        const label3 = ref('')
        const tip3 = ref('')
        const data3 = ref(false)
        const dict3 = ref(false)
        const rule3 = ref(false)
        const dummy3 = ref(false)

        const parameter4 = ref('')
        const defaultValue4 = ref('')
        const label4 = ref('')
        const tip4 = ref('')
        const data4 = ref(false)
        const dict4 = ref(false)
        const rule4 = ref(false)
        const dummy4 = ref(false)

        const defVal1 = ref(0)
        const defVal2 = ref(0)
        const defVal3 = ref(0)
        const defVal4 = ref(0)
        const defLists1 = ref({})
        const defLists2 = ref({})
        const defLists3 = ref({})
        const defLists4 = ref({})
        const selectVal1 = ref({})
        const selectVal2 = ref({})
        const selectVal3 = ref({})
        const selectVal4 = ref({})

        const ruleID = ref(0)


        // -------------------------------------------------------------------------------
        // Check if we come from the rule (first call) or the Dataset (to fill parameters)
        // Syntax is: <rule/dataset/dictionary>=<ruleID>
        // -----------------------------------------------------------------------
        if (location.value.includes('rule=') || location.value.includes('dataset=') || location.value.includes('dictionary=')) {
            // split the location to find the keyword
            let data = location.value.split("=");
            ruleID.value = data[1]
        }



        // ---------------------------------------------
        // Compute the functiond depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('TestEdit.vue/filteredData', 2, 'computed value', trace.value)
            if (testfunctions.value.length) {
                return testfunctions.value.filter((ar) => ar.functionName.toUpperCase().includes(filterFunction.value.toUpperCase()))
            } else {
                return testfunctions.value
                filteredRows.value = ''
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })

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
            consoleLog('RuleWizard/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        // --------------------------------------------------------------------------
        // Reset the default values of the function
        // --------------------------------------------------------------------------
        const resetDefault = (position, defValue) => {
            // Reset the list
            switch (position) {
                case 1:
                    defVal1.value = 0
                    defLists1.value = {}
                    selectVal1.value = {}
                    break
                case 2:
                    defVal2.value = 0
                    defLists2.value = {}
                    selectVal2.value = {}
                    break
                case 3:
                    defVal3.value = 0
                    defLists3.value = {}
                    selectVal3.value = {}
                    break
                case 4:
                    defVal4.value = 0
                    defLists4.value = {}
                    selectVal4.value = {}
                    break
            }
        }


        // --------------------------------------------------------------------------
        // Default values for the <DATA>
        // --------------------------------------------------------------------------
        const dataDefault = (position, defValue) => {
            switch (position) {
                case 1:
                    data1.value = true
                    defaultValue1.value = defaultValue1.value.replace('<DATA>', '').trim()
                    defValue = defaultValue1.value
                    consoleLog('RuleWizard/manageDefault', 2, '------------ default value: ' + defaultValue1.value, trace.value)
                    break
                case 2:
                    data2.value = true
                    defaultValue2.value = defaultValue2.value.replace('<DATA>', '').trim()
                    defValue = defaultValue2.value
                    break
                case 3:
                    data3.value = true
                    defaultValue3.value = defaultValue3.value.replace('<DATA>', '').trim()
                    defValue = defaultValue3.value
                    break
                case 4:
                    data4.value = true
                    defaultValue4.value = defaultValue4.value.replace('<DATA>', '').trim()
                    defValue = defaultValue4.value
                    break
            }
        }

        // --------------------------------------------------------------------------
        // Default values for the <DICT>
        // --------------------------------------------------------------------------
        const dictionaryDefault = (position, defValue) => {
            switch (position) {
                case 1:
                    dict1.value = true
                    defaultValue1.value = defaultValue1.value.replace('<DICT>', '').trim()
                    defValue = defaultValue1.value
                    break
                case 2:
                    dict2.value = true
                    defaultValue2.value = defaultValue2.value.replace('<DICT>', '').trim()
                    defValue = defaultValue2.value
                    break
                case 3:
                    dict3.value = true
                    defaultValue3.value = defaultValue3.value.replace('<DICT>', '').trim()
                    defValue = defaultValue3.value
                    break
                case 4:
                    dict4.value = true
                    defaultValue4.value = defaultValue4.value.replace('<DICT>', '').trim()
                    defValue = defaultValue4.value
                    break
            }

        }

        // --------------------------------------------------------------------------
        // Default values for the <RULE>
        // --------------------------------------------------------------------------
        const ruleDefault = (position, defValue) => {
            switch (position) {
                case 1:
                    rule1.value = true
                    defaultValue1.value = defaultValue1.value.replace('<RULE>', '').trim()
                    defValue = defaultValue1.value
                    break
                case 2:
                    rule2.value = true
                    defaultValue2.value = defaultValue2.value.replace('<RULE>', '').trim()
                    defValue = defaultValue2.value
                    break
                case 3:
                    rule3.value = true
                    defaultValue3.value = defaultValue3.value.replace('<RULE>', '').trim()
                    defValue = defaultValue3.value
                    break
                case 4:
                    rule4.value = true
                    defaultValue4.value = defaultValue4.value.replace('<RULE>', '').trim()
                    defValue = defaultValue4.value
                    break
            }
        }

        // --------------------------------------------------------------------------
        // Default values for the <USER>
        // --------------------------------------------------------------------------
        const userDefault = (position, defValue) => {
            switch (position) {
                case 1:
                    dummy1.value = true
                    defaultValue1.value = defaultValue1.value.replace('<USER>', '').trim()
                    defValue = defaultValue1.value
                    break
                case 2:
                    dummy2.value = true
                    defaultValue2.value = defaultValue2.value.replace('<USER>', '').trim()
                    defValue = defaultValue2.value
                    break
                case 3:
                    dummy3.value = true
                    defaultValue3.value = defaultValue3.value.replace('<USER>', '').trim()
                    defValue = defaultValue3.value
                    break
                case 4:
                    dummy4.value = true
                    defaultValue4.value = defaultValue4.value.replace('<USER>', '').trim()
                    defValue = defaultValue4.value
                    break
            }
        }

        // --------------------------------------------------------------------------
        // Default values for the <USER>
        // --------------------------------------------------------------------------
        const selectorDefault = async (position) => {
            // We need to build a list of values -based on the table ai_selector
            let element = ''
            let counter = 0
            let myArray = []
            // Read all the data from the table ai_selector
            let ret = await loadSelectorData()
            if (ret) {
                for (let eltSelector = 0; eltSelector < selectors.value.length; eltSelector++) {
                    counter++
                    myArray.push({ id: selectors.value[eltSelector].selectorID, name: selectors.value[eltSelector].name })

                    switch (position) {
                        case 1:
                            if (counter == 1) {
                                defVal1.value = selectors.value[0].selectorID
                                if (parameter1.value == '') selectVal1.value = { id: selectors.value[0].selectorID }
                                else selectVal1.value = { id: parameter1.value }
                            }
                            defLists1.value = myArray
                            break
                        case 2:
                            if (counter == 1) {
                                defVal2.value = selectors.value[0].selectorID
                                if (parameter2.value == '') selectVal2.value = { id: selectors.value[0].selectorID }
                                else selectVal2.value = { id: parameter2.value }
                            }
                            defLists2.value = myArray
                            break
                        case 3:
                            if (counter == 1) {
                                defVal3.value = selectors.value[0].selectorID
                                if (parameter3.value == '') selectVal3.value = { id: selectors.value[0].selectorID }
                                else selectVal3.value = { id: parameter3.value }
                            }
                            defLists3.value = myArray
                            break
                        case 4:
                            if (counter == 1) {
                                defVal4.value = selectors.value[0].selectorID
                                if (parameter4.value == '') selectVal4.value = { id: selectors.value[0].selectorID }
                                else selectVal4.value = { id: parameter4.value }
                            }
                            defLists4.value = myArray
                            break
                    }
                }
            }

        }


        // --------------------------------------------------------------------------
        // Default values as an input field
        // --------------------------------------------------------------------------
        const inputfieldDefault = (position, defValue) => {
            // a simple default value is defined
            switch (position) {
                case 1:
                    defVal1.value = 0
                    defLists1.value = []
                    selectVal1.value = {}
                    if (parameter1.value == '') parameter1.value = defValue
                    if (parameter1.value == '<DICT>') parameter1.value = ''
                    else if (parameter1.value.indexOf('<DATA>') >= 0) parameter1.value = parameter1.value.replace('<DATA>', '')
                    break
                case 2:
                    defVal2.value = 0
                    defLists2.value = []
                    selectVal2.value = {}
                    if (parameter2.value == '') parameter2.value = defValue
                    if (parameter2.value == '<DICT>') parameter2.value = ''
                    else if (parameter2.value.indexOf('<DATA>') >= 0) parameter2.value = parameter2.value.replace('<DATA>', '')
                    break
                case 3:
                    defVal3.value = 0
                    defLists3.value = []
                    selectVal3.value = {}
                    if (parameter3.value == '') parameter3.value = defValue
                    if (parameter3.value == '<DICT>') parameter3.value = ''
                    else if (parameter3.value.indexOf('<DATA>') >= 0) parameter3.value = parameter3.value.replace('<DATA>', '')
                    break
                case 4:
                    defVal4.value = 0
                    defLists4.value = []
                    selectVal4.value = {}
                    if (parameter4.value == '') parameter4.value = defValue
                    if (parameter4.value == '<DICT>') parameter4.value = ''
                    else if (parameter4.value.indexOf('<DATA>') >= 0) parameter4.value = parameter4.value.replace('<DATA>', '')
                    break
            }
        }

        // --------------------------------------------------------------------------
        // Default values as a list of values
        // --------------------------------------------------------------------------
        const listDefault = (position, defValue) => {
            // We need to build a list of values - Example: 1: A, 2: B, 3: C
            let option = defValue.split(',');
            let element = ''
            let counter = 0
            let myArray = []
            for (var item in option) {
                counter++
                element = option[item].trim();
                let elt = element.split(':')
                myArray.push({ id: elt[0], name: elt[1] })

                switch (position) {
                    case 1:
                        if (counter == 1) {
                            defVal1.value = elt[0]
                            if (parameter1.value == '') selectVal1.value = { id: elt[0] }
                            else selectVal1.value = { id: parameter1.value }
                        }
                        defLists1.value = myArray
                        break
                    case 2:
                        if (counter == 1) {
                            defVal2.value = elt[0]
                            if (parameter2.value == '') selectVal2.value = { id: elt[0] }
                            else selectVal2.value = { id: parameter2.value }
                        }
                        defLists2.value = myArray
                        break
                    case 3:
                        if (counter == 1) {
                            defVal3.value = elt[0]
                            if (parameter3.value == '') selectVal3.value = { id: elt[0] }
                            else selectVal3.value = { id: parameter3.value }
                        }
                        defLists3.value = myArray
                        break
                    case 4:
                        if (counter == 1) {
                            defVal4.value = elt[0]
                            if (parameter4.value == '') selectVal4.value = { id: elt[0] }
                            else selectVal4.value = { id: parameter4.value }
                        }
                        defLists4.value = myArray
                        break
                }
            }
        }


        // --------------------------------------------------------------------------
        // Manage the default values of the function
        // --------------------------------------------------------------------------
        const manageDefault = (position, defValue) => {

            consoleLog('RuleWizard/manageDefault', 2, 'defValue: ' + defValue + ', position: ' + position, trace.value)
            // Process the default value
            if (defValue == undefined) {
                resetDefault(position, defValue)
                return
            }
            if (defValue.toUpperCase().indexOf('<DATA>') >= 0) {
                dataDefault(position, defValue)
            }
            if (defValue.toUpperCase().indexOf('<DICT>') >= 0) {
                dictionaryDefault(position, defValue)
            }
            if (defValue.toUpperCase().indexOf('<RULE>') >= 0) {
                ruleDefault(position, defValue)
            }
            if (defValue.toUpperCase().indexOf('<USER>') >= 0) {
                userDefault(position, defValue)
            }

            // Build the html element input field or list of values
            if (defValue.search(":") == -1) {
                inputfieldDefault(position, defValue)
            } else if (defValue.search(":<SELECTOR>") >= 0) {
                selectorDefault(position)
            } else {
                listDefault(position, defValue)
            }
        }

        // --------------------------------------------------------------------------
        // Get all the selectors of the project
        // --------------------------------------------------------------------------
        const loadSelectorData = async () => {
            const { error1, getTheAI_Selector } = getAI_SelectorByProject(projectID.value)
            return await getTheAI_Selector(selectors, trace.value)
                .then(function () {
                    consoleLog('TestEdit.vue/loadSelectorData', 2, '', trace.value)
                    if (selectors.value.success && selectors.value.data.length) {
                        selectors.value = selectors.value.data
                        consoleLog('TestEdit/loadSelectorData', 2, selectors, trace.value)
                        return (1)
                    } else {
                        consoleLog('TestEdit/loadSelectorData', 2, 'No selectors found!', trace.value)
                        DisplayError('Internal Error in the loading of selectors :<br>' + selectors.value.message, 'Alert')

                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Load the reference from the code: 'RuleWizard'
        // --------------------------------------------------------------------------
        const loadData = async () => {
            consoleLog('RuleWizard.vue/loadData - getReference', 2, '------ get the reference for RuleWizard', trace.value)
            const reference = ref([])
            const { error, loadReference } = getReferenceByCode(projectID.value, userID.value, 'RuleWizard')
            await loadReference(reference, trace.value)
                .then(function () {
                    consoleLog('RuleWizard.vue/loadData - getReference', 2, 'Status: ' + reference.value, trace.value)
                    if (reference.value.success) {
                        // Decode the label of the reference
                        //       0                        1            2       3        4        5
                        // <rule function id>=<rule function name>=<param1>=<param2>=<param3>=<param4>
                        if (reference.value.data[0].label != undefined) {
                            // split the reference to find the keyword
                            let data = reference.value.data[0].label.split("=");
                            // Restore the function
                            selectedFunction.value.id = data[0]
                            selectedFunction.value.name = data[1]
                            // Refresh the parameters of the selected function
                            handleFunctionChange()
                            // Restore the parameters
                            parameter1.value = data[2]
                            parameter2.value = data[3]
                            parameter3.value = data[4]
                            parameter4.value = data[5]
                            if (parameter1.value == undefined) parameter1.value = ''
                            if (parameter2.value == undefined) parameter2.value = ''
                            if (parameter3.value == undefined) parameter3.value = ''
                            if (parameter4.value == undefined) parameter4.value = ''
                            manageDefault(1, defaultValue1.value)
                            manageDefault(2, defaultValue2.value)
                            manageDefault(3, defaultValue3.value)
                            manageDefault(4, defaultValue4.value)
                        }
                    }
                })
        }




        // --------------------------------------------------------------------------
        // Save the data in the reference with the code: 'RuleWizard'
        // --------------------------------------------------------------------------
        const saveData = async (resetFlag) => {
            if (parameter1.value == undefined) parameter1.value = ''
            if (parameter2.value == undefined) parameter2.value = ''
            if (parameter3.value == undefined) parameter3.value = ''
            if (parameter4.value == undefined) parameter4.value = ''
            let label = ''
            if (!resetFlag) label = selectedFunction.value.id + "=" + selectedFunction.value.name + '=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value
            consoleLog('RuleWizard.vue/saveData - storeReference', 2, '------ store the reference for RuleWizard: ' + label, trace.value)
            // code, label, comment, projectID, userID
            let status = await storeReference('RuleWizard', label, 'temporary wizard save', projectID.value, userID.value, trace.value)
            consoleLog('RuleWizard.vue/saveData - storeReference', 2, '------ store status: ' + status, trace.value)

            return 1
        }

        // --------------------------------------------------------------------------
        // Load all the testfunctions data
        // --------------------------------------------------------------------------
        const loadAllFunctions = async () => {
            const { error1, loadFunction } = getAllFunctions()
            return await loadFunction(testfunctions, trace.value)
                .then(function () {
                    consoleLog('RuleWizard/getAllFunctions', 2, '', trace.value)
                    if (testfunctions.value.success && testfunctions.value.data.length) {
                        testfunctions.value = testfunctions.value.data
                        //consoleLog('RuleWizard/getAllFunctions', 2, testfunctions.value, trace.value)
                        consoleLog('RuleWizard/getAllFunctions', 2, "OK", trace.value)
                        return (1)
                    } else {
                        consoleLog('RuleWizard/getAllFunctions', 2, 'No rule function found!', trace.value)
                        DisplayError('Internal Error in the loading of rules functions:<br>' + testfunctions.value.message, 'Alert')
                        return (0)
                    }
                }).then(function (res) {
                    // Filter the data based on the rulefunction
                    if (res) {
                        testfunctions.value = testfunctions.value.filter((ar) => ar.rulefunction != '')
                        selectedFunction.value = ({ id: testfunctions.value[0].functionID, name: testfunctions.value[0].rulefunction })
                        //consoleLog('RuleWizard/getAllFunctions - filtered data', 2, testfunctions.value, trace.value)
                        consoleLog('RuleWizard/getAllFunctions', 2, 'handleFunctionChange()', trace.value)
                        handleFunctionChange()
                        return res
                    }
                })
        }


        // --------------------------------------------------------------------------
        // refresh the parameters
        // --------------------------------------------------------------------------
        const refreshParameters = async () => {
            consoleLog('RuleWizard/refreshParameters', 2, 'loadData()', trace.value)
            await loadData()
            consoleLog('4. RuleWizard/refreshParameters', 2, 'location: ' + location.value, trace.value)
            if (location.value.includes('dictionary=') ||
                location.value.includes('dataset=') ||
                location.value.includes('dummy=')) {
                // split the location to find the keyword
                //           0         1          2           3        4       5        6
                // syntax <entity>=<ruleID>=<parameter Nb>=<param1>=<param2>=<param3>=<param4>
                let data = location.value.split("=");
                if (data[2] != undefined) {
                    if (data[2] == '1') parameter1.value = data[3]
                    else if (data[2] == '2') parameter2.value = data[4]
                    else if (data[2] == '3') parameter3.value = data[5]
                    else if (data[2] == '4') parameter4.value = data[6]
                }
                console.log('4.1 Data: ', data)
                manageDefault(1, defaultValue1.value)
            }
        }

        const loadAllData = async () => {
            // Load all the functions and refresh the parameters
            consoleLog('RuleWizard/loadAllData', 2, 'loadAllData()', trace.value)
            await loadAllFunctions()
            await refreshParameters()
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
        // User cancel the action, leave the screen and returns to the list
        // --------------------------------------------------------------------------
        const handleCancel = async () => {
            consoleLog('RuleWizard/handleCancel', 2, 'User Cancel the action', trace.value)
            context.emit('storelocation', 'controlpanel')
            actionCancel = 1
            // Reset the reference
            let ret = await saveData(1)
            router.push({ name: 'RuleEdit', params: { id: ruleID.value } })
        }

        // --------------------------------------------------------------------------
        // User select another function, update the parameter name and the tip
        // --------------------------------------------------------------------------
        const handleFunctionChange = async () => {
            consoleLog('RuleWizard/handleFunctionChange', 2, 'User select another function: ' + selectedFunction.value.id, trace.value)

            // Reset the values
            data1.value = false
            dict1.value = false
            rule1.value = false
            dummy1.value = false
            data2.value = false
            dict2.value = false
            rule2.value = false
            dummy2.value = false
            data3.value = false
            dict3.value = false
            rule3.value = false
            dummy3.value = false
            data4.value = false
            dict4.value = false
            rule4.value = false
            dummy4.value = false

            // Filter the list of function to get the one selected by the user and reset the values 
            testfunctions.value.filter(item => item.functionID == selectedFunction.value.id)
                .forEach(item => {
                    parameter1.value = ''
                    defaultValue1.value = item.defaultValue1
                    manageDefault(1, defaultValue1.value)
                    label1.value = item.parameter1
                    tip1.value = item.tip1
                    parameter2.value = ''
                    defaultValue2.value = item.defaultValue2
                    manageDefault(2, defaultValue2.value)
                    label2.value = item.parameter2
                    tip2.value = item.tip2
                    parameter3.value = ''
                    defaultValue3.value = item.defaultValue3
                    manageDefault(3, defaultValue3.value)
                    label3.value = item.parameter3
                    tip3.value = item.tip3
                    parameter4.value = ''
                    defaultValue4.value = item.defaultValue4
                    manageDefault(4, defaultValue4.value)
                    label4.value = item.parameter4
                    tip4.value = item.tip40

                })
        }

        // --------------------------------------------------------------------------
        // User select a value in the list for the parameter 1
        // --------------------------------------------------------------------------
        const handleListValue1Change = () => {
            consoleLog('RuleWizard/handleListValue1Change', 2, 'User selects a default value in the list: ' + selectVal1.value.id, trace.value)
            parameter1.value = selectVal1.value.id
        }

        // --------------------------------------------------------------------------
        // User select a value in the list for the parameter 2
        // --------------------------------------------------------------------------
        const handleListValue2Change = () => {
            consoleLog('RuleWizard/handleListValue2Change', 2, 'User selects a default value in the list: ' + selectVal2.value.id, trace.value)
            parameter2.value = selectVal2.value.id
        }

        // --------------------------------------------------------------------------
        // User select a value in the list for the parameter 3
        // --------------------------------------------------------------------------
        const handleListValue3Change = () => {
            consoleLog('RuleWizard/handleListValue3Change', 2, 'User selects a default value in the list: ' + selectVal3.value.id, trace.value)
            parameter3.value = selectVal3.value.id
        }

        // --------------------------------------------------------------------------
        // User select a value in the list for the parameter 4
        // --------------------------------------------------------------------------
        const handleListValue4Change = () => {
            consoleLog('RuleWizard/handleListValue4Change', 2, 'User selects a default value in the list: ' + selectVal4.value.id, trace.value)
            parameter4.value = selectVal4.value.id
        }

        const handleFilter = () => {
            filterFlag.value = !filterFlag.value
            if (!filteredData.value.length) {
                filterFunction.value = ''
            }
            selectedFunction.value = ({ id: filteredData.value[0].functionID, name: filteredData.value[0].rulefunction })
            handleFunctionChange()
            consoleLog('RuleWizard/handleFilter', 2, 'id: ' + selectedFunction.value.id + ', name: ' + selectedFunction.value.name, trace.value)

        }

        // --------------------------------------------------------------------------
        // User ask to go to the dictionnary
        // --------------------------------------------------------------------------
        const handleDictionary = async (position) => {
            consoleLog('RuleWizard/handleDictionary', 2, 'User ask to go to dictionary - Parameter: ' + position, trace.value)
            // temporary save the data in the reference
            let ret = await saveData(0)
            if (ret) {
                if (parameter1.value == undefined) parameter1.value = ''
                if (parameter2.value == undefined) parameter2.value = ''
                if (parameter3.value == undefined) parameter3.value = ''
                if (parameter4.value == undefined) parameter4.value = ''
                switch (position) {
                    case 1:
                        context.emit('storelocation', 'rulewizard=' + ruleID.value + '=0=1=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 2:
                        context.emit('storelocation', 'rulewizard=' + ruleID.value + '=0=2=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 3:
                        context.emit('storelocation', 'rulewizard=' + ruleID.value + '=0=3=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 4:
                        context.emit('storelocation', 'rulewizard=' + ruleID.value + '=0=4=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                }
                router.push({ name: 'Dictionary', params: { id: 0 } })
            } else {
                // Error during save
                consoleLog('RuleWizard/handleDictionary', 2, 'Error during the save in the reference', trace.value)
                DisplayError('Error during the save in the reference', 'Alert')
            }
        }

        // --------------------------------------------------------------------------
        // User ask to go to the data
        // --------------------------------------------------------------------------
        const handleDataset = async (position) => {
            consoleLog('RuleWizard/handleDataset', 2, 'User ask to go to dataset - Parameter: ' + position, trace.value)
            // temporary save the data in the reference
            let ret = await saveData(0)
            if (ret) {
                if (parameter1.value == undefined) parameter1.value = ''
                if (parameter2.value == undefined) parameter2.value = ''
                if (parameter3.value == undefined) parameter3.value = ''
                if (parameter4.value == undefined) parameter4.value = ''
                switch (position) {
                    case 1:
                        context.emit('storelocation', 'rulewizard=' + ruleID.value + '=0=1=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 2:
                        context.emit('storelocation', 'rulewizard=' + ruleID.value + '=0=2=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 3:
                        context.emit('storelocation', 'rulewizard=' + ruleID.value + '=0=3=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 4:
                        context.emit('storelocation', 'rulewizard=' + ruleID.value + '=0=4=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                }
                router.push({ name: 'Data', params: { id: 0 } })
            } else {
                // Error during save
                consoleLog('RuleWizard/handleDictionary', 2, 'Error during the save in the reference', trace.value)
                DisplayError('Error during the save in the reference', 'Alert')
            }
        }


        // --------------------------------------------------------------------------
        // User ask to go to the Dummy Users
        // --------------------------------------------------------------------------
        const handleDummy = async (position) => {
            consoleLog('RuleWizard/handleDummy', 2, 'User ask to go to Dummy Users - Parameter: ' + position, trace.value)
            // temporary save the data in the reference
            let ret = await saveData(0)
            if (ret) {
                switch (position) {
                    case 1:
                        context.emit('storelocation', 'rulewizard=0=0=1=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 2:
                        context.emit('storelocation', 'rulewizard=0=0=2=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 3:
                        context.emit('storelocation', 'rulewizard=0=0=3=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 4:
                        context.emit('storelocation', 'rulewizard=0=0=4=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                }
                router.push({ name: 'Dummy Users' })
            } else {
                // Error during save
                consoleLog('RuleWizard/handleDictionary', 2, 'Error during the save in the reference', trace.value)
                DisplayError('Error during the save in the reference', 'Alert')
            }
        }


        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = async () => {
            if (actionCancel == 1) return 1

            if (!selectedFunction.value.id) {
                DisplayError('Please, select a function', 'Warning')
                return 0
            }
            let returnValue = selectedFunction.value.name + ': '
            if (defVal1.value) parameter1.value = selectVal1.value.id
            if (defVal2.value) parameter2.value = selectVal2.value.id
            if (defVal3.value) parameter3.value = selectVal3.value.id
            if (defVal4.value) parameter4.value = selectVal4.value.id

            if (parameter1.value) returnValue = returnValue + parameter1.value
            if (parameter2.value) returnValue = returnValue + ', ' + parameter2.value
            if (parameter3.value) returnValue = returnValue + ', ' + parameter3.value
            if (parameter4.value) returnValue = returnValue + ', ' + parameter4.value

            // Reset the reference
            let ret = await saveData(1)
            context.emit('storelocation', 'rulewizard=' + returnValue)
            router.push({ name: 'RuleEdit', params: { id: ruleID.value } })
        }


        return {
            errorMessage, styleMessage, projectName, projectID, userID,
            testfunctions, selectedFunction, filterFunction, filterFlag, classColor, filteredData, filteredRows,
            parameter1, label1, tip1, data1, dict1, rule1, dummy1, parameter2, label2, tip2, data2, dict2, rule2, dummy2,
            parameter3, label3, tip3, data3, dict3, rule3, dummy3, parameter4, label4, tip4, data4, dict4, rule4, dummy4,
            defVal1, defVal2, defVal3, defVal4, defLists1, defLists2, defLists3, defLists4, selectVal1, selectVal2, selectVal3, selectVal4,
            handleCancel, handleSubmit, handleFocus, handleBlur, handleFunctionChange, handleFilter,
            handleListValue1Change, handleListValue2Change, handleListValue3Change, handleListValue4Change, handleDictionary, handleDataset, handleDummy
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

.actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.actions i {
    font-size: 24px;
    margin-left: 10px;
    color: #bbb;
    cursor: pointer;
}

.actions i:hover {
    color: #777;
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