<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">

            <div class="banner">
                <h3 class="title">{{ scenarioName }}<br>-- Test --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <form @submit.prevent="handleSubmit">

                    <div class="input-container focus">
                        <input type="text" name="scenario" class="input disabled" title="You cannot change the scenario"
                            v-model="scenarioName" disabled />
                        <label>Scenario</label>
                        <span>Scenario</span>
                    </div>

                    <div class="input-container focus">
                        <select id="action" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            @change="handleActionChange" title="Select an action" v-model="selectedAction">
                            <option v-for="action in actions" :key="action.actionID"
                                v-bind:value="{ id: action.actionID }">
                                {{ action.actionID }}</option>
                        </select>
                        <label>Action</label>
                        <span>Action</span>
                    </div>

                    <div class="actions3">
                        <div class="input-container textarea focus" style="width: 100%;">
                            <textarea name="comment" class="input" maxlength="255" v-model="comment"
                                @focus="handleFocus($event)" @blur="handleBlur($event)"
                                title="Enter a comment for the Business: short and precise"></textarea>
                            <label>Comment</label>
                            <span>Comment</span>
                        </div>
                        <i class="fa-solid fa-lightbulb" @click="commentType = !commentType" v-if="commentType"
                            title="Comment for the Business" style="color: #c5b807;"></i>                        
                            <i class="fa-solid fa-gear" @click="commentType = !commentType" v-if="!commentType"
                            title="Comment for the Designer" style="color: blue;"></i>                        
                    </div>

                    <div class="actions3" v-if="action == 'Step'">
                        <div class="input-container textarea focus" style="width: 100%;">
                            <textarea name="transpose" class="input" maxlength="1024" v-model="transpose"
                                @focus="handleFocus($event)" @blur="handleBlur($event)"
                                title="[Optional] Enter a technical comment to be transposed into a function"></textarea>
                            <label>Technical Comment</label>
                            <span>Technical Comment</span>
                        </div>
                        <i class="fa-solid fa-head-side-virus" @click="handleTranscribe"
                            title="Transpose the comment"></i>
                    </div>

                    <div class="input-container focus" v-if="action == 'Step'">
                        <input type="text" name="testCondition" class="input"
                            title="[Optional] Any JavaScript expression that return true or false or 'Else'"
                            v-model="testCondition" />
                        <label>Condition</label>
                        <span>Condition</span>
                    </div>

                    <div class="input-container focus" v-if="action == 'Describe'">
                        <input type="text" name="context" class="input"
                            title="[Optional] Define a context; in case of error, the execution will restart from the context failure"
                            v-model="testCondition" />
                        <label>Context</label>
                        <span>Context</span>
                    </div>


                    <div class="input-container focus" v-if="action == 'Loop'">
                        <input type="text" name="loop" class="input"
                            title="Number of cycles (can be a constant or a variable)" v-model="testCondition" />
                        <label>Max Loop</label>
                        <span>Max Loop</span>
                    </div>


                    <div class="actions3" v-if="filterFlag">
                        <div class="input-container focus" v-if="action == 'Step'">
                            <input type="text" name="filterfunction" class="input"
                                title="Filter the function on the name or the comment" v-model="filterFunction"
                                style="width: 20rem" />
                            <label>Filter {{ filteredRows }}</label>
                            <span>Filter {{ filteredRows }}</span>
                        </div>
                        <i class="fa-solid fa-circle-check" @click="handleFilter" title="Submit the filter"></i>

                    </div>

                    <div class="actions3" v-if="!filterFlag && action == 'Step'">
                        <div class="input-container focus">
                            <select id="function" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                                @change="handleFunctionChange" title="Select a function" v-model="selectedFunction"
                                style="width: 20rem">
                                <option v-for="testfunction in filteredData" :key="testfunction.functionID"
                                    v-bind:value="{ id: testfunction.functionID, name: testfunction.functionName }">
                                    {{ testfunction.functionName }}</option>
                            </select>
                            <label>Function</label>
                            <span>Function</span>
                        </div>
                        <i class="fa-solid fa-filter" :class="filterFunction ? classColor : ''"
                            @click="filterFlag = !filterFlag" title="Filter functions"></i>
                    </div>

                    <div class="input-container focus" v-if="label1 && action == 'Step' && !filterFlag">

                        <div v-if="!defVal1">
                            <div class="actions">
                                <input type="text" name="param1" class="input" @focus="handleFocus($event)"
                                    @blur="handleBlur($event)" maxlength="255" v-model="parameter1" :title="tip1" />
                                <i class="fa-solid fa-spell-check" @click="handleDictionary(1)" title="Go to Dictionary"
                                    v-if="dict1"> </i>
                                <i class="fa-solid fa-database" @click="handleDataset(1)" title="Go to Dataset"
                                    v-if="data1"></i>
                                <i class="fa-solid fa-gears" @click="handleRule(1)" title="Go to Rule" v-if="rule1"></i>
                                <i class="fa-regular fa-face-grin-tongue-squint" @click="handleDummy(1)"
                                    title="Go to Dummy User" v-if="dummy1"></i>
                                <i class="fa-solid fa-bookmark" @click="handleReference(1)" title="Go to Reference"
                                    v-if="ref1"> </i>
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

                    <div class="input-container focus" v-if="label2 && action == 'Step' && !filterFlag">

                        <div v-if="!defVal2">
                            <div class="actions">
                                <input type="text" name="param2" class="input" @focus="handleFocus($event)"
                                    @blur="handleBlur($event)" maxlength="255" v-model="parameter2" :title="tip2" />
                                <i class="fa-solid fa-spell-check" @click="handleDictionary(2)" title="Go to Dictionary"
                                    v-if="dict2"> </i>
                                <i class="fa-solid fa-database" @click="handleDataset(2)" title="Go to Dataset"
                                    v-if="data2"></i>
                                <i class="fa-solid fa-gears" @click="handleRule(2)" title="Go to Rule" v-if="rule2"></i>
                                <i class="fa-regular fa-face-grin-tongue-squint" @click="handleDummy(2)"
                                    title="Go to Dummy User" v-if="dummy2"></i>
                                <i class="fa-solid fa-bookmark" @click="handleReference(2)" title="Go to Reference"
                                    v-if="ref2"> </i>
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

                    <div class="input-container focus" v-if="label3 && action == 'Step' && !filterFlag">
                        <div v-if="!defVal3">
                            <div class="actions">
                                <input type="text" name="param3" class="input" @focus="handleFocus($event)"
                                    @blur="handleBlur($event)" maxlength="255" v-model="parameter3" :title="tip3" />
                                <i class="fa-solid fa-spell-check" @click="handleDictionary(3)" title="Go to Dictionary"
                                    v-if="dict3"> </i>
                                <i class="fa-solid fa-database" @click="handleDataset(3)" title="Go to Dataset"
                                    v-if="data3"></i>
                                <i class="fa-solid fa-gears" @click="handleRule(3)" title="Go to Rule" v-if="rule3"></i>
                                <i class="fa-regular fa-face-grin-tongue-squint" @click="handleDummy(3)"
                                    title="Go to Dummy User" v-if="dummy3"></i>
                                <i class="fa-solid fa-bookmark" @click="handleReference(3)" title="Go to Reference"
                                    v-if="ref3"> </i>
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


                    <div class="input-container focus" v-if="label4 && action == 'Step' && !filterFlag">
                        <div v-if="!defVal4">
                            <div class="actions">
                                <input type="text" name="param4" class="input" @focus="handleFocus($event)"
                                    @blur="handleBlur($event)" maxlength="255" v-model="parameter4" :title="tip4" />
                                <i class="fa-solid fa-spell-check" @click="handleDictionary(4)" title="Go to Dictionary"
                                    v-if="dict4"> </i>
                                <i class="fa-solid fa-database" @click="handleDataset(4)" title="Go to Dataset"
                                    v-if="data4"></i>
                                <i class="fa-solid fa-gears" @click="handleRule(4)" title="Go to Rule" v-if="rule3"></i>
                                <i class="fa-regular fa-face-grin-tongue-squint" @click="handleDummy(4)"
                                    title="Go to Dummy User" v-if="dummy4"></i>
                                <i class="fa-solid fa-bookmark" @click="handleReference(4)" title="Go to Reference"
                                    v-if="ref4"> </i>
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


                    <div class="input-container focus">
                        <select id="active" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            title="Select the status" v-model="selectedActive">
                            <option v-for="active in actives" :key="active.activeID"
                                v-bind:value="{ id: active.activeID }">
                                {{ active.active }}</option>
                        </select>
                        <label>Status</label>
                        <span>Status</span>
                    </div>


                    <div class="input-container">
                        <button v-if="!filterFlag">
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Spinner from '../../components/Spinner.vue'
import updateTest from '../../composables/test/updateTest'
import getAllFunctions from '../../composables/function/getAllFunctions'
import getTest from '../../composables/test/getTest'
import getAI_SelectorByProject from '../../composables/ai_selector/getAI_SelectorByProject'
import { displayMsg, consoleLog } from '../../util/debug';
import consoleAPI from '../../composables/selenium/consoleAPI'
import getFunctionByName from '../../composables/function/getFunctionByName'
import getNaturalByCode from '../../composables/ai_natural/getNaturalByCode'


export default {
    name: 'TestEdit',
    props: ['trace', 'id', 'projectID', 'projectName', 'userID', 'userName', 'location', 'connected'],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        let actionCancel = 0;


        displayMsg('TestEdit.vue', trace.value)
        consoleLog('TestEdit.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }


        const test = ref([])
        const testID = ref(props.id)
        const projectName = ref(props.projectName)
        const projectID = ref(props.projectID)
        const userID = ref(props.userID)
        const comment = ref('')
        const transpose = ref('')
        const testCondition = ref('')
        const scenarioID = ref(0)
        const testPosition = ref(0)
        const scenarioName = ref('')
        const label = ref('')
        const location = ref(props.location)
        const classColor = ref('green')

        const active = ref(1)
        const actives = ref([{ activeID: '1', active: 'Active' }, { activeID: '0', active: 'Not Active' }])
        const selectedActive = ref({ id: active.value })

        const action = ref('Step')
        const actions = ref([{ actionID: 'Describe' }, { actionID: 'It' }, { actionID: 'Step' }, { actionID: 'Loop' }, { actionID: 'End Loop' }, { actionID: 'Comment' }])
        const selectedAction = ref({ id: action.value })

        const testfunctionID = ref(0)
        const testfunctionName = ref('Not selected')
        const testfunctions = ref([])
        const selectedFunction = ref({ id: testfunctionID.value, name: testfunctionName.value })
        const filterFunction = ref('')
        const filterFlag = ref(false)
        const commentType = ref(1)

        const selectors = ref([])

        const parameter1 = ref('')
        const defaultValue1 = ref('')
        const label1 = ref('')
        const tip1 = ref('')
        const data1 = ref(false)
        const dict1 = ref(false)
        const rule1 = ref(false)
        const dummy1 = ref(false)
        const ref1 = ref(false)
        const parameter2 = ref('')
        const defaultValue2 = ref('')
        const label2 = ref('')
        const tip2 = ref('')
        const data2 = ref(false)
        const dict2 = ref(false)
        const rule2 = ref(false)
        const dummy2 = ref(false)
        const ref2 = ref(false)
        const parameter3 = ref('')
        const defaultValue3 = ref('')
        const label3 = ref('')
        const tip3 = ref('')
        const data3 = ref(false)
        const dict3 = ref(false)
        const rule3 = ref(false)
        const dummy3 = ref(false)
        const ref3 = ref(false)
        const parameter4 = ref('')
        const defaultValue4 = ref('')
        const label4 = ref('')
        const tip4 = ref('')
        const data4 = ref(false)
        const dict4 = ref(false)
        const rule4 = ref(false)
        const dummy4 = ref(false)
        const ref4 = ref(false)
        const natural1 = ref('')
        const natural2 = ref('')
        const natural3 = ref('')
        const natural4 = ref('')


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

        const natural = ref([])
        const words = ref([])
        const parser = ref([])
        const functionName = ref('')
        const functionTest = ref([])
        const naturalCondition = ref('')
        const naturalExpression = ref('')
        const result = ref('')


        // ---------------------------------------------
        // Compute the functiond depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('TestEdit.vue/filteredData', 2, 'computed value', trace.value)
            if (testfunctions.value.length) {
                return testfunctions.value.filter((ar) => ar.functionName.toUpperCase().includes(filterFunction.value.toUpperCase()) ||
                    ar.comment.toUpperCase().includes(filterFunction.value.toUpperCase()))
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
            consoleLog('TestEdit.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }

        // --------------------------------------------------------------------------
        // Display a lessage on the console
        // --------------------------------------------------------------------------
        const displayConsole = async (myTitle, myValue, myLevel, myIdent) => {
            const debug = ref([])

            const { error, consoleMsg } = consoleAPI(myTitle, myValue, myLevel, myIdent)
            await consoleMsg(debug, trace.value)
                .then(function () {
                    consoleLog('TestEdit.vue/displayConsole', 2, myTitle + myValue, trace.value)
                })
        }


        // --------------------------------------------------------------------------
        // Manage the default values of the function
        // --------------------------------------------------------------------------
        const manageDefault = async (position, defValue) => {

            consoleLog('TestEdit.vue/manageDefault', 2, 'defValue: ' + defValue + ', position: ' + position, trace.value)

            // Process the default value
            if (defValue == undefined) {
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
                return
            }

            if (defValue.toUpperCase().indexOf('<DATA>') >= 0) {
                switch (position) {
                    case 1:
                        data1.value = true
                        defaultValue1.value = defaultValue1.value.replace('<DATA>', '').trim()
                        defValue = defaultValue1.value
                        consoleLog('TestEdit.vue/manageDefault', 2, '------------ default value: ' + defaultValue1.value, trace.value)
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

            if (defValue.toUpperCase().indexOf('<DICT>') >= 0) {
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

            if (defValue.toUpperCase().indexOf('<REF>') >= 0) {
                switch (position) {
                    case 1:
                        ref1.value = true
                        defaultValue1.value = defaultValue1.value.replace('<REF>', '').trim()
                        defValue = defaultValue1.value
                        break
                    case 2:
                        ref2.value = true
                        defaultValue2.value = defaultValue2.value.replace('<REF>', '').trim()
                        defValue = defaultValue2.value
                        break
                    case 3:
                        ref3.value = true
                        defaultValue3.value = defaultValue3.value.replace('<REF>', '').trim()
                        defValue = defaultValue3.value
                        break
                    case 4:
                        ref4.value = true
                        defaultValue4.value = defaultValue4.value.replace('<REF>', '').trim()
                        defValue = defaultValue4.value
                        break
                }

            }


            if (defValue.toUpperCase().indexOf('<RULE>') >= 0) {
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

            } else if (defValue.toUpperCase().indexOf('<USER>') >= 0) {
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


            if (defValue.search(":") == -1) {
                // a simple default value is defined
                switch (position) {
                    case 1:
                        defVal1.value = 0
                        defLists1.value = []
                        selectVal1.value = {}
                        if (parameter1.value == '') parameter1.value = defValue
                        break
                    case 2:
                        defVal2.value = 0
                        defLists2.value = []
                        selectVal2.value = {}
                        if (parameter2.value == '') parameter2.value = defValue
                        break
                    case 3:
                        defVal3.value = 0
                        defLists3.value = []
                        selectVal3.value = {}
                        if (parameter3.value == '') parameter3.value = defValue
                        break
                    case 4:
                        defVal4.value = 0
                        defLists4.value = []
                        selectVal4.value = {}
                        if (parameter4.value == '') parameter4.value = defValue
                        break
                }
            } else if (defValue.search(":<SELECTOR>") >= 0) {
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

            } else {
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
                    console.log('myArray: ', myArray)

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
                        DisplayError('Internal Error in the loading of selectors :' + selectors.value.message, 'Alert')

                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Get all the testfunctions data
        // --------------------------------------------------------------------------
        const loadFunctionData = async () => {
            const { error1, loadFunction } = getAllFunctions()
            await loadFunction(testfunctions, trace.value)
                .then(function () {
                    consoleLog('TestEdit.vue/getAllFunctions', 2, '', trace.value)
                    if (testfunctions.value.success && testfunctions.value.data.length) {
                        testfunctions.value = testfunctions.value.data
                        consoleLog('TestEdit/loadReferenceData', 2, testfunctions, trace.value)
                        selectedFunction.value = ({ id: testfunctions.value[0].functionID })
                        return (1)
                    } else {
                        consoleLog('TestEdit/loadReferenceData', 2, 'No test function found!', trace.value)
                        DisplayError('Internal Error in the loading of testing function:<br>' + testfunctions.value.message, 'Alert')

                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Get the test data
        // --------------------------------------------------------------------------
        const loadTestData = async () => {
            const { error2, loadTest } = getTest(testID.value)
            await loadTest(test, trace.value)
                .then(function () {
                    consoleLog('TestEdit.vue/loadTest', 2, '------ test: ' + testID.value, trace.value)
                    if (test.value.success && test.value.data.length) {
                        test.value = test.value.data
                        consoleLog('TestEdit/loadTest', 2, test, trace.value)

                        scenarioID.value = test.value[0].scenarioID
                        scenarioName.value = test.value[0].scenario
                        action.value = test.value[0].action
                        selectedAction.value = ({ id: action.value })
                        comment.value = test.value[0].comment
                        commentType.value = test.value[0].commentType
                        transpose.value = test.value[0].transpose
                        testCondition.value = test.value[0].testCondition
                        testfunctionID.value = test.value[0].functionID
                        testfunctionName.value = test.value[0].functionName
                        testPosition.value = test.value[0].position
                        selectedFunction.value = ({ id: testfunctionID.value, name: testfunctionName.value })
                        parameter1.value = test.value[0].parameter1
                        defaultValue1.value = test.value[0].defaultValue1
                        manageDefault(1, defaultValue1.value)
                        label1.value = test.value[0].label1
                        tip1.value = test.value[0].tip1
                        parameter2.value = test.value[0].parameter2
                        defaultValue2.value = test.value[0].defaultValue2
                        manageDefault(2, defaultValue2.value)
                        label2.value = test.value[0].label2
                        tip2.value = test.value[0].tip2
                        parameter3.value = test.value[0].parameter3
                        defaultValue3.value = test.value[0].defaultValue3
                        manageDefault(3, defaultValue3.value)
                        label3.value = test.value[0].label3
                        tip3.value = test.value[0].tip3
                        parameter4.value = test.value[0].parameter4
                        defaultValue4.value = test.value[0].defaultValue4
                        manageDefault(4, defaultValue4.value)
                        label4.value = test.value[0].label4
                        tip4.value = test.value[0].tip4

                        active.value = test.value[0].active
                        selectedActive.value = ({ id: active.value })

                        // Manage the parameters value: Check if we come from the dictionary, dataset; rule, dummy vue
                        // Syntax is: dictionary/dataset=<parameterID>=<param1>=<param2>=<param3>=<param4>
                        if (location.value.includes('rule=') || location.value.includes('dummy=')) {
                            // split the location to find the keyword
                            let data = location.value.split("=");
                            if (data[1] != undefined) {
                                parameter1.value = data[2]
                                parameter2.value = data[3]
                                parameter3.value = data[4]
                                parameter4.value = data[5]
                            }
                        } else if (location.value.includes('dictionary=') || location.value.includes('dataset=') || location.value.includes('reference=')) {
                            let data = location.value.split("=");
                            if (data[2] != undefined) {
                                parameter1.value = data[3]
                                parameter2.value = data[4]
                                parameter3.value = data[5]
                                parameter4.value = data[6]
                            }
                        }
                        return (1)
                    } else {
                        consoleLog('TestEdit/loadTest', 2, 'No test found!', trace.value)
                        DisplayError('Internal Error in the loading of the detail of the test: ' + test.value.message, 'Alert')
                        return (0)
                    }
                })
        }

        const loadAllData = async () => {
            await loadFunctionData()
            // filter the functions to get only active (exclude comment and inactive)
            testfunctions.value = testfunctions.value.filter((ar) => ar.active == 1)
            selectedFunction.value = ({ id: testfunctions.value[0].functionID })
            await loadTestData()
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
        const handleCancel = () => {
            consoleLog('TestEdit.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            context.emit('storelocation', 'controlpanel=' + testPosition.value)
            actionCancel = 1
            router.push({ name: 'Tests', params: { id: scenarioID.value } })
        }

        // -----------------------------------------------------------------------------------
        // leave the screen and go to the References screen (used by the function DisplayError)
        // -----------------------------------------------------------------------------------
        const gotoTests = () => {
            router.push({ name: 'Tests', params: { id: scenarioID.value } })
        }

        // --------------------------------------------------------------------------
        // User select another function, update the parameter name and the tip
        // --------------------------------------------------------------------------
        const handleFunctionChange = async () => {
            consoleLog('TestEdit.vue/handleFunctionChange', 2, 'User select another function: ' + selectedFunction.value.id, trace.value)
            // Check if the user selects a function, not a comment
            if (selectedFunction.value.name.substring(0, 3) == '** ') {
                testfunctionID.value = 0
                testfunctionName.value = 'Not selected'
                selectedFunction.value = ({ id: testfunctionID.value, name: testfunctionName.value })
                DisplayError('Please, select a function (not a comment!)', 'Warning')
            }

            // Reset the values
            data1.value = false
            dict1.value = false
            rule1.value = false
            dummy1.value = false
            ref1.value = false
            data2.value = false
            dict2.value = false
            rule2.value = false
            dummy2.value = false
            ref2.value = false
            data3.value = false
            dict3.value = false
            rule3.value = false
            dummy3.value = false
            ref3.value = false
            data4.value = false
            dict4.value = false
            rule4.value = false
            dummy4.value = false
            ref4.value = false

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
        // User select another action, reset the variables
        // --------------------------------------------------------------------------
        const handleActionChange = () => {
            consoleLog('TestEdit.vue/handleActionChange', 2, 'User select another action: ' + selectedAction.value.id, trace.value)
            action.value = selectedAction.value.id
            parameter1.value = ('')
            label1.value = ('')
            tip1.value = ('')
            parameter2.value = ('')
            label2.value = ('')
            tip2.value = ('')
            parameter3.value = ('')
            label3.value = ('')
            tip3.value = ('')
            parameter4.value = ('')
            label4.value = ('')
            tip4.value = ('')
            testfunctionID.value = 0
            testfunctionName.value = 'Not selected'
            selectedFunction.value = ({ id: testfunctionID.value, name: testfunctionName.value })
            if (selectedAction.value.id == 'It') {
                // prefill the comment
                comment.value = 'is possible to '
            } else if (selectedAction.value.id == 'Loop') {
                // prefill the Loop
                comment.value = 'through '
            } else if (selectedAction.value.id == 'End Loop') {
                // prefill the End loop
                comment.value = 'on '
            }

        }


        // --------------------------------------------------------------------------
        // User select a value in the list for the parameter 1
        // --------------------------------------------------------------------------
        const handleListValue1Change = () => {
            consoleLog('TestEdit.vue/handleListValue1Change', 2, 'User selects a default value in the list: ' + selectVal1.value.id, trace.value)
            parameter1.value = selectVal1.value.id
        }

        // --------------------------------------------------------------------------
        // User select a value in the list for the parameter 2
        // --------------------------------------------------------------------------
        const handleListValue2Change = () => {
            consoleLog('TestEdit.vue/handleListValue2Change', 2, 'User selects a default value in the list: ' + selectVal2.value.id, trace.value)
            parameter2.value = selectVal2.value.id
        }

        // --------------------------------------------------------------------------
        // User select a value in the list for the parameter 3
        // --------------------------------------------------------------------------
        const handleListValue3Change = () => {
            consoleLog('TestEdit.vue/handleListValue3Change', 2, 'User selects a default value in the list: ' + selectVal3.value.id, trace.value)
            parameter3.value = selectVal3.value.id
        }

        // --------------------------------------------------------------------------
        // User select a value in the list for the parameter 4
        // --------------------------------------------------------------------------
        const handleListValue4Change = () => {
            consoleLog('TestEdit.vue/handleListValue4Change', 2, 'User selects a default value in the list: ' + selectVal4.value.id, trace.value)
            parameter4.value = selectVal4.value.id
        }

        const handleFilter = () => {
            filterFlag.value = !filterFlag.value
            if (!filteredData.value.length) {
                filterFunction.value = ''
            }
            selectedFunction.value = ({ id: filteredData.value[0].functionID, name: filteredData.value[0].functionName })
            handleFunctionChange()
            consoleLog('TestEdit.vue/handleFilter', 2, selectedFunction.value.id, trace.value)

        }

        // --------------------------------------------------------------------------
        // User ask to go to the dictionnary
        // --------------------------------------------------------------------------
        const handleDictionary = async (position) => {
            consoleLog('TestEdit.vue/handleDictionary', 2, 'User ask to go to dictionary - Parameter: ' + position, trace.value)
            let ret = await saveData()
            if (ret) {
                switch (position) {
                    case 1:
                        context.emit('storelocation', 'test=' + testID.value + '=0=1=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 2:
                        context.emit('storelocation', 'test=' + testID.value + '=0=2=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 3:
                        context.emit('storelocation', 'test=' + testID.value + '=0=3=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 4:
                        context.emit('storelocation', 'test=' + testID.value + '=0=4=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                }
                router.push({ name: 'Dictionary' })
            } else {
                // Error during insert found!
                consoleLog('TestEdit.vue/handleDictionary', 2, 'Message KO: ' + test.value.message, trace.value)
                DisplayError(test.value.message, 'Alert')
            }
        }


        // --------------------------------------------------------------------------
        // User ask to go to the Reference
        // --------------------------------------------------------------------------
        const handleReference = async (position) => {
            consoleLog('TestEdit.vue/handleReference', 2, 'User ask to go to reference - Parameter: ' + position, trace.value)
            let ret = await saveData()
            if (ret) {
                switch (position) {
                    case 1:
                        context.emit('storelocation', 'test=' + testID.value + '=0=1=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 2:
                        context.emit('storelocation', 'test=' + testID.value + '=0=2=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 3:
                        context.emit('storelocation', 'test=' + testID.value + '=0=3=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 4:
                        context.emit('storelocation', 'test=' + testID.value + '=0=4=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                }
                router.push({ name: 'References' })
            } else {
                // Error during insert found!
                consoleLog('TestEdit.vue/handleReference', 2, 'Message KO: ' + test.value.message, trace.value)
                DisplayError(test.value.message, 'Alert')
            }
        }

        // --------------------------------------------------------------------------
        // User ask to go to the data
        // --------------------------------------------------------------------------
        const handleDataset = async (position) => {
            consoleLog('TestEdit.vue/handleDataset', 2, 'User ask to go to dataset - Parameter: ' + position, trace.value)
            let ret = await saveData()
            if (ret) {
                //console.log ('test=' + testID.value + '=0=2=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value)
                switch (position) {
                    case 1:
                        context.emit('storelocation', 'test=' + testID.value + '=0=1=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 2:
                        context.emit('storelocation', 'test=' + testID.value + '=0=2=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 3:
                        context.emit('storelocation', 'test=' + testID.value + '=0=3=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 4:
                        context.emit('storelocation', 'test=' + testID.value + '=0=4=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                }
                router.push({ name: 'Data' })
            } else {
                // Error during insert found!
                consoleLog('TestEdit.vue/handleDataset', 2, 'Message KO: ' + test.value.message, trace.value)
                DisplayError(test.value.message, 'Alert')
            }
        }


        // --------------------------------------------------------------------------
        // User ask to go to the Dummy Users
        // --------------------------------------------------------------------------
        const handleDummy = async (position) => {
            consoleLog('TestEdit.vue/handleDummy', 2, 'User ask to go to Dummy Users - Parameter: ' + position, trace.value)

            let ret = await saveData()
            if (ret) {
                switch (position) {
                    case 1:
                        context.emit('storelocation', 'test=' + testID.value + '=0=1=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 2:
                        context.emit('storelocation', 'test=' + testID.value + '=0=2=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 3:
                        context.emit('storelocation', 'test=' + testID.value + '=0=3=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 4:
                        context.emit('storelocation', 'test=' + testID.value + '=0=4=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                }
                router.push({ name: 'Dummy Users' })
            } else {
                // Error during insert found!
                consoleLog('TestEdit.vue/handleDummy', 2, 'Message KO: ' + test.value.message, trace.value)
                DisplayError(test.value.message, 'Alert')
            }
        }

        // --------------------------------------------------------------------------
        // User ask to go to the rules
        // --------------------------------------------------------------------------
        const handleRule = async (position) => {
            consoleLog('TestEdit.vue/handleRule', 2, 'User ask to go to Rule - Parameter: ' + position, trace.value)

            let ret = await saveData()
            if (ret) {
                switch (position) {
                    case 1:
                        context.emit('storelocation', 'test=' + testID.value + '=0=1=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 2:
                        context.emit('storelocation', 'test=' + testID.value + '=0=2=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 3:
                        context.emit('storelocation', 'test=' + testID.value + '=0=3=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                    case 4:
                        context.emit('storelocation', 'test=' + testID.value + '=0=4=' + parameter1.value + '=' + parameter2.value + '=' + parameter3.value + '=' + parameter4.value)
                        break
                }
                router.push({ name: 'Rules Set' })
            } else {
                // Error during insert found!
                consoleLog('TestEdit.vue/handleRule', 2, 'Message KO: ' + test.value.message, trace.value)
                DisplayError(test.value.message, 'Alert')
            }
        }

        // --------------------------------------------------------------------------
        // Save the data
        // --------------------------------------------------------------------------
        const saveData = async () => {

            if (defVal1.value) parameter1.value = selectVal1.value.id
            if (defVal2.value) parameter2.value = selectVal2.value.id
            if (defVal3.value) parameter3.value = selectVal3.value.id
            if (defVal4.value) parameter4.value = selectVal4.value.id

            consoleLog('TestEdit.vue/saveData', 2, 'save the data - testID: ' + testID.value, trace.value)
            // action, comment, functionID, test1, test2, test3, active, testID
            const { error, updateTheTest } = updateTest(action.value, comment.value, commentType.value, transpose.value, testCondition.value, selectedFunction.value.id,
                parameter1.value, parameter2.value, parameter3.value, parameter4.value, selectedActive.value.id, testID.value)
            return await updateTheTest(test, trace.value)
                .then(function () {
                    consoleLog('TestEdit.vue/handleSubmit', 2, '------ Update a test - testID: ' + testID.value + ', functionID: ' + selectedFunction.value.id + ', action: ' + action.value + ', commment: ' + comment.value, trace.value)
                    consoleLog('TestEdit.vue/handleSubmit', 2, test.value, trace.value)
                    consoleLog('TestEdit.vue/handleSubmit', 2, 'Success: ' + test.value.success, trace.value)
                    return test.value.success
                })
        }

        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = async () => {
            if (actionCancel == 1) return 1
            consoleLog('TestEdit.vue/handleSubmit', 2, 'User Submit the action - testID: ' + testID.value, trace.value)

            if (action.value == 'Step' && !selectedFunction.value.id) {
                DisplayError('Please, select a function', 'Warning')
                return 0
            }
            //context.emit('storelocation', 'controlpanel')
            context.emit('storelocation', 'controlpanel=' + testPosition.value)


            let ret = await saveData()
            if (ret) {
                consoleLog('TestEdit.vue/handleSubmit', 2, 'Message OK: ' + test.value.message, trace.value)
                DisplayError(test.value.message, 'Info', gotoTests)
            } else {
                // Error during insert found!
                consoleLog('TestEdit.vue/handleSubmit', 2, 'Message KO: ' + test.value.message, trace.value)
                DisplayError(test.value.message, 'Alert')
            }
        }


        // --------------------------------------------------------------------------
        // --------------------------------------------------------------------------
        // ***********************    Natural Language   ****************************
        // --------------------------------------------------------------------------
        // --------------------------------------------------------------------------

        // --------------------------------------------------------------------------
        // Remove useless words in the sentence
        // --------------------------------------------------------------------------
        const doRemove = async () => {

            let tempArray = []
            for (let i = 0; i < words.value.length; i++) {

                if (words.value[i] == ' ' || words.value[i] == '') continue

                // Check if the word is in the natural Reject
                let code = '@Reject_' + words.value[i].toLowerCase()
                const { error, loadNatural } = getNaturalByCode(code, 'EN', 1)
                await loadNatural(natural, trace.value)
                    .then(function () {
                        consoleLog('TestEdit.vue/doRemove', 2, '------ natural: ' + code, trace.value)
                        if (natural.value.success && natural.value.data.length) {
                            natural.value = natural.value.data
                        } else {
                            // if the last character is a comma, remove it
                            if (words.value[i][words.value[i].length - 1] == ',') words.value[i] = words.value[i].substring(0, words.value[i].length - 1)
                            // copy the word in a temporary array
                            tempArray.push(words.value[i])
                        }
                    })
            } // end for

            // Reset the words with the rejected words removed
            words.value = tempArray
            console.log('Temp Array', tempArray)
            tempArray = []

        }


        // --------------------------------------------------------------------------
        // Select the function in the list
        // --------------------------------------------------------------------------
        const selectFunction = async (name) => {
            for (let i = 0; i < testfunctions.value.length; i++) {
                if ('#' + testfunctions.value[i].functionName == name) {
                    selectedFunction.value = ({ id: testfunctions.value[i].functionID, name: testfunctions.value[i].functionName })
                    await handleFunctionChange()
                }
            }
        }

        // --------------------------------------------------------------------------
        // Select a value in the list
        // --------------------------------------------------------------------------
        const selectValue = async (id, param) => {
            if (param == undefined || param == '') return
            let defList = []
            let selectVal = 0
            if (id == 1) defList = defLists1.value
            else if (id == 2) defList = defLists2.value
            else if (id == 3) defList = defLists3.value
            else if (id == 4) defList = defLists4.value
            param = param.toLowerCase()
            for (let i = 0; i < defList.length; i++) {
                if (defList[i].name.toString().toLowerCase().indexOf(param) >= 0) selectVal = defList[i].id
            }
            if (selectVal) {
                //await displayConsole('selectd value: '  , selectVal)
                if (id == 1) selectVal1.value.id = selectVal
                else if (id == 2) selectVal2.value.id = selectVal
                else if (id == 3) selectVal3.value.id = selectVal
                else if (id == 4) selectVal4.value.id = selectVal
            }
        }


        // --------------------------------------------------------------------------
        // Clean function parameter
        // --------------------------------------------------------------------------
        const cleanFunctionParameter = async (parameter) => {
            if (parameter == undefined) return ''
            parameter = parameter.replace('<DICT>', '')
            parameter = parameter.replace('<DATA>', '')
            parameter = parameter.replace('<REF>', '')
            parameter = parameter.replace('<RULE>', '')
            parameter = parameter.replace('<USER>', '')
            parameter = parameter.replace(':<SELECTOR>', '')
            return parameter
        }

        // --------------------------------------------------------------------------
        // Clean the parser, remove all the value starting with <
        // --------------------------------------------------------------------------
        const cleanParser = async () => {
            let tempArray = []
            for (let i = 0; i < parser.value.length; i++) {
                // skip the function
                if (parser.value[i][0] != '<') tempArray.push(parser.value[i])
            }
            // Reset the words with the rejected words removed
            parser.value = tempArray
            tempArray = []
        }

        // --------------------------------------------------------------------------
        // Remove duplicated words or <N/A>
        // --------------------------------------------------------------------------
        const doRemoveDuplicate = async () => {

            let tempArray = []
            let skip = 0
            for (let i = 0; i < words.value.length; i++) {
                if (skip > 0) {
                    skip--
                    continue
                }
                if (words.value[i] == '<N/A>') continue

                // exclude unused words not starting by &, <, #, " and not numeric
                if (! '&<#"'.includes(words.value[i][0]) && words.value[i] != 'variable') {
                    // if the word is not a numeric value, skip it
                    if (isNaN(words.value[i] * 1)) {
                        // Variable is a string
                        continue
                    }
                }

                // exclude duplicate word
                if (i + 1 <= words.value.length) {
                    if (words.value[i] == words.value[i + 1]) {
                        skip = 1
                    }
                    tempArray.push(words.value[i])
                }

            } // end for

            // Reset the words with the rejected words removed
            words.value = tempArray
            //console.log('Temp Array', tempArray)
            tempArray = []
        }


        // --------------------------------------------------------------------------
        // Get function info
        // --------------------------------------------------------------------------
        const getFunctionInfo = async (name) => {

            // Remove the character #
            //await displayConsole ('getFunctionInfo', name)
            name = name.replace('#', '')
            // Check if the word is in the natural Function
            const { error, getTheFunction } = getFunctionByName(name)
            await getTheFunction(functionTest, trace.value)
                .then(function () {
                    consoleLog('TestEdit.vue/getFunctionInfo', 2, '------ function: ' + name, trace.value)
                    if (functionTest.value.success && functionTest.value.data.length) {
                        functionTest.value = functionTest.value.data
                        console.log('Find the function: ' + functionTest.value[0].functionName)
                        //displayConsole('Find info on the function: ' , functionTest.value[0].functionName)
                        //console.log ('§§§§§§§§§§§§§§§§§§§§§§§§§§§  FUNCTION ', functionTest.value[0])
                        //functionComment.value = functionTest.value[0].comment
                        parameter1.value = functionTest.value[0].defaultValue1
                        defaultValue1.value = functionTest.value[0].defaultValue1
                        manageDefault(1, defaultValue1.value)
                        natural1.value = functionTest.value[0].natural1
                        label1.value = functionTest.value[0].parameter1
                        tip1.value = functionTest.value[0].tip1
                        parameter2.value = functionTest.value[0].defaultValue2
                        defaultValue2.value = functionTest.value[0].defaultValue2
                        manageDefault(2, defaultValue2.value)
                        natural2.value = functionTest.value[0].natural2
                        label2.value = functionTest.value[0].parameter2
                        tip2.value = functionTest.value[0].tip2
                        parameter3.value = functionTest.value[0].defaultValue3
                        defaultValue3.value = functionTest.value[0].defaultValue3
                        manageDefault(3, defaultValue3.value)
                        natural3.value = functionTest.value[0].natural3
                        label3.value = functionTest.value[0].parameter3
                        tip3.value = functionTest.value[0].tip3
                        parameter4.value = functionTest.value[0].defaultValue4
                        defaultValue4.value = functionTest.value[0].defaultValue4
                        manageDefault(4, defaultValue4.value)
                        natural4.value = functionTest.value[0].natural4
                        label4.value = functionTest.value[0].parameter4
                        tip4.value = functionTest.value[0].tip4
                    } else {
                        DisplayError("Cannot find the function: " + name, 'Alert')
                        functionName.value = '<N/A>'

                    }
                })
        }


        // --------------------------------------------------------------------------
        // Search for Function(s)
        // --------------------------------------------------------------------------
        const doSearchFunction = async (passNb) => {

            let nbFunction = 0
            let data = ''
            let code = ''

            for (let i = 0; i < words.value.length; i++) {
                // we have already a function name 
                if (functionName.value != '<N/A>') {
                    await displayConsole('Function name:', functionName.value)
                    nbFunction++
                    break
                }

                // Compute the deep of the associated functions
                let deep = 1
                if (words.value[i][0] == '#') {
                    // we have already detected a function
                    nbFunction++
                    break
                } else if (words.value[i][0] == '<') {
                    //console.log ('======================= DEEP DEEP ================' + words.value)
                    for (let j = i + 1; j < words.value.length; j++) {
                        if (words.value[j][0] == '<') {
                            console.log('======================= DEEP' + words.value[j])
                            deep++
                        } else {
                            // leave the loop
                            break
                        }
                    }
                    // check for each association, try to find a match
                    for (let id = 0; id < deep; id++) {
                        data = ''
                        // combine the attributes
                        for (let j = 0; j < deep; j++) {
                            data = data + words.value[i + j].toLowerCase()
                            //await displayConsole ('Deep: ' + deep + ' -- Combine: words[' + i + ' + ' + j + '] = ' + words.value[i + j], data)
                        }

                        // Check if the functions are in the natural attribute dictionary
                        code = '@Function_' + data
                        console.log('@@@@@@@@@@@@@@@@@@@ deep: ' + deep + ', code:', code)
                        //await displayConsole ('Function Deep: ' + deep, 'code:' + code)

                        const { error, loadNatural } = getNaturalByCode(code, 'EN', 1)
                        await loadNatural(natural, trace.value)
                            .then(function () {
                                consoleLog('TestEdit.vue/doSearchAttribute', 2, '------ natural: ' + code, trace.value)
                                if (natural.value.success && natural.value.data.length) {
                                    natural.value = natural.value.data
                                    words.value[i] = natural.value[0].label
                                    //displayConsole('Find the function: ', words.value[i])
                                    console.log('Find the function: ' + words.value[i])
                                    displayConsole('Find the function: ', words.value[i])
                                    if (words.value[i][0] == '#') {
                                        functionName.value = words.value[i]
                                        nbFunction++
                                        id = deep + 1
                                    }
                                    console.log('$$$$$$$$$$$$$$$$$$$$ id + 1 = ' + (id + 1) + ' < deep: ' + deep + ' i: ' + i)
                                    console.log('words: ', words.value)
                                    for (let j = i + 1; j < i + deep; j++) {
                                        words.value[j] = '<N/A>'
                                        console.log('$$$$$$$$$$$$$$$$$$$$  RESET word[' + (j) + '] = ' + words.value[j])
                                    }
                                    id = deep + 1
                                } else {
                                    //displayConsole ('Cannot find attribute!')
                                    deep--
                                    id--
                                }
                            })
                    } // end loop
                    //displayConsole ('End of the loop <')

                } else {
                    // Check if the word is in the natural Function dictionary
                    let code = '@Function_' + words.value[i].toLowerCase()
                    const { error, loadNatural } = getNaturalByCode(code, 'EN', 1)
                    await loadNatural(natural, trace.value)
                        .then(function () {
                            consoleLog('TestEdit.vue/doSearchFunction', 2, '------ natural: ' + code, trace.value)
                            if (natural.value.success && natural.value.data.length) {
                                natural.value = natural.value.data
                                words.value[i] = natural.value[0].label
                                console.log('Find the function: ' + words.value[i])
                                //displayConsole('Find the function: ', words.value[i])
                                if (words.value[i][0] == '#') {
                                    functionName.value = words.value[i]
                                    nbFunction++
                                }
                            }
                        })
                }
            } // end for

            // check for errors
            if (nbFunction != 0) {
                // Search information on the function
                filterFunction.value = ''
                await getFunctionInfo(functionName.value)
                await selectFunction(functionName.value)
                parameter1.value = await cleanFunctionParameter(parameter1.value)
                parameter2.value = await cleanFunctionParameter(parameter2.value)
                parameter3.value = await cleanFunctionParameter(parameter3.value)
                parameter4.value = await cleanFunctionParameter(parameter4.value)
            }
        }


        // --------------------------------------------------------------------------
        // Search for Attribute(s)
        // --------------------------------------------------------------------------
        const doSearchAttribute = async () => {

            let data = ''
            let code = ''
            for (let i = 0; i < words.value.length; i++) {

                if (words.value[i] == '<N/A>') continue
                // Compute the deep of the associated attributes
                let deep = 1
                if (words.value[i][0] == '<') {
                    for (let j = i + 1; j < words.value.length; j++) {
                        if (words.value[j][0] == '<') {
                            deep++
                        } else {
                            // leave the loop
                            break
                        }
                    }
                    // check for each association, try to find a match
                    for (let id = 0; id < deep; id++) {
                        data = ''
                        // combine the attributes
                        for (let j = 0; j < deep; j++) {
                            data = data + words.value[i + j].toLowerCase()
                            //await displayConsole ('Deep: ' + deep + ' -- Combine: words[' + i + ' + ' + j + '] = ' + words.value[i + j], data)
                        }

                        // Check if the attributes are in the natural attribute dictionary
                        code = '@Attribute_' + data
                        //await displayConsole ('Deep: ' + deep, 'code:' + code)

                        const { error, loadNatural } = getNaturalByCode(code, 'EN', 1)
                        await loadNatural(natural, trace.value)
                            .then(function () {
                                consoleLog('NaturalProto.vue/doSearchAttribute', 2, '------ natural: ' + code, trace.value)
                                if (natural.value.success && natural.value.data.length) {
                                    natural.value = natural.value.data
                                    words.value[i] = natural.value[0].label
                                    console.log('Find the attribute: ' + words.value[i])
                                    //displayConsole ('Find the attribute: ', words.value[i])
                                    //console.log('words: ', words.value)
                                    // to be reviewed
                                    for (let j = i + 1; j < i + deep; j++) {
                                        words.value[j] = '<N/A>'
                                    }
                                    id = deep + 1
                                } else {
                                    //displayConsole ('Cannot find attribute!')
                                    deep--
                                    id--
                                }
                            })
                    } // end loop
                    //displayConsole ('End of the loop <')

                } else {
                    // Check if the word is in the natural attribute
                    code = '@Attribute_' + words.value[i].toLowerCase()
                    const { error, loadNatural } = getNaturalByCode(code, 'EN', 1)
                    await loadNatural(natural, trace.value)
                        .then(function () {
                            consoleLog('NaturalProto.vue/doSearchAttribute', 2, '------ natural: ' + code, trace.value)
                            if (natural.value.success && natural.value.data.length) {
                                natural.value = natural.value.data
                                words.value[i] = natural.value[0].label
                                //console.log('Find the attribute: ' + words.value[i])
                            }
                        })
                }
            } // end for
        }


        // --------------------------------------------------------------------------
        // Display result
        // --------------------------------------------------------------------------
        const doResult = async (id) => {

            // Remove duplicate
            await doRemoveDuplicate()


            //await displayConsole ("Words 99: ", words.value)

            if (id == 1) result.value = ''
            else result.value = result.value + '\n\n'
            let sep = ''
            let condition = 0
            let expression = 0
            let skip = 0
            for (let i = 0; i < words.value.length; i++) {
                if (skip > 0) {
                    skip--
                    continue
                }
                let data = words.value[i].replace(/<space>/g, ' ')

                switch (data) {
                    case '&expression:start':
                        data = 'Expression: '
                        naturalExpression.value = ''
                        condition = 0
                        expression = 1
                        break
                    case '&condition:start':
                        data = 'Condition: '
                        naturalCondition.value = ''
                        condition = 1
                        expression = 0
                        break

                    case '&condition:end':
                        data = '\n'
                        if (condition == 1) condition = 0
                        if (expression == 1) expression = 0
                        sep = ''
                        break

                    case '&condition:==':
                        if (condition || expression) {
                            data = ' == '
                            if (i + 1 < words.value.length) {
                                if (words.value[i + 1] == '&condition:||') {
                                    if (i + 2 < words.value.length) {
                                        if (words.value[i + 2] == '&condition:>') {
                                            data = ' >='
                                            skip = 2
                                        } else if (words.value[i + 2] == '&condition:<') {
                                            data = ' <='
                                            skip = 2
                                        }
                                    }
                                }
                            }
                        } else data = ' = '

                        if (skip == 2 && (condition || expression)) {
                            if (i + 3 < words.value.length) {
                                if (words.value[i + 3] == '&condition:end') {
                                    DisplayError('Please enter the value for the condition!', 'Alert')
                                    return
                                }
                            } else {
                                DisplayError("I don't understand the condition!", 'Alert')
                                return
                            }
                        } else if (!skip && (condition || expression)) {
                            if (i + 1 < words.value.length) {
                                if (words.value[i + 1] == '&condition:end') {
                                    DisplayError('Please enter the value for the condition!', 'Alert')
                                    return
                                }
                            } else {
                                DisplayError("I don't understand the condition!", 'Alert')
                                return
                            }
                        }
                        //if (id == 2) parser.value.push(data)
                        break

                    case '&condition:>':
                        if (condition || expression) {
                            data = ' > '
                            if (i + 1 < words.value.length) {
                                if (words.value[i + 1] == '&condition:||') {
                                    if (i + 2 < words.value.length) {
                                        if (words.value[i + 2] == '&condition:==') {
                                            data = ' >='
                                            skip = 2
                                        }
                                    }
                                }
                            }
                        }

                        if (skip == 2 && (condition || expression)) {
                            if (i + 3 < words.value.length) {
                                if (words.value[i + 3] == '&condition:end') {
                                    DisplayError('Please enter the value for the condition!', 'Alert')
                                    return
                                }
                            } else {
                                DisplayError("I don't understand the condition!", 'Alert')
                                return
                            }
                        } else if (!skip && (condition || expression)) {
                            if (i + 1 < words.value.length) {
                                if (words.value[i + 1] == '&condition:end') {
                                    DisplayError('Please enter the value for the condition!', 'Alert')
                                    return
                                }
                            } else {
                                DisplayError("I don't understand the condition!", 'Alert')
                                return
                            }
                        }
                        //if (id == 2) parser.value.push(data)
                        break

                    case '&condition:<':
                        if (condition || expression) {
                            data = ' > '
                            if (i + 1 < words.value.length) {
                                if (words.value[i + 1] == '&condition:||') {
                                    if (i + 2 < words.value.length) {
                                        if (words.value[i + 2] == '&condition:==') {
                                            data = ' <='
                                            skip = 2
                                        }
                                    }
                                }
                            }
                        }

                        if (skip == 2 && (condition || expression)) {
                            if (i + 3 < words.value.length) {
                                if (words.value[i + 3] == '&condition:end') {
                                    DisplayError('Please enter the value for the condition!', 'Alert')
                                    return
                                }
                            } else {
                                DisplayError("I don't understand the condition!", 'Alert')
                                return
                            }
                        } else if (!skip && (condition || expression)) {
                            if (i + 1 < words.value.length) {
                                if (words.value[i + 1] == '&condition:end') {
                                    DisplayError('Please enter the value for the condition!', 'Alert')
                                    return
                                }
                            } else {
                                DisplayError("I don't understand the condition!", 'Alert')
                                return
                            }
                        }
                        //if (id == 2) parser.value.push(data)
                        break

                    case '&condition:!':
                        data = ' ! '
                        if (condition || expression) {
                            if (i + 1 < words.value.length) {
                                if (words.value[i + 1] == '&condition:==') {
                                    data = ' !='
                                    skip = 1
                                }
                            }
                        }

                        if (skip == 1 && (condition || expression)) {
                            if (i + 2 < words.value.length) {
                                if (words.value[i + 2] == '&condition:end') {
                                    DisplayError('Please enter the value for the condition!', 'Alert')
                                    return
                                }
                            }
                        }
                        //if (id == 2) parser.value.push(data)
                        break


                    case '&condition:!=':
                        data = ' != '
                        //if (id == 2) parser.value.push(data)
                        break


                    case 'variable':
                        if (i + 1 < words.value.length) {
                            let variableName = words.value[i + 1].replace(/<space>/g, '_')
                            if (variableName[0] != '"') {
                                DisplayError('Please enter the name of the variable between quote (")', 'Alert')
                                return
                            } else {
                                data = '$' + variableName.replace(/"/g, '')
                                skip = 1
                            }

                        } else {
                            DisplayError('Please enter the name of the variable between quote (")', 'Alert')
                            return
                        }
                        if (id == 2 && !condition && !expression) parser.value.push(data)
                        break

                    default:
                        if (id == 2 && !condition && !expression && data[0] != "<") parser.value.push(data)
                        if (data[0] == '#' && (condition || expression)) {
                            data = '\n' + data
                        }
                        break


                }
                if (id == 2 && data[0] == "<") data = ''
                data = data.trim()
                if (condition) naturalCondition.value = naturalCondition.value + sep + data
                if (expression) naturalExpression.value = naturalExpression.value + sep + data
                if (!condition) {
                    result.value = result.value + sep + data
                    sep = ' '
                }
            }
            if (naturalCondition.value.length) {
                naturalCondition.value = naturalCondition.value.replace('Condition:', '').trim()
                await displayConsole('Condition: ', naturalCondition.value)
            }
            if (naturalExpression.value.length) {
                naturalExpression.value = naturalExpression.value.replace('Expression:', '').trim()
                await displayConsole('Expression: ', naturalExpression.value)
            }
            await displayConsole('Result: ', result.value)
            DisplayError('Done!', 'Info')
        }

        // --------------------------------------------------------------------------
        // Process the function parameters
        // --------------------------------------------------------------------------
        const functionParameter = async (id) => {
            let natural = ''
            let result = ''
            let defValue = ''
            let data1 = ''
            let data2 = ''
            if (id == 1) {
                natural = natural1.value
                defValue = parameter1.value
            } else if (id == 2) {
                natural = natural2.value
                defValue = parameter2.value
            } else if (id == 3) {
                natural = natural3.value
                defValue = parameter3.value
            } else if (id == 4) {
                natural = natural4.value
                defValue = parameter4.value
            }
            //console.log('!!!!!!!!!!!!!!!! id: ' + id + ', natural: ', natural)
            if (natural == undefined) return "natural " + id + " is not defined!"

            let j = natural.indexOf(':', 0)
            if (j < 0) {
                // single natural: <data>
                console.log('!!!!!!!!!!!!!!!! single data1: ')
                data1 = '&' + natural + ':'
                data1 = data1.trim()
                data2 = ''
                await displayConsole('Single data for natural: ' + natural + ', data: ' + data1)
            } else {
                // composed natural <parent>:<data>
                console.log('!!!!!!!!!!!!!!!! composed data1: ')
                data1 = '&' + natural.substring(0, j).trim()
                data2 = natural.substring(j + 1).trim()
                await displayConsole('Composed data: ' + data1 + ' - ' + data2)
            }
            if (data1 == '&dictionary') defValue = '$GUI'
            console.log('!*************************** data1: ' + data1 + ', data2: ' + data2)
            await displayConsole('Data: ' + data1, ' (' + data2 + ')')
            for (let i = 0; i < parser.value.length; i++) {
                // skip the function
                if (parser.value[i][0] == '#' || parser.value[i][0] == '<') continue
                // Process &data and &reference
                if (data1 == '&data' || data1 == '&reference') {
                    await displayConsole("Data/Reference:", parser.value[i])
                    if (parser.value[i][0] == '"') {
                        result = parser.value[i].replace(/<space>/g, ' ').trim()
                        result = result.replace(/"/g, '')
                        if (data1 == '&data' && result[0] != '$') result = '#' + result
                        parser.value[i] = '<N/A>'
                    } else if (parser.value[i][0] == '$') {
                        result = parser.value[i].trim()
                        parser.value[i] = '<N/A>'
                        return result
                    }
                    await displayConsole(data1 + ': ', result)
                    return result
                } else if (data1 == '&dictionary') {
                    await displayConsole('dictionary: ', data1)
                    if (parser.value[i + 1] == undefined || parser.value[i][0] == '"') {
                        await displayConsole('word dictionary is missing, use the current word')
                        result = parser.value[i].replace(/"/g, '')
                        if (result[0] == '$') result = result.trim()
                        else result = '@' + result.replace(/<space>/g, ' ').trim()
                        parser.value[i] = '<N/A>'
                        return result
                    } else if (parser.value[i][0] == '$') {
                        await displayConsole('word dictionary is missing, but we have a variable')
                        result = parser.value[i].trim()
                        parser.value[i] = '<N/A>'
                        return result
                    } else if (parser.value[i + 1] == undefined) {
                        await displayConsole('word dictionary is missing --> $GUI')
                        result = '$GUI'
                        return result
                    } else if (i + 1 < parser.value.length) {
                        //await displayConsole('dictionary: 1: **' + parser.value[i + 1] + '**')
                        if (parser.value[i + 1][0] == '$') {
                            await displayConsole('word dictionary is detected and we have a variable')
                            result = parser.value[i + 1].trim()
                            parser.value[i] = '<N/A>'
                            parser.value[i + 1] = '<N/A>'
                            return result
                        } else if (parser.value[i + 1][0] == '"') {
                            await displayConsole('word dictionary is detected, use the text')
                            result = parser.value[i + 1].replace(/"/g, '')
                            result = '@' + result.replace(/<space>/g, ' ').trim()
                            parser.value[i] = '<N/A>'
                            parser.value[i + 1] = '<N/A>'
                            return result
                        } else {
                            await displayConsole('word dictionary is detected but no text available --> $GUI')
                            //await displayConsole('dictionary no quote --> $GUI')
                            //await displayConsole('parser[i]: ' + parser.value[i], 'parser[i+1]: ' + parser.value[i + 1])
                            result = '$GUI'
                            return result
                        }
                    } else {
                        await displayConsole('dictionary no more parser --> $GUI')
                        result = '$GUI'
                        return result
                    }
                } else if (data1 == '&expression') {
                    await displayConsole('expression: ', data1)
                    result = naturalExpression.value
                    return result
                } else if (data1 == '&variable') {
                    await displayConsole('variable: ', parser.value[i])
                    if (parser.value[i][0] == '$') {
                        result = parser.value[i].trim()
                        parser.value[i] = '<N/A>'
                        return result
                    }
                } else {
                    // generic composed natural, take the next word
                    for (let k = i; k < parser.value.length; k++) {
                        if (k + 1 < parser.value.length) {
                            await displayConsole('generic parameter parser: ' + parser.value[k], data1)
                            if (parser.value[k][0] == '&' && parser.value[k].substring(0, data1.length) == data1) {
                                await displayConsole('Parser 1:' + parser.value[k], 'data: ' + data1)
                                let j = parser.value[k].indexOf(':', 0)
                                if (j >= 0) {
                                    result = parser.value[k].substring(j + 1).trim()
                                    if (parser.value[k].substring(0, j).trim() != '&element') parser.value[k] = '<N/A>'
                                    else parser.value[k] = '&element'
                                } else {
                                    if (data2 == 'text') {
                                        result = parser.value[k + 1].replace(/"/g, '')
                                        result = result.replace(/<space>/g, ' ').trim()
                                        parser.value[k] = '<N/A>'
                                        parser.value[k + 1] = '<N/A>'
                                    } else if (data2 == 'number') {
                                        result = parser.value[k + 1]
                                        parser.value[k] = '<N/A>'
                                        parser.value[k + 1] = '<N/A>'
                                    }
                                }
                                return result
                            } else if (data1 == "&value" && data2 != "&value") {
                                await displayConsole('Parser 2 &value:' + parser.value[k], 'data: ' + data1)
                                if (data2 == 'text') {
                                    if (parser.value[k][0] == '"') {
                                        result = parser.value[k].replace(/"/g, '')
                                        result = result.replace(/<space>/g, ' ').trim()
                                        parser.value[k] = '<N/A>'
                                    } else if (parser.value[k][0] == '$') {
                                        result = parser.value[k].trim()
                                        parser.value[k] = '<N/A>'
                                    } else if (k + 1 < parser.value.length) {
                                        // if not found, check if the next parser is a good candidate
                                        if (parser.value[k + 1][0] == '"') {
                                            result = parser.value[k + 1].replace(/"/g, '')
                                            result = result.replace(/<space>/g, ' ').trim()
                                            parser.value[k] = '<N/A>'
                                            parser.value[k + 1] = '<N/A>'
                                        }
                                    }
                                } else if (data2 == 'number') {
                                    if (parser.value[k][0] == '&') {
                                        parser.value[k] = '<N/A>'
                                        if (k + 1 < parser.value.length) k = k + 1
                                    }
                                    result = parser.value[k]
                                    parser.value[k] = '<N/A>'
                                } else {
                                    return defValue
                                }
                                return result
                            }
                        } else if (data1 == "&value") {
                            await displayConsole('Parser 3 &value:' + parser.value[k], 'data: ' + data1)
                            if (data2 == 'text') {
                                if (parser.value[k][0] == '"') {
                                    result = parser.value[k].replace(/"/g, '')
                                    result = result.replace(/<space>/g, ' ').trim()
                                    parser.value[k] = '<N/A>'
                                } else if (k + 1 < parser.value.length) {
                                    // if not found, check if the next parser is a good candidate
                                    if (parser.value[k + 1][0] == '"') {
                                        result = parser.value[k + 1].replace(/"/g, '')
                                        result = result.replace(/<space>/g, ' ').trim()
                                        parser.value[k] = '<N/A>'
                                        parser.value[k + 1] = '<N/A>'
                                    } else {
                                        //await displayConsole('Parser 3: defValue: ' + defValue)
                                        return defValue
                                    }
                                } else {
                                    //await displayConsole('Parser 3: defValue: ' + defValue)
                                    return defValue
                                }
                            } else if (data2 == 'number') {
                                if (parser.value[k][0] == '&') {
                                    parser.value[k] = '<N/A>'
                                    if (k + 1 < parser.value.length) k = k + 1
                                }
                                result = parser.value[k]
                                parser.value[k] = '<N/A>'
                            } else {
                                return defValue
                            }
                            return result
                        } else if (data1 == "&before") {
                            if (parser.value[k].indexOf(':', 0) >= 0) {
                                let data = parser.value[k].split(':')
                                result = data[1].trim()
                                await displayConsole('Parser &before:' + parser.value[k], 'data: ' + result)
                                parser.value[k] = '<N/A>'
                            } else result = defValue

                            return result
                        }
                    } // end loop
                    return defValue
                }
            }
            return defValue
        }




        // --------------------------------------------------------------------------
        // User asks to transcribe a request
        // --------------------------------------------------------------------------
        const handleTranscribe = async () => {
            consoleLog('TestEdit.vue/handleTranscribe', 2, 'User wants to transcribe a request', trace.value)

            await displayConsole('------------------------------')
            await displayConsole('--------- TRANSCRIBE ---------')
            await displayConsole('------------------------------')

            parser.value = []
            functionName.value = '<N/A>'
            naturalCondition.value = ''
            naturalExpression.value = ''

            // isolate the text between quote
            //-------------------------------
            let myComment = transpose.value
            let i = transpose.value.indexOf('"', 0)
            let j = 0
            while (i >= 0) {
                j = transpose.value.indexOf('"', i + 1)
                if (j >= 0) {
                    // extract the string with the quote
                    let quote = transpose.value.substring(i, j)
                    console.log('Quote before: i: ' + i + ', j:' + j + '**' + quote + '**')
                    let quoteNoSpace = quote.replace(/ /g, '<space>')
                    console.log('Quote after:', quote)
                    myComment = myComment.replace(quote, quoteNoSpace)
                    i = transpose.value.indexOf('"', j + 1)
                } else i = -1
            }
            // Split the sentence by words
            words.value = myComment.split(" ");
            // Remove useless words
            await doRemove()

            //await displayConsole('Words', words.value)

            // Search for the functions name - 1st pass
            await doSearchFunction(1)
            // Search for the functions name - 2nd pass
            await doSearchFunction(2)

            await displayConsole('Function: ', functionName.value)
            if (functionName.value == '<N/A>') {
                DisplayError("No function detected!", 'Alert')
                return
            }

            // Search for attributes - 1st pass
            await doSearchAttribute()
            // Process result
            await doResult(1)

            // Search for attributes - 2nd pass
            await doSearchAttribute()
            // Process result
            await doResult(2)
            // Fill the condition
            testCondition.value = naturalCondition.value
            // clean the parser with unused <tag>
            await cleanParser()
            // // Process the parameters of the function
            if (label1.value) parameter1.value = (await functionParameter(1))
            if (label1.value) await selectValue(1, parameter1.value)
            if (label1.value) await displayConsole("parameter 1: ", parameter1.value)
            if (label2.value) parameter2.value = (await functionParameter(2))
            if (label2.value) await selectValue(2, parameter2.value)
            if (label2.value) await displayConsole("parameter 2: ", parameter2.value)
            if (label3.value) parameter3.value = (await functionParameter(3))
            if (label3.value) await selectValue(3, parameter3.value)
            if (label3.value) await displayConsole("parameter 3: ", parameter3.value)
            if (label4.value) parameter4.value = (await functionParameter(4))
            if (label4.value) await selectValue(4, parameter4.value)
            if (label4.value) await displayConsole("parameter 4: ", parameter4.value)
        }


        return {
            errorMessage, styleMessage, test, projectName, projectID, userID, label, comment, transpose, testCondition, actives, commentType,
            selectedActive, actions, selectedAction, action, testfunctions, selectedFunction, scenarioName, filterFunction, filterFlag, classColor, filteredData, filteredRows,
            parameter1, label1, tip1, data1, dict1, rule1, dummy1, ref1, parameter2, label2, tip2, data2, dict2, rule2, dummy2, ref2,
            parameter3, label3, tip3, data3, dict3, rule3, dummy3, ref3, parameter4, label4, tip4, data4, dict4, rule4, dummy4, ref4,
            defVal1, defVal2, defVal3, defVal4, defLists1, defLists2, defLists3, defLists4, selectVal1, selectVal2, selectVal3, selectVal4,
            handleCancel, handleSubmit, handleFocus, handleBlur, handleFunctionChange, handleActionChange, handleFilter, handleTranscribe,
            handleListValue1Change, handleListValue2Change, handleListValue3Change, handleListValue4Change, handleDictionary, handleDataset, handleRule, handleDummy, handleReference
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