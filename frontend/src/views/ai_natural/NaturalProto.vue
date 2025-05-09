<template>
    <div class="my-container">

        <div class="form">
            <div class="banner">
                <h3 class="title">Natural Language Prototype</h3>
                <img src="../../assets/laboratory.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">
                <h1 class="titleBlue">Experience in progress....</h1>

                <form @submit.prevent="handleSubmit">


                    <div class="input-container textarea focus">
                        <textarea name="comment" class="input" maxlength="255" v-model="comment"
                            @focus="handleFocus($event)" @blur="handleBlur($event)"
                            title="Enter the text you want to transcribe into natural language"></textarea>
                        <label>Comment</label>
                        <span>Comment</span>
                    </div>

                    <div class="input-container">
                        <button @click="handleTranscribe">
                            <i class="fa-solid fa-ban"></i>
                            Transcribe</button>
                    </div>

                    <div class="input-container textarea focus">
                        <textarea name="result" class="input disabled" maxlength="255" v-model="result"
                            @focus="handleFocus($event)" @blur="handleBlur($event)"
                            title="Result of the transcribe"></textarea>
                        <label>Parser</label>
                        <span>Parser</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="testCondition" class="input disabled"
                            title="Any JavaScript expression that return true or false or 'Else'"
                            v-model="naturalCondition" disabled />
                        <label>Condition</label>
                        <span>Condition</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="function" class="input disabled" :title="functionComment"
                            v-model="functionName" disabled />
                        <label>Function</label>
                        <span>Function</span>
                    </div>

                    <div class="input-container focus" v-if="label1">
                        <input type="text" name="function" class="input disabled" :title="tip1" v-model="parameter1"
                            disabled />
                        <label>{{ label1 }}</label>
                        <span>{{ label1 }}</span>
                    </div>

                    <div class="input-container focus" v-if="label2">
                        <input type="text" name="function" class="input disabled" :title="tip2" v-model="parameter2"
                            disabled />
                        <label>{{ label2 }}</label>
                        <span>{{ label2 }}</span>
                    </div>

                    <div class="input-container focus" v-if="label3">
                        <input type="text" name="function" class="input disabled" :title="tip3" v-model="parameter3"
                            disabled />
                        <label>{{ label3 }}</label>
                        <span>{{ label3 }}</span>
                    </div>

                    <div class="input-container focus" v-if="label4">
                        <input type="text" name="function" class="input disabled" :title="tip4" v-model="parameter4"
                            disabled />
                        <label>{{ label4 }}</label>
                        <span>{{ label4 }}</span>
                    </div>

                    <div class="input-container">
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
import { NavigationFailureType, useRouter } from 'vue-router'
import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';
import getFunctionByName from '../../composables/function/getFunctionByName'
import consoleAPI from '../../composables/selenium/consoleAPI'
import getNaturalByCode from '../../composables/ai_natural/getNaturalByCode'

export default {
    name: 'Workspace',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'connected', 'workspaceID', 'workspace', 'projectID', 'projectName'],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('NaturalProto.vue', trace.value)
        consoleLog('NaturalProto.vue - props', 1, props, trace.value)

        //const comment = ref('if the variable "exist" equal 1 then detect the radio field "EU amount"')
        //const comment = ref('if the variable "exist" equal 1 then detect the radio field "EU amount" at the second position')
        //const comment = ref('if the variable "exist" equal 1 then detect the checkbox field "EU amount" at the second position and wait for 10 seconds')
        //const comment = ref('if the variable "exist" equal 1 then detect the checkbox field "EU amount" at the second position and no need to wait')
        //const comment = ref('click using the dictionary "test"')
        //const comment = ref('click on the button and wait after 99 sec')
        //const comment = ref('get data "EU amount" into the variable "test"')
        //const comment = ref('get reference "status" into the variable "test"')
        //const comment = ref('set reference "status" with the value "draft" and the comment "my comment"')
        //const comment = ref('set reference from variable "status" with the comment in the variable "my comment" and the value in the variable "draft"')
        //const comment = ref('set the reference "status" with the value in the variable "draft" and the comment in the variable "my comment"')
        //const comment = ref('set the data "status" with the value in the variable "draft" and the comment in the variable "my comment"')
        //const comment = ref('set the data from the variable "status" with the comment in the variable "my comment" and the value in the variable "draft"')
        //const comment = ref('set variable "toto" with the value "tutu"')
        //const comment = ref('open the page from the dictionary "Prospect"')
        //const comment = ref('say "hello"')
        //const comment = ref('pause 4 sec')
        //const comment = ref('get the link into the variable "myLink"')
        //const comment = ref('skip the tests when the variable "exist" is not equal 0 then display the message "skip: data not exist"')
        //const comment = ref('skip the describe when the variable "exist" is not equal 0 then display the message "skip: data not exist"')
        //const comment = ref('get the dummy information on "phil" into the variable "user"')
        //const comment = ref('get the dummy information into the variable "user"')
        //const comment = ref('execute the rule "toto" using the parameter 1 as "user" and the parameter 2 as "ACC"')
        //const comment = ref('wait for the "amount" waiting 5 sec otherwise "Skip the IT"')
        //const comment = ref('check if exist "amount" waiting 8 sec and using the variable "exist"')
        //const comment = ref('check the existence of "amount" waiting 8 sec and using the variable "exist"')
        //const comment = ref('set the value from "amount" with the value "1000" waiting for 9 sec')
        //const comment = ref('set the value from the dictionary defined in the variable "amount" with the value "1000" waiting for 9 sec')
        //const comment = ref('set the value from the variable "amount" with the value "1000" waiting for 9 sec')
        //const comment = ref('click on the cell "table1" in the row 2 and column 5 and wait for 5 sec')
        //const comment = ref('translate "test" in "FR" and set the result into the variable "translated"')
        //const comment = ref('wait a little bit')
        //const comment = ref('detect the field checkbox with the label "employee"')
        //const comment = ref('display a message "hello" as an "info"')
        const comment = ref('detect the radio "delete previous draft" no wait')
        const result = ref('')

        // -------------------------------------------
        // Management of the errors
        // -------------------------------------------
        const errorMessage = ref('')
        const styleMessage = ref('')
        const natural = ref([])
        const words = ref([])
        const parser = ref([])
        const functionName = ref('')
        const functionTest = ref([])
        const naturalCondition = ref('')
        const naturalExpression = ref('')

        const functionComment = ref('')
        const parameter1 = ref('')
        const natural1 = ref('')
        const label1 = ref('')
        const tip1 = ref('')
        const parameter2 = ref('')
        const natural2 = ref('')
        const label2 = ref('')
        const tip2 = ref('')
        const parameter3 = ref('')
        const natural3 = ref('')
        const label3 = ref('')
        const tip3 = ref('')
        const parameter4 = ref('')
        const natural4 = ref('')
        const label4 = ref('')
        const tip4 = ref('')

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
            consoleLog('Projects.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
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
                    consoleLog('NaturalProto.vue/displayConsole', 2, myTitle + myValue, trace.value)
                })
        }

        //DisplayError ('Work in progress!', 'Alert')

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
        // User cancel the action, Back to the control panel
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('Projects.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'ControlPanel' })
        }



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
                        consoleLog('NaturalProto.vue/doRemove', 2, '------ natural: ' + code, trace.value)
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
                        //console.log ('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Exclude: ' + words.value[i])
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
            console.log('Temp Array', tempArray)
            tempArray = []
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
                                consoleLog('NaturalProto.vue/doSearchAttribute', 2, '------ natural: ' + code, trace.value)
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
                            consoleLog('NaturalProto.vue/doSearchFunction', 2, '------ natural: ' + code, trace.value)
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
                await getFunctionInfo(functionName.value)
                parameter1.value = await cleanFunctionParameter(parameter1.value)
                parameter2.value = await cleanFunctionParameter(parameter2.value)
                parameter3.value = await cleanFunctionParameter(parameter3.value)
                parameter4.value = await cleanFunctionParameter(parameter4.value)
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
                    consoleLog('NaturalProto.vue/getFunctionInfo', 2, '------ function: ' + name, trace.value)
                    if (functionTest.value.success && functionTest.value.data.length) {
                        functionTest.value = functionTest.value.data
                        console.log('Find the function: ' + functionTest.value[0].functionName)
                        //displayConsole('Find info on the function: ' , functionTest.value[0].functionName)
                        //console.log ('§§§§§§§§§§§§§§§§§§§§§§§§§§§  FUNCTION ', functionTest.value[0])
                        functionComment.value = functionTest.value[0].comment
                        parameter1.value = functionTest.value[0].defaultValue1
                        natural1.value = functionTest.value[0].natural1
                        label1.value = functionTest.value[0].parameter1
                        tip1.value = functionTest.value[0].tip1
                        parameter2.value = functionTest.value[0].defaultValue2
                        natural2.value = functionTest.value[0].natural2
                        label2.value = functionTest.value[0].parameter2
                        tip2.value = functionTest.value[0].tip2
                        parameter3.value = functionTest.value[0].defaultValue3
                        natural3.value = functionTest.value[0].natural3
                        label3.value = functionTest.value[0].parameter3
                        tip3.value = functionTest.value[0].tip3
                        parameter4.value = functionTest.value[0].defaultValue4
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

                        // Check if the attributes are in the natural attribute dictionary
                        code = '@Attribute_' + data
                        console.log('@@@@@@@@@@@@@@@@@@@ deep: ' + deep + ', code:', code)
                        await displayConsole('Deep: ' + deep, 'code:' + code)

                        const { error, loadNatural } = getNaturalByCode(code, 'EN', 1)
                        await loadNatural(natural, trace.value)
                            .then(function () {
                                consoleLog('NaturalProto.vue/doSearchAttribute', 2, '------ natural: ' + code, trace.value)
                                if (natural.value.success && natural.value.data.length) {
                                    natural.value = natural.value.data
                                    words.value[i] = natural.value[0].label
                                    console.log('Find the attribute: ' + words.value[i])
                                    displayConsole('Find the attribute: ', words.value[i])

                                    console.log('$$$$$$$$$$$$$$$$$$$$ id + 1 = ' + (id + 1) + ' < deep: ' + deep + ' i: ' + i)
                                    console.log('words: ', words.value)
                                    // to be reviewed
                                    for (let j = i + 1; j < i + deep; j++) {
                                        words.value[j] = '<N/A>'
                                        console.log('$$$$$$$$$$$$$$$$$$$$  RESET word[' + (j) + '] = ' + words.value[j])
                                    }
                                    id = deep + 1
                                } else {
                                    //displayConsole ('Cannot find attribute!')
                                    displayConsole('Cannot find attribute!')
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
                                console.log('Find the attribute: ' + words.value[i])
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
                result.value = result.value + sep + data
                sep = ' '
            }
            if (naturalCondition.value.length) {
                naturalCondition.value = naturalCondition.value.replace('Condition:', '').trim()
                await displayConsole('Condition: ', naturalCondition.value)
            }
            if (naturalExpression.value.length) {
                naturalExpression.value = naturalExpression.value.replace('Expression:', '').trim()
                await displayConsole('Expression: ', naturalExpression.value)
            }
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
                await displayConsole('Single data: ', data1)
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
                    //if (i + 1 < parser.value.length) {
                    await displayConsole('*** generic parameter')
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
            consoleLog('Projects.vue/handleTranscribe', 2, 'User wants to transcribe a request', trace.value)

            await displayConsole('------------------------------')
            await displayConsole('--------- TRANSCRIBE ---------')
            await displayConsole('------------------------------')


            parser.value = []
            functionName.value = '<N/A>'

            // isolate the text between quote
            //-------------------------------
            let myComment = comment.value
            let i = comment.value.indexOf('"', 0)
            let j = 0
            while (i >= 0) {
                j = comment.value.indexOf('"', i + 1)
                if (j >= 0) {
                    // extract the string with the quote
                    let quote = comment.value.substring(i, j)
                    console.log('Quote before: i: ' + i + ', j:' + j + '**' + quote + '**')
                    let quoteNoSpace = quote.replace(/ /g, '<space>')
                    console.log('Quote after:', quote)
                    myComment = myComment.replace(quote, quoteNoSpace)
                    i = comment.value.indexOf('"', j + 1)
                } else i = -1
            }
            // Split the sentence by words
            words.value = myComment.split(" ");
            // Remove useless words
            await doRemove()
            // Search for the functions name - 1st pass
            //await displayConsole('Search Function 1')
            await doSearchFunction(1)
            // Search for the functions name - 2nd pass
            //await displayConsole('Search Function 2')
            await doSearchFunction(2)
            // Search for attributes - 1st pass
            //await displayConsole('Search attribute 1')
            await displayConsole('Function: ', functionName.value)
            if (functionName.value == '<N/A>') {
                DisplayError("No function detected!", 'Alert')
                return
            }

            await doSearchAttribute()
            //await displayConsole('Words', words.value)
            //await displayConsole('Result 1')
            await doResult(1)
            //await displayConsole('Words 2', words.value)

            // Search for attributes - 2nd pass
            console.log('###########################  Second pass')
            //await displayConsole('Search attribute 2')
            await doSearchAttribute()
            // Display result
            //await displayConsole('Result 1')
            await doResult(2)
            // clean the parser with unused <tag>
            await cleanParser()
            // Process the parameters of the function
            //await displayConsole('Process the parameter')
            await displayConsole('Parser: ', parser.value)
            if (label1.value) parameter1.value = (await functionParameter(1))
            await displayConsole('New parser 1: ', parser.value)
            if (label2.value) parameter2.value = (await functionParameter(2))
            await displayConsole('New parser 2: ', parser.value)
            if (label3.value) parameter3.value = (await functionParameter(3))
            await displayConsole('New parser 3: ', parser.value)
            if (label4.value) parameter4.value = (await functionParameter(4))
            await displayConsole('New parser 4:', parser.value)
        }


        return {
            errorMessage, styleMessage, trace, comment, result, naturalCondition, functionComment, functionName, parameter1, label1, tip1, parameter2, label2, tip2, parameter3, label3, tip3, parameter4, label4, tip4,
            handleCancel, handleTranscribe, handleFocus, handleBlur
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

.titleBlue {
    padding: 2.3rem 2.2rem;
    color: blue;
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