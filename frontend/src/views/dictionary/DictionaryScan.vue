<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">

            <div class="banner">
                <h3 class="title">{{ projectName }}<br>-- Scanning --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">


                <form @submit.prevent="handleScan">
                    <table>
                        <tbody>
                            <tr>
                                <td class="menu">
                                    <div class="input-container focus" v-if="myURL!=''">
                                        <button v-if="!scanning">
                                            <i class="fa-solid fa-circle-plus"></i>
                                            Scan</button>
                                    </div>
                                </td>
                                <td class="menu">
                                    <div class="input-container focus">
                                        <input type="text" name="url" class="input url" @focus="handleFocus($event)"
                                            @blur="handleBlur($event)" v-model="myURL"  
                                            title="Please enter the URL of the web page to scan" />
                                        <label>URL</label>
                                        <span>URL</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <span v-if="myURL==''">Please enter the URL in order to scan!</span>
                                </td>
                            </tr>


                        </tbody>
                    </table>

                </form>



                <form @submit.prevent="handleSubmit">

                    <table>
                        <tbody>
                            <tr>
                                <td class="menu">
                                </td>
                                <td class="menu">
                                    <div class="input-container focus">
                                        <input type="text" name="tagName" class="input disabled" v-model="tagName"
                                            disabled />
                                        <label>tagName</label>
                                        <span>tagName</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="menu">
                                    <div class="icons" v-if="id != 'N/A'">
                                        <input type="checkbox" name="selId" class="input checkbox" v-model="selId"
                                            title="Check to include this attribute in the dictionary">&nbsp;&nbsp;</input>
                                    </div>
                                </td>
                                <td class="menu">
                                    <div class="input-container focus" v-if="id != 'N/A'">
                                        <input type="text" name="tagName" class="input" style="width: 150%;"
                                            v-model="id" />
                                        <label>id</label>
                                        <span>id</span>
                                    </div>
                                    <div class="input-container focus" v-else>
                                        <input type="text" name="tagName" class="input disabled" style="width: 150%;"
                                            v-model="id" disabled="" />
                                        <label>id</label>
                                        <span>id</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="menu">
                                    <div class="icons" v-if="name != 'N/A'">
                                        <input type="checkbox" name="selName" class="input checkbox" v-model="selName"
                                            title="Check to include this attribute in the dictionary">&nbsp;&nbsp;</input>
                                    </div>
                                </td>
                                <td class="menu">
                                    <div class="input-container focus" v-if="name != 'N/A'">
                                        <input type="text" name="Name" class="input" style="width: 150%;"
                                            v-model="name" />
                                        <label>name</label>
                                        <span>name</span>
                                    </div>
                                    <div class="input-container focus" v-else>
                                        <input type="text" name="Name" class="input disabled" style="width: 150%;"
                                            v-model="name" disabled />
                                        <label>name</label>
                                        <span>name</span>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td class="menu">
                                    <div class="icons" v-if="tagType != 'N/A'  && tagName == 'input'">
                                        <input type="checkbox" name="selTagType" class="input checkbox"
                                            v-model="selTagType"
                                            title="Check to include this attribute in the dictionary">&nbsp;&nbsp;</input>
                                    </div>
                                </td>
                                <td class="menu">
                                    <div class="input-container focus" v-if="tagType != 'N/A' && tagName == 'input'">
                                        <input type="text" name="placeholder" class="input" style="width: 250%;"
                                            v-model="tagType" />
                                        <label>type</label>
                                        <span>type</span>
                                    </div>
                                </td>
                            </tr>  

                            <tr>
                                <td class="menu">
                                    <div class="icons" v-if="className != 'N/A'">
                                        <input type="checkbox" name="selClass" class="input checkbox"
                                            v-model="selClassName"
                                            title="Check to include this attribute in the dictionary">&nbsp;&nbsp;</input>
                                    </div>
                                </td>
                                <td class="menu">
                                    <div class="input-container focus" v-if="className != 'N/A'">
                                        <input type="text" name="className" class="input" style="width: 250%;"
                                            v-model="className" />
                                        <label>class</label>
                                        <span>class</span>
                                    </div>
                                    <div class="input-container focus" v-else>
                                        <input type="text" name="className" class="input disabled" style="width: 250%;"
                                            v-model="className" disabled />
                                        <label>class</label>
                                        <span>class</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="menu">
                                    <div class="icons" v-if="innerText != 'N/A' && !excludeTag.includes(tagName)">
                                        <input type="checkbox" name="selInnerText" class="input checkbox"
                                            v-model="selInnerText"
                                            title="Check to include this attribute in the dictionary">&nbsp;&nbsp;</input>
                                    </div>
                                </td>
                                <td class="menu">
                                    <div class="input-container focus" v-if="innerText != 'N/A' && !excludeTag.includes(tagName)">
                                        <input type="text" name="innerText" class="input" style="width: 250%;"
                                            v-model="innerText" title="Use this attribute with caution as it is not always very reliable!" />
                                        <label>innerText</label>
                                        <span>innerText</span>
                                    </div>
                                    <div class="input-container focus" v-else>
                                        <input type="text" name="innerText" class="input disabled" style="width: 250%;"
                                            v-model="innerText" disabled />
                                        <label>innerText</label>
                                        <span>innerText</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="menu">
                                    <div class="icons" v-if="placeholder != 'N/A'">
                                        <input type="checkbox" name="selPlaceholder" class="input checkbox"
                                            v-model="selPlaceholder"
                                            title="Check to include this attribute in the dictionary">&nbsp;&nbsp;</input>
                                    </div>
                                </td>
                                <td class="menu">
                                    <div class="input-container focus" v-if="placeholder != 'N/A'">
                                        <input type="text" name="placeholder" class="input" style="width: 250%;"
                                            v-model="placeholder" />
                                        <label>placeholder</label>
                                        <span>placeholder</span>
                                    </div>
                                    <div class="input-container focus" v-else>
                                        <input type="text" name="placeholder" class="input disabled"
                                            style="width: 250%;" v-model="placeholder" disabled />
                                        <label>placeholder</label>
                                        <span>placeholder</span>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td class="menu">
                                    <div class="icons" v-if="source != 'N/A'">
                                        <input type="checkbox" name="selSource" class="input checkbox"
                                            v-model="selSource"
                                            title="Check to include this attribute in the dictionary">&nbsp;&nbsp;</input>
                                    </div>
                                </td>
                                <td class="menu">
                                    <div class="input-container focus" v-if="source != 'N/A'">
                                        <input type="text" name="placeholder" class="input" style="width: 250%;"
                                            v-model="source" />
                                        <label>source</label>
                                        <span>source</span>
                                    </div>
                                </td>
                            </tr>                            

                            <tr>
                                <td class="menu">
                                    <div class="icons" v-if="xPath != 'N/A'">
                                        <input type="checkbox" name="selXpath" class="input checkbox" v-model="selXpath"
                                            title="Check to include this attribute in the dictionary">&nbsp;&nbsp;</input>
                                    </div>
                                </td>
                                <td class="menu">
                                    <div class="input-container focus" v-if="xPath != 'N/A'">
                                        <input type="text" name="xpath" class="input" style="width: 250%;"
                                            v-model="xPath" />
                                        <label>xpath</label>
                                        <span>xpath</span>
                                    </div>
                                    <div class="input-container focus" v-else>
                                        <input type="text" name="xpath" class="input disabled" style="width: 250%;"
                                            v-model="xPath" disabled />
                                        <label>xpath</label>
                                        <span>xpath</span>
                                    </div>
                                </td>
                            </tr>

                        </tbody>
                    </table>



                    <div class="input-container">
                        <button>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Spinner from '../../components/Spinner.vue'
import updateDictionary from '../../composables/dictionary/updateDictionary'
import scanDictionary from '../../composables/dictionary/scanDictionary'
import getDictionary from '../../composables/dictionary/getDictionary'

import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'DictionaryEdit',
    props: ['trace', 'id', 'projectID', 'projectName', 'subprojectID', 'subprojectName', 'userID', 'currentuser', 'connected'],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('DictionaryScan.vue', trace.value)
        consoleLog('DictionaryScan.vue - props', 1, props, trace.value)

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

        const myURL = ref('')
        const scanning = ref(false)
        const tagName = ref('N/A')
        const selTagName = ref(false)
        const id = ref('N/A')
        const selId = ref(false)
        const name = ref('N/A')
        const selName = ref(false)
        const className = ref('N/A')
        const selClassName = ref(false)
        const innerText = ref('N/A')
        const selInnerText = ref(false)
        const placeholder = ref('N/A')
        const selPlaceholder = ref(false)
        const xPath = ref('N/A')
        const selSource = ref(false)
        const source = ref('N/A')
        const selXpath = ref(false)
        const excludeTag = ref('*select*')
        const selTagType = ref(false)
        const tagType = ref('N/A')

        const comment = ref('')
        const code = ref('')
        const codeHeader = ref('')
        const language = ref('')
        const label = ref('')
        const createdBy = ref('')
        const updatedBy = ref('')


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
            consoleLog('DictionaryScan.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        // --------------------------------------------------------------------------
        // Get the dictionary data
        // --------------------------------------------------------------------------
        const { error, loadDictionary } = getDictionary(dictionaryID.value)
        loadDictionary(dictionary, trace.value)
            .then(function () {
                consoleLog('DictionaryScan.vue/getDictionary', 2, '------ dictionary: ' + dictionaryID.value, trace.value)
                if (dictionary.value.success && dictionary.value.data.length) {
                    dictionary.value = dictionary.value.data
                    consoleLog('DictionaryScan.vue/loadDictionaryData', 2, dictionary, trace.value)
                    //projectID.value = dictionary.value.projectID
                    dictionaryheaderID.value = dictionary.value[0].dictionaryheaderID
                    code.value = dictionary.value[0].code
                    codeHeader.value = dictionary.value[0].headercode
                    language.value = dictionary.value[0].language
                    label.value = dictionary.value[0].label
                    comment.value = dictionary.value[0].comment
                    createdBy.value = dictionary.value[0].createdby + ' on: ' + dictionary.value[0].created
                    updatedBy.value = dictionary.value[0].updatedby + ' on: ' + dictionary.value[0].updated
                    selectedActive.value = ({ id: dictionary.value[0].active })
                    return (1)
                } else {
                    consoleLog('DictionaryScan.vue/loadDictionaryData', 2, 'No dictionary found!', trace.value)
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
            consoleLog('DictionaryScan.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'DictionaryEdit', params: { id: dictionaryID.value } })
        }

        // -----------------------------------------------------------------------------------
        // leave the screen and go to the Dictionary screen (used by the function DisplayError)
        // -----------------------------------------------------------------------------------
        const gotoDictionary = () => {
            router.push({ name: 'DictionaryEdit', params: { id: dictionaryID.value } })
        }


        // --------------------------------------------------------------------------
        // User wants to scan a web page
        // --------------------------------------------------------------------------        
        const handleScan = () => {
            consoleLog('DictionaryScan.vue/handleScan', 2, 'User scan a website: ' + myURL.value, trace.value)

            // code, label, comment, language, active, projectID, dictionaryID
            const { error, scanForTheDictionary } = scanDictionary(projectID.value, dictionaryID.value, myURL.value)
            scanForTheDictionary(dictionary, trace.value)
                .then(function () {
                    consoleLog('DictionaryScan.vue/handleScan', 2, '------ Scan the dictionary - projectID: ' + projectID.value + ', dictionaryID: ' + dictionaryID.value + ', myURL: ' + myURL.value, trace.value)
                    consoleLog('DictionaryScan.vue/handleScan', 2, dictionary.value, trace.value)
                    consoleLog('DictionaryScan.vue/handleScan', 2, 'Success: ' + dictionary.value.success, trace.value)
                    if (dictionary.value.success) {
                        consoleLog('DictionaryScan.vue/handleScan', 2, 'Message OK: ' + dictionary.value.message, trace.value)
                        DisplayError(dictionary.value.message, 'Info')
                        // Set the attributes
                        tagName.value = dictionary.value.attributes.tagName
                        id.value = dictionary.value.attributes.id
                        name.value = dictionary.value.attributes.name
                        className.value = dictionary.value.attributes.class
                        innerText.value = dictionary.value.attributes.innerText
                        placeholder.value = dictionary.value.attributes.placeholder
                        source.value = dictionary.value.attributes.source
                        tagType.value = dictionary.value.attributes.type
                        if (dictionary.value.attributes.xpath != 'N/A') {
                            xPath.value = '/' + dictionary.value.attributes.xpath
                            selXpath.value = true
                        } else {
                            xPath.value = 'N/A'
                            selXpath.value = false
                        }

                    } else {
                        // Error during scan!
                        consoleLog('DictionaryScan.vue/handleScan', 2, 'Message KO: ' + dictionary.value.message, trace.value)
                        DisplayError(dictionary.value.message, 'Alert')
                        tagName.value = 'N/A'
                        id.value = 'N/A'
                        name.value = 'N/A'
                        className.value = 'N/A'
                        innerText.value = 'N/A'
                        placeholder.value = 'N/A'
                        xPath.value = 'N/A'
                        source.value = 'N/A'
                    }
                })

        }


        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = () => {
            consoleLog('DictionaryScan.vue/handleSubmit', 2, 'User Submit the action - projectID: ' + projectID.value, trace.value)

            let myXpath = ''

            // Build the logic to detect a webElement by xpath
            if (selXpath.value == false) {
                myXpath= '//'+tagName.value
            } else myXpath = xPath.value
            // include the id
            if (selId.value) myXpath = myXpath +"[@id='"+id.value+"']"
            if (selName.value) myXpath = myXpath +"[@name='"+name.value+"']"
            if (selClassName.value) myXpath = myXpath +"[contains(@class,'"+className.value+"')]"
            if (selInnerText.value) myXpath = myXpath +"[contains(text(),'"+innerText.value+"')]"
            if (selPlaceholder.value) myXpath = myXpath +"[contains(@placeholder,'"+placeholder.value+"')]"
            if (selSource.value) myXpath = myXpath +"[@src='"+source.value+"']"
            if (selTagType.value) myXpath = myXpath +"[@type='"+tagType.value+"']"


            label.value = myXpath

            // code, label, comment, language, active, projectID, dictionaryID
            const { error, updateTheDictionary } = updateDictionary(code.value, label.value, comment.value, language.value, selectedActive.value.id, projectID.value, dictionaryID.value, userName.value, today)
            updateTheDictionary(dictionary, trace.value)
                .then(function () {
                    consoleLog('DictionaryScan.vue/handleSubmit', 2, '------ Update a dictionary - projectID: ' + projectID.value + ', dictionaryID: ' + dictionaryID.value + ', code: ' + code.value, trace.value)
                    consoleLog('DictionaryScan.vue/handleSubmit', 2, dictionary.value, trace.value)
                    consoleLog('DictionaryScan.vue/handleSubmit', 2, 'Success: ' + dictionary.value.success, trace.value)
                    if (dictionary.value.success) {
                        consoleLog('DictionaryScan.vue/handleSubmit', 2, 'Message OK: ' + dictionary.value.message, trace.value)
                        DisplayError(dictionary.value.message, 'Info', gotoDictionary)
                    } else {
                        // Error during insert found!
                        consoleLog('DictionaryScan.vue/handleSubmit', 2, 'Message KO: ' + dictionary.value.message, trace.value)
                        DisplayError(dictionary.value.message, 'Alert')
                    }
                })
        }


        return {
            errorMessage, styleMessage, dictionary, projectName, projectID, subprojectName, subprojectID, userID, selSource, source, excludeTag, selTagType, tagType,
            myURL, tagName, selTagName, id, selId, name, selName, className, selClassName, innerText, selInnerText, placeholder, selPlaceholder, xPath, selXpath, scanning,
            code, codeHeader, label, language, comment, actives, selectedActive, createdBy, updatedBy,
            handleCancel, handleSubmit, handleFocus, handleBlur, handleScan
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

.input.checkbox {
    height: 1.5rem;
    width: 1.5rem;
}

textarea.input {
    padding: 0.8rem 1.2rem;
    min-height: 150px;
    border-radius: 22px;
    resize: none;
    overflow-y: auto;
}

.url {
    width: 200%;
    /* max-width: 1000px; */
    background-color: #b2e5f1;
    /* border-radius: 3rem; */
    box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.3);
    /* z-index: 1000;
    overflow: hidden;
    display: grid; */
    /* grid-template-columns: 30% 1fr; */
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
</style>