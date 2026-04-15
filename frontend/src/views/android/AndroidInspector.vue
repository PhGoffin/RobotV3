<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">

            <div class="banner">
                <h3 class="title">{{ projectName }}<br>-- Android Inspector --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <form @submit.prevent="handleSubmit">

                    <div class="inspector">

                        <h1>Android Element Inspector</h1>
                        <div class="status">{{ statusText }}</div>
                        <div class="info-box" v-html="infoHtml"></div>

                    </div>

                    <div class="container">
                        <div class="screen-wrapper">
                            <div ref="highlighter" class="highlighter"></div>
                            <img ref="screen" :src="imgSrc" class="screen" @mousemove="onMove" @click="onClick">
                        </div>
                    </div>

                    <div class="input-container focus">
                        <select id="active" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            v-model="selectedActive">
                            <option v-for="active in actives" :key="active.activeID"
                                v-bind:value="{ id: active.activeID }">
                                {{ active.active }}</option>
                        </select>
                        <label>Click behavior</label>
                        <span>Click behavior</span>
                    </div>

                    <div class="input-container">
                        <button @click="handleHome" style="background-color: #4AB3E2;">
                            <i class="fa fa-home"></i>
                            Home</button>

                        <button @click="handleBack" style="background-color: #4AB3E2;">
                            <i class="fa fa-arrow-circle-left"></i>
                            Back</button>
                    </div>

                    <div class="input-container">
                        <button @click="handleCancel">
                            <i class="fa-solid fa-ban"></i>
                            Cancel</button>
                    </div>

                </form>

            </div>
        </div>


    </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import Spinner from '../../components/Spinner.vue'
import snapshotAndroid from '../../composables/android/snapshotAndroid'
import clickOnAndroid from '../../composables/android/clickOnAndroid'
import homeKeyAndroid from '../../composables/android/homeKeyAndroid'
import backKeyAndroid from '../../composables/android/backKeyAndroid'
import updateDictionary from '../../composables/dictionary/updateDictionary'
import getDictionary from '../../composables/dictionary/getDictionary'



import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'AndroidInspector',
    props: ['trace', 'id', 'projectID', 'projectName', 'userID', 'currentuser', 'userName', 'connected'],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('AndroidInspector.vue', trace.value)
        consoleLog('AndroidInspector.vue - props', 1, props, trace.value)

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
        const dictionary = ref([])
        const dictionaryID = ref(props.id)
        const dictionaryheaderID = ref(0)
        //const comment = ref('')
        const code = ref('')
        const codeHeader = ref('')
        const language = ref('')
        //const label = ref('')
        //const createdBy = ref('')
        //const updatedBy = ref('')        
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
        const year = currentDate.getFullYear();
        let today = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year

        const active = ref(1)
        const actives = ref([{ activeID: '1', active: 'Normal' }, { activeID: '0', active: 'Submit' }])
        const selectedActive = ref({ id: active.value })


        const screen = ref(null)
        const highlighter = ref(null)

        const imgSrc = ref('')
        const infoHtml = ref('Move your mouse over the screen to inspect elements.')
        const statusText = ref('Connecting to device...')
        const classElt = ref('')
        const textElt = ref('')
        const ressourceidElt = ref('')


        const currentTree = ref(null)
        const screenSize = ref(null)
        const isFetching = ref(false)

        let refreshTimer = null

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
            consoleLog('AndroidInspector.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
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
        // Get the dictionary data
        // --------------------------------------------------------------------------
        const { error, loadDictionary } = getDictionary(dictionaryID.value)
        loadDictionary(dictionary, trace.value)
            .then(function () {
                consoleLog('AndroidInspector.vue/getDictionary', 2, '------ dictionary: ' + dictionaryID.value, trace.value)
                if (dictionary.value.success && dictionary.value.data.length) {
                    dictionary.value = dictionary.value.data
                    consoleLog('AndroidInspector.vue/loadDictionaryData', 2, dictionary, trace.value)
                    dictionaryheaderID.value = dictionary.value[0].dictionaryheaderID
                    code.value = dictionary.value[0].code
                    codeHeader.value = dictionary.value[0].headercode
                    language.value = dictionary.value[0].language
                    //label.value = dictionary.value[0].label
                    //comment.value = dictionary.value[0].comment
                    //createdBy.value = dictionary.value[0].createdby + ' on: ' + dictionary.value[0].created
                    //updatedBy.value = dictionary.value[0].updatedby + ' on: ' + dictionary.value[0].updated
                    return (1)
                } else {
                    consoleLog('AndroidInspector.vue/loadDictionaryData', 2, 'No dictionary found!', trace.value)
                    return (0)
                }
            })




        // --------------------------------------------------------------------------
        // Refresh the screen
        // --------------------------------------------------------------------------
        async function refresh() {
            if (isFetching.value) return
            isFetching.value = true

            try {
                let screenshot = []

                const { error, snapshot } = snapshotAndroid()
                return await snapshot(screenshot, trace.value)
                    .then(function () {
                        // check the status of the snapshot
                        consoleLog('AndroidInspector.vue/refresh', 2, 'Android snapshot status: ' + screenshot.value.success, trace.value)
                        if (screenshot.value.success) {
                            consoleLog('AndroidInspector.vue/refresh', 2, 'Snapshot OK!', trace.value)
                            //consoleLog('AndroidInspector.vue/refresh', 2, screenshot.value.data.data , trace.value)

                            imgSrc.value = 'data:image/png;base64,' + screenshot.value.data.data.image
                            currentTree.value = screenshot.value.data.data.tree
                            screenSize.value = screenshot.value.data.data.screenSize
                            statusText.value = `Device: Ready (${screenshot.value.data.data.screenSize.width}x${screenshot.value.data.data.screenSize.height})`
                            //statusText.value = `Device: Ready ()`

                        } else {
                            consoleLog('AndroidInspector.vue/refresh', 2, 'Error: Cannot snapshot Android device.', trace.value)
                            statusText.value = 'Error: Cannot snapshot Android device.'
                        }
                    })

            } catch (e) {
                console.error(e)
                statusText.value = 'Error: Cannot reach server.'
            } finally {
                isFetching.value = false
            }
        }

        // --------------------------------------------------------------------------
        // User moves the mouse
        // --------------------------------------------------------------------------
        function onMove(e) {

            console.log("onmove")

            if (!currentTree.value || !screenSize.value) return

            const imgEl = screen.value
            const rect = imgEl.getBoundingClientRect()

            const scaleX = screenSize.value.width / rect.width
            const scaleY = screenSize.value.height / rect.height

            const x = (e.clientX - rect.left) * scaleX
            const y = (e.clientY - rect.top) * scaleY

            //const element = findElementAt(currentTree.value, x, y)
            const element = findBestElementAt(currentTree.value, x, y)

            if (element?.bounds) {
                const b = element.bounds

                Object.assign(highlighter.value.style, {
                    display: 'block',
                    left: `${b.x / scaleX}px`,
                    top: `${b.y / scaleY}px`,
                    width: `${b.width / scaleX}px`,
                    height: `${b.height / scaleY}px`
                })


                classElt.value = element.type || ''
                textElt.value = element.text || ''
                ressourceidElt.value = element.res || ''

                infoHtml.value = `
                    <strong>Class:</strong> ${element.type}<br>
                    <strong>Resource-ID:</strong>
                    <span style="color:#00ff00">${element.res || 'N/A'}</span><br>
                    <strong>Text:</strong> "${element.text || ''}"
                    `
            } else {
                highlighter.value.style.display = 'none'
            }
        }

        // --------------------------------------------------------------------------
        // User clicks on an element
        // --------------------------------------------------------------------------
        async function onClick(e) {

            if (selectedActive.value.id == 0) {
                // Submit click
                consoleLog('AndroidInspector.vue/onClick', 2, 'click Submit: ', trace.value)
                if (classElt.value == '' && textElt.value == '' && ressourceidElt.value == '') {
                    return // No attribute available
                }
                statusText.value = 'Submit the attributes'
                let criteria = ''
                let comment = ''
                if (ressourceidElt.value != '') {
                    criteria = ressourceidElt.value
                    comment = 'Android attribute type: Element'
                } else if (textElt.value != '') {
                    criteria = textElt.value
                    comment = 'Android attribute type: Text'
                }

                // code, label, comment, language, active, projectID, dictionaryID
                const { error, updateTheDictionary } = updateDictionary(code.value, criteria, comment, language.value, 1, projectID.value, dictionaryID.value, userName.value, today)
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
                return
            }

            // Normal click
            if (!screenSize.value) return
            console.log('on click here ' + selectedActive.value.id)

            const rect = screen.value.getBoundingClientRect()
            const x = (e.clientX - rect.left) * (screenSize.value.width / rect.width)
            const y = (e.clientY - rect.top) * (screenSize.value.height / rect.height)

            let androidData = []

            const { error, clickOn } = clickOnAndroid(x, y)
            return await clickOn(androidData, trace.value)
                .then(function () {
                    // check the status of the click
                    consoleLog('AndroidInspector.vue/onClick', 2, 'click status: ' + androidData.value.success, trace.value)
                    if (androidData.value.success) {
                        consoleLog('AndroidInspector.vue/onClick', 2, 'OK!', trace.value)
                        refresh()
                    } else {
                        consoleLog('AndroidInspector.vue/onClick', 2, 'Error during the click', trace.value)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // User wants to go Home
        // --------------------------------------------------------------------------
        async function handleHome() {

            if (!screenSize.value) return

            let androidData = []
            statusText.value = 'Home in progress...'
            const { error, homeKey } = homeKeyAndroid()
            return await homeKey(androidData, trace.value)
                .then(function () {
                    // check the status of the home key
                    consoleLog('AndroidInspector.vue/handleHome', 2, 'Home key status: ' + androidData.value.success, trace.value)
                    if (androidData.value.success) {
                        consoleLog('AndroidInspector.vue/handleHome', 2, 'OK!', trace.value)
                        refresh()
                    } else {
                        consoleLog('AndroidInspector.vue/handleHome', 2, 'Error during the home key', trace.value)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // User wants to go Back
        // --------------------------------------------------------------------------
        async function handleBack() {

            if (!screenSize.value) return

            let androidData = []
            statusText.value = 'Back in progress...'
            const { error, backKey } = backKeyAndroid()
            return await backKey(androidData, trace.value)
                .then(function () {
                    // check the status of the back key
                    consoleLog('AndroidInspector.vue/handleBack', 2, 'Back key status: ' + androidData.value.success, trace.value)
                    if (androidData.value.success) {
                        consoleLog('AndroidInspector.vue/handleBack', 2, 'OK!', trace.value)
                        refresh()
                    } else {
                        consoleLog('AndroidInspector.vue/handleBack', 2, 'Error during the back key', trace.value)
                    }
                })
        }



        // --------------------------------------------------------------------------
        // Collect elements at a position
        // --------------------------------------------------------------------------
        function collectElementsAt(node, x, y, hits = [], depth = 0) {
            if (!node?.bounds) return hits

            const b = node.bounds
            const contains =
                x >= b.x && x <= b.x + b.width &&
                y >= b.y && y <= b.y + b.height

            if (contains) {
                hits.push({
                    node,
                    depth,
                    area: b.width * b.height
                })

                for (const child of node.children || []) {
                    collectElementsAt(child, x, y, hits, depth + 1)
                }
            }

            return hits
        }

        // --------------------------------------------------------------------------
        // find the best elements at a position (the most usefull for a human)
        // --------------------------------------------------------------------------
        function findBestElementAt(root, x, y) {
            const hits = collectElementsAt(root, x, y)

            if (!hits.length) return null

            hits.sort((a, b) => {
                // 1️⃣ smallest area wins
                if (a.area !== b.area) return a.area - b.area

                // 2️⃣ deeper node wins
                return b.depth - a.depth
            })

            return hits[0].node
        }

        // --------------------------------------------------------------------------
        // Detect element at the position of the cursor (Obsolete)
        // --------------------------------------------------------------------------
        function findElementAt(node, x, y) {
            if (!node?.bounds) return null
            const b = node.bounds

            if (x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height) {
                let found = node
                for (const child of node.children || []) {
                    const deeper = findElementAt(child, x, y)
                    if (deeper) found = deeper
                }
                return found
            }
            return null
        }

        // --------------------------------------------------------------------------
        // OnMounted event (refresh the screen)
        // --------------------------------------------------------------------------
        onMounted(() => {
            refresh()
            refreshTimer = setInterval(refresh, 3000)
        })

        // --------------------------------------------------------------------------
        // OnBeforeUMounted event
        // --------------------------------------------------------------------------
        onBeforeUnmount(() => {
            clearInterval(refreshTimer)
        })


        // --------------------------------------------------------------------------
        // User cancels the action, leave the screen and returns to the list
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('AndroidInspector.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'DictionaryEdit', params: { id: dictionaryID.value } })
        }


        // --------------------------------------------------------------------------
        // User submits the data
        // --------------------------------------------------------------------------
        const handleSubmit = () => {
            // Dummy function
            //consoleLog('AndroidInspector.vue/handleSubmit', 2, 'User Submit the action - projectID: ' + projectID.value, trace.value)
        }

        // -----------------------------------------------------------------------------------
        // leave the screen and go to the Dictionary screen (used by the function DisplayError)
        // -----------------------------------------------------------------------------------
        const gotoDictionary = () => {
            router.push({ name: 'DictionaryEdit', params: { id: dictionaryID.value } })
        }

        return {
            errorMessage, styleMessage, projectName, projectID, userID, userName, statusText, imgSrc, infoHtml, screen, highlighter, actives, selectedActive,
            handleCancel, handleSubmit, handleFocus, handleBlur, onMove, onClick, handleBack, handleHome
        }

    }

}
</script>

<style scoped>
.inspector {
    font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
    background: #222;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.container {
    position: relative;
    background: black;
    border: 2px solid #444;
}


.screen-wrapper {
    position: relative;
    display: inline-block;
}

.screen {
    height: 80vh;
    display: block;
}


.highlighter {
    position: absolute;
    border: 2px dashed #00ff00;
    background: rgba(0, 255, 0, 0.1);
    pointer-events: none;
    display: none;
    z-index: 10;
}

.info-box {
    margin-top: 15px;
    padding: 15px;
    background: #333;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    border-left: 5px solid #00ff00;
}



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

.actions i.blue {
    font-size: 24px;
    margin-left: 10px;
    color: #072af5;
    cursor: pointer;
}

.actions i:hover {
    color: #777;
}

.actions2 {
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
}
</style>