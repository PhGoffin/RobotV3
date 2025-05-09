<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">

            <div class="banner">
                <h3 class="title">{{ projectName }}<br>-- Story --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <form @submit.prevent="handleSubmit">

                    <div class="input-container focus">
                        <input type="text" name="subproject" class="input disabled" v-model="subprojectName" disabled />
                        <label>Subproject</label>
                        <span>Subproject</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="storyset" class="input disabled" v-model="storysetName"
                            title="Name of the story set" disabled />
                        <label>Story set</label>
                        <span>Story set</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="story" class="input" v-model="storyName" title="Name of the story"
                            maxlength="40" />
                        <label>Story</label>
                        <span>Story</span>
                    </div>

                    <div class="input-container focus">
                        <input type="text" name="story" class="input" v-model="graphLabel" title="Name of the label to display on the graph"
                            maxlength="20" />
                        <label>Graph label</label>
                        <span>Graph label</span>
                    </div>

                    <div class="input-container focus">
                        <select id="selector" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            @change="handleSelectorChange()" v-model="selectedSelector"
                            title="Selector: Scenario or Suite">
                            <option v-for="selector in selectors" :key="selector.selectorID"
                                v-bind:value="{ id: selector.selectorID }">
                                {{ selector.selector }}</option>
                        </select>
                        <label>Selector</label>
                        <span>Selector</span>
                    </div>


                    <div class="actions" v-if="selectorID == 1">
                        <div class="input-container focus">
                            <input type="text" name="scenarioID" class="input disabled" v-model="scenarioID"
                                title="Id of the scenario" disabled />
                            <label>Scenario</label>
                            <span>Scenario</span>
                        </div>
                        <i class="fa-solid fa-bars" @click="handleScenario()" title="Go to Scenario"> </i>
                    </div>

                    <div class="actions" v-if="selectorID == 2">
                        <div class="input-container focus">
                            <input type="text" name="suiteID" class="input disabled" v-model="suiteID"
                                title="Id of the suite" disabled />
                            <label>Suite</label>
                            <span>Suite</span>
                        </div>
                        <i class="fa-solid fa-map" @click="handleSuite()" title="Go to Suite"> </i>
                    </div>


                    <div class="input-container textarea focus">
                        <textarea name="comment" class="input disabled" maxlength="80" v-model="comment"
                            @focus="handleFocus($event)" @blur="handleBlur($event)"
                            :title="selectorID == 1 ? 'Comment on the selected scenario' : 'Comment on the selected suite'" disabled></textarea>
                        <label>Comment</label>
                        <span>Comment</span>
                    </div>

                    <div class="input-container focus">
                        <select id="active" class="input" @focus="handleFocus($event)" @blur="handleBlur($event)"
                            @change="handleActiveChange()" v-model="selectedActive" title="Status of the story">
                            <option v-for="active in actives" :key="active.activeID"
                                v-bind:value="{ id: active.activeID }">
                                {{ active.active }}</option>
                        </select>
                        <label>Status</label>
                        <span>Status</span>
                    </div>


                    <div class="input-container">
                        <button>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Spinner from '../../components/Spinner.vue'
import updateStory from '../../composables/story/updateStory'
import getStory from '../../composables/story/getStory'

import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'StoryEdit',
    props: ['trace', 'id', 'projectID', 'projectName', 'subprojectID', 'subprojectName', 'userID', 'currentuser', 'userName', 'location', 'connected'],
    components: { Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('StoryEdit.vue', trace.value)
        consoleLog('StoryEdit.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }


        const projectName = ref(props.projectName)
        const projectID = ref(props.projectID)
        const subprojectName = ref(props.subprojectName)
        const subprojectID = ref(props.subprojectID)
        const userID = ref(props.userID)
        const userName = ref(props.currentuser)
        const story = ref([])
        const storyID = ref(props.id)
        const storyheaderID = ref(0)
        const storyName = ref('')
        const graphLabel = ref('')
        const storysetName = ref('')
        const comment = ref('')
        const scenarioID = ref(0)
        const suiteID = ref(0)
        const location = ref(props.location)
        const activeID = ref(1)
        const actives = ref([{ activeID: '1', active: 'Active' }, { activeID: '0', active: 'Not Active' }, { activeID: '2', active: 'Comment' }])
        const selectedActive = ref({ id: activeID.value })
        const selectorID = ref(1)
        const selectors = ref([{ selectorID: '1', selector: 'Scenario' }, { selectorID: '2', selector: 'Suite' }])
        const selectedSelector = ref({ id: selectorID.value })
        const scenarioParam1 = ref(0)
        const scenarioParam2 = ref('')
        const suiteParam1 = ref(0)
        const suiteParam2 = ref('')

        // --------------------------------------------------------------------
        // Check if we received a scenarioID from the scenario screen
        // format: scenario=<storyID>=<scenarioID>=<comment>
        // --------------------------------------------------------------------
        if (location.value != undefined) {
            if (location.value.includes('scenario=')) {
                // split the location to find the keywords
                let data = location.value.split("=");
                console.log(data)
                if (data[2] != undefined) scenarioParam1.value = data[2]
                if (data[3] != undefined) scenarioParam2.value = data[3]
                suiteParam1.value = 0
                suiteParam2.value = ''
                selectorID.value = 1
            } else if (location.value.includes('suite=')) {
                // split the location to find the keywords
                let data = location.value.split("=");
                console.log(data)
                if (data[2] != undefined) suiteParam1.value = data[2]
                if (data[3] != undefined) suiteParam2.value = data[3]
                selectorID.value = 2
                scenarioParam1.value = 0
                scenarioParam2.value = ''
            }
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
            consoleLog('StoryEdit.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        // --------------------------------------------------------------------------
        // Get the story data
        // --------------------------------------------------------------------------
        const { error, loadStory } = getStory(storyID.value)
        loadStory(story, trace.value)
            .then(function () {
                consoleLog('StoryEdit.vue/getStory', 2, '------ story: ' + storyID.value, trace.value)
                if (story.value.success && story.value.data.length) {
                    story.value = story.value.data
                    consoleLog('Storys.vue/loadStoryData', 2, story, trace.value)
                    subprojectID.value = story.value[0].subprojectID
                    storyheaderID.value = story.value[0].storyheaderID
                    storysetName.value = story.value[0].headerlabel
                    storyName.value = story.value[0].story
                    graphLabel.value = story.value[0].graphlabel
                    comment.value = story.value[0].comment
                    scenarioID.value = story.value[0].scenarioID
                    if (scenarioParam1.value != 0) scenarioID.value = scenarioParam1.value
                    if (scenarioParam2.value != '') comment.value = scenarioParam2.value
                    suiteID.value = story.value[0].suiteID
                    if (suiteParam1.value != 0) suiteID.value = suiteParam1.value
                    if (suiteParam2.value != '') comment.value = suiteParam2.value

                    // Scenario/ Suite selector
                    if (scenarioID.value == 0 && suiteID.value == 0) selectorID.value = 1
                    else if (scenarioID.value == 0) selectorID.value = 2
                    else selectorID.value = 1
                    selectedSelector.value = ({ id: selectorID.value })
                    // active selevtor
                    activeID.value = story.value[0].active
                    selectedActive.value = ({ id: activeID.value })
                    return (1)
                } else {
                    consoleLog('Storys.vue/loadStoryData', 2, 'No story found!', trace.value)
                    DisplayError('Internal error: Cannot find the story: ' + storyID.value, 'Alert')
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
            consoleLog('StoryEdit.vue/handleCancel', 2, 'User Cancel the action - storyheaderID: ' + storyheaderID.value, trace.value)
            context.emit('storelocation', 'story=' + storyID.value)
            router.push({ name: 'Stories', params: { id: storyheaderID.value } })
        }

        // -----------------------------------------------------------------------------------
        // leave the screen and go to the Storys screen (used by the function DisplayError)
        // -----------------------------------------------------------------------------------
        const gotoStories = () => {
            consoleLog('StoryEdit.vue/gotoStories', 2, 'goto the storys screen - storyheaderID: ' + storyheaderID.value, trace.value)
            router.push({ name: 'Stories', params: { id: storyheaderID.value } })
        }

        // --------------------------------------------------------------------------
        // User selects another active value, store the current ID
        // --------------------------------------------------------------------------
        const handleActiveChange = () => {
            consoleLog('StoryEdit.vue/handleActiveChange', 2, 'User changed the active value: ' + selectedActive.value.id, trace.value)
            activeID.value = selectedActive.value.id
        }

        // --------------------------------------------------------------------------
        // User selects another selector, reset the scenarioID and the suiteID
        // --------------------------------------------------------------------------
        const handleSelectorChange = () => {
            consoleLog('StoryEdit.vue/handleActiveChange', 2, 'User changed the selector: ' + selectedSelector.value.id, trace.value)
            selectorID.value = selectedSelector.value.id
            scenarioID.value = 0
            suiteID.value = 0
        }

        // --------------------------------------------------------------------------
        // User ask to go to the scenario
        // --------------------------------------------------------------------------
        const handleScenario = async () => {
            consoleLog('StoryEdit.vue/handleScenario', 2, 'User ask to go to scenario', trace.value)
            let ret = await saveData()
            if (ret) {
                // format: story=<storyID>=<scenarioID>=<suiteID> in this case suiteID = 0
                context.emit('storelocation', 'story=' + storyID.value)
                router.push({ name: 'Scenarios' })
            } else {
                // Error during insert found!
                consoleLog('StoryEdit.vue/handleSubmit', 2, 'Message KO: ' + story.value.message, trace.value)
                DisplayError(story.value.message, 'Alert')
            }
        }

        // --------------------------------------------------------------------------
        // User ask to go to the suite
        // --------------------------------------------------------------------------
        const handleSuite = async () => {
            consoleLog('StoryEdit.vue/handleSuite', 2, 'User ask to go to suite', trace.value)
            let ret = await saveData()
            if (ret) {
                // format: story=<storyID>=<scenarioID>=<suiteID> in this case scenarioID = 0
                context.emit('storelocation', 'story=' + storyID.value)
                router.push({ name: 'Suite Set' })
            } else {
                // Error during insert found!
                consoleLog('StoryEdit.vue/handleSubmit', 2, 'Message KO: ' + story.value.message, trace.value)
                DisplayError(story.value.message, 'Alert')
            }
        }

        // --------------------------------------------------------------------------
        // Save the data
        // --------------------------------------------------------------------------
        const saveData = async () => {
            // storyName, graphlabel, scenarioID, suiteID, active, storyID
            const { error, updateTheStory } = updateStory(storyName.value, graphLabel.value, scenarioID.value, suiteID.value, comment.value, selectedActive.value.id, storyID.value)
            return await updateTheStory(story, trace.value)
                .then(function () {
                    consoleLog('StoryEdit.vue/handleSubmit', 2, '------ Update a story - storyID: ' + storyID.value, trace.value)
                    consoleLog('StoryEdit.vue/handleSubmit', 2, story.value, trace.value)
                    consoleLog('StoryEdit.vue/handleSubmit', 2, 'Success: ' + story.value.success, trace.value)
                    return story.value.success
                })
        }


        // --------------------------------------------------------------------------
        // User submit the data
        // --------------------------------------------------------------------------
        const handleSubmit = async () => {
            consoleLog('StoryEdit.vue/handleSubmit', 2, 'User Submit the action', trace.value)
            context.emit('storelocation', 'story=' + storyID.value)
            // check that at least a scenario or a suite has been selected
            if (scenarioID.value == 0 && suiteID.value == 0) {
                DisplayError('Please, select a scenario or a suite!', 'Alert')
                //return 0
            }
            let ret = await saveData()
            if (ret) {
                consoleLog('StoryEdit.vue/handleSubmit', 2, 'Message OK: ' + story.value.message, trace.value)
                DisplayError(story.value.message, 'Info', gotoStories)
            } else {
                // Error during insert found!
                consoleLog('StoryEdit.vue/handleSubmit', 2, 'Message KO: ' + story.value.message, trace.value)
                DisplayError(story.value.message, 'Alert')
            }
        }

        return {
            errorMessage, styleMessage, story, projectName, projectID, subprojectName, subprojectID, userID, userName,
            storysetName, storyName, graphLabel, scenarioID, comment, activeID, actives, selectedActive, selectorID, selectors, selectedSelector,
            scenarioID, suiteID,
            handleCancel, handleSubmit, handleFocus, handleBlur, handleActiveChange, handleScenario, handleSuite, handleSelectorChange
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
</style>