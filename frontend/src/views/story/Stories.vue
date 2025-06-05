<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ subprojectName }}<br>{{ storyName }}<br>-- Steps --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <button @click="handleInsert('0')">
                    <i class="fa-solid fa-circle-plus"></i>
                    Story</button>



                <form @submit.prevent="">

                    <table>
                        <tbody>
                            <tr>
                                <td class="menu">
                                    <div class="input-container focus" style="max-width: 10rem">
                                        <input type="text" name="RowNb" class="input" @focus="handleFocus($event)"
                                            @blur="handleBlur($event)" @change="handleRowToInsert" v-model="rowToInsert"
                                            required />
                                        <label>Row(s) to insert</label>
                                        <span>Row(s) to insert</span>
                                    </div>
                                </td>
                                <td class="menu">
                                    <div class="actions3">
                                        <div class="input-container focus" style="min-width: 30rem; max-width: 30rem">
                                            <input type="text" name="dataFilter" class="input"
                                                @focus="handleFocus($event)"
                                                title="You can filter by the code, label or by comment"
                                                @blur="handleBlur($event)" v-model="filterValue" />
                                            <label>Filter {{ filteredRows }}</label>
                                            <span>Filter {{ filteredRows }}</span>
                                        </div>
                                        <i class="fa-regular fa-trash-can" @click="filterValue = ''"
                                            title="Reset the filter"></i>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </form>

                <div class="entities" height="150px">
                    <div v-if="error"> {{ error }}</div>
                    <div v-if="filteredData.length" class="layout">
                        <StoriesList class="storiesList" :stories="filteredData" :workspaceID="workspaceID"
                            :workspace="workspace" :superUser="superUser" :projectID="projectID"
                            :subprojectID="subprojectID" :userID="userID" :trace="trace"
                            @refreshstories="refreshStories" @selectrecord="selectRecord" @handleinsert="handleInsert"
                            @handlemove="handleMove" @handledelete="handleDelete" />
                    </div>
                </div>
                <div class="input-group">
                    <button @click="handleCancel" class="cancel">
                        <i class="fa-solid fa-ban"></i>
                        OK</button>
                </div>

            </div>
        </div>


    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import StoriesList from '../../components/story/StoriesList.vue'
import getStoryByHeader from '../../composables/story/getStoryByHeader'
import updatePositionStory from '../../composables/story/updatePositionStory'
import reorderStory from '../../composables/story/reorderStory'
import addStory from '../../composables/story/addStory'
import deleteStory from '../../composables/story/deleteStory'

import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Story',
    props: ['id', 'trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'subprojectID', 'subprojectName', 'location'],
    components: { StoriesList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const recordTarget = ref(0)
        const rowToInsert = ref(1)


        displayMsg('Story.vue', trace.value)
        consoleLog('Story.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }


        const workspaceID = ref(props.workspaceID)
        const workspace = ref(props.workspace)
        const projectID = ref(props.projectID)
        const projectName = ref(props.projectName)
        const subprojectID = ref(props.subprojectID)
        const subprojectName = ref(props.subprojectName)
        const userID = ref(props.userID)
        const superUser = ref(props.superUser)
        const storyheaderID = ref(props.id)
        const stories = ref([])
        const displayInfo = ref('')
        const storyName = ref('')
        const location = ref(props.location)
        const filterValue = ref('')



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
            consoleLog('Story.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        const loadStoryData = async () => {

            // -------------------------------------------
            // load all the stories of the story header 
            // -------------------------------------------
            consoleLog('Story.vue/loadStoryData', 2, 'Loading story by story header', trace.value)
            const { error, loadStory } = getStoryByHeader(storyheaderID.value, '%')
            loadStory(stories, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Story.vue/loadStoryData', 2, 'Stories status: ' + stories.value.success, trace.value)
                    if (stories.value.success && stories.value.data.length) {
                        stories.value = stories.value.data
                        filteredData.value = stories.value
                        storyName.value = stories.value[0].headerlabel
                        consoleLog('Story.vue/loadStoryData', 2, stories.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('Story.vue/loadStoryData', 2, 'No story found!', trace.value)
                        return (0)
                    }
                })

        }


        // Load projects data
        loadStoryData()


        // ---------------------------------------------
        // Compute the stories depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('Story.vue/filteredData', 2, 'computed value', trace.value)
            if (stories.value.length) {
                return stories.value.filter((ar) => ar.story.toUpperCase().includes(filterValue.value.toUpperCase()))
            } else {
                filteredRows.value = ''
                return stories.value
            }
        });

        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })


        // --------------------------------------------------------------------------
        // StorySingle emits a request to refresh the stories
        // --------------------------------------------------------------------------
        const refreshStories = (status, msg) => {
            consoleLog('Story.vue/refreshStories', 2, 'received a request to refresh the stories  from StoriesList / StorySingle', trace.value)
            consoleLog('Story.vue/refreshStories', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadStoryData()
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
        // User cancel the action, Back to the control panel
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('Story.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'Story Set' })
        }


        // --------------------------------------------------------------------------
        // User change the row number
        // --------------------------------------------------------------------------
        const handleRowToInsert = () => {
            if (rowToInsert.value < 1 || rowToInsert.value > 10) {
                DisplayError('Row(s) to insert must be between 1 and 10', 'Warning')
                rowToInsert.value = 1
            }
        }


        // --------------------------------------------------------------------------
        // Call the API to reorder correctly all the positions of the stories 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let story = []
            consoleLog('Story.vue/doReorder', 2, 'Reorder all the positions of the Stories', trace.value)
            const { error, reorderTheStory } = reorderStory(storyheaderID.value)
            return await reorderTheStory(story, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Story.vue/doReorder', 2, 'Story reorder status: ' + story.value.success, trace.value)
                    if (story.value.success) {
                        consoleLog('Story.vue/doReorder', 2, story, trace.value)
                        return (1)
                    } else {
                        consoleLog('Story.vue/doReorder', 2, 'Error during the reorder of the stories position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert a story 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let story = []
            let storyName = 'New'

            consoleLog('Story.vue/doInsert', 2, 'Insert a new Story', trace.value)
            // storyheaderID, scenarioID, suiteID, story, graphlabel, position, active
            const { error, addNewStory } = addStory(storyheaderID.value, 0, 0, storyName, '', position, 1)
            return await addNewStory(story, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Story.vue/doInsert', 2, 'Story insert status: ' + story.value.success, trace.value)
                    if (story.value.success) {
                        consoleLog('Story.vue/doInsert', 2, story, trace.value)
                        return (1)
                    } else {
                        consoleLog('Story.vue/doInsert', 2, 'Error during the insert of a story', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a story 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (storyID, position) => {

            let story = []
            consoleLog('Story.vue/doUpdatePosition', 2, 'Change the position of a Story - storyID: ' + storyID + ', position: ' + position, trace.value)
            const { error, updateThePosition } = updatePositionStory(storyID, position)
            return await updateThePosition(story, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('Story.vue/doUpdatePosition', 2, 'Story status: ' + story.value.success, trace.value)
                    if (story.value.success) {
                        consoleLog('Story.vue/doUpdatePosition', 2, story, trace.value)
                        return (1)
                    } else {
                        consoleLog('Story.vue/doUpdatePosition', 2, 'Error during the update of the story position', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete a story 
        // --------------------------------------------------------------------------
        const doDelete = async (storyID) => {
            let story = []
            consoleLog('Story.vue/doDelete', 2, 'Delete an existing Story ' + storyID, trace.value)
            const { error, deleteTheStory } = deleteStory(storyID)
            return await deleteTheStory(story, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Story.vue/doDelete', 2, 'Story delete status: ' + story.value.success, trace.value)
                    if (story.value.success) {
                        consoleLog('Story.vue/doDelete', 2, story, trace.value)
                        return (1)
                    } else {
                        consoleLog('Story.vue/doDelete', 2, 'Error during the delete of a story', trace.value)
                        return (0)
                    }
                })
        }



        // --------------------------------------------------------------------------
        // Stories received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (storyID) => {
            consoleLog('Story.vue/selectRecord', 2, 'Received a request to select a record: ' + storyID, trace.value)
            if (!recordSelected.value.includes(storyID)) {
                recordSelected.value.push(storyID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != storyID)
            }
            consoleLog('Story.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('Story.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // Stories received a request to add a new Story
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('Story.vue/handleInsert', 2, 'Add ' + rowToInsert.value + ' new empty story(s) after the Story position: ' + position, trace.value)
            position = position.toString().padStart(6, '0') + 'I'
            let status = 1;
            let err = 1;
            for (let i = 1; i <= rowToInsert.value; i++) {
                //console.log (' ******** 1 ******* Loop: ' + i)
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a story', 'Alert')
            } else {
                DisplayError('Inserted ' + rowToInsert.value + ' story(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            //console.log (' ******** 2 ******* reorder')
            await doReorder()
            // Refresh the list
            //console.log (' ******** 3 ******* refresh')
            await loadStoryData()

        }



        // --------------------------------------------------------------------------
        // Stories received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('Story.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' story(s) after the Story position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.toString().padStart(6, '0') + 'M'
                //console.log (' ******** 1 ******* Loop')
                // Update the position of all the selected story(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected story(s) reorder successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadStoryData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // Stories received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (storyID) => {
            consoleLog('Story.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' story(s) and the Story: ' + storyID, trace.value)
            let status = 1;
            //console.log (' ******** 1 ******* Loop')

            // Add the storyID if it's not already in the list
            if (!recordSelected.value.includes(storyID)) {
                recordSelected.value.push(storyID)
            }

            // Delete the selected story(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected story(s)', 'Alert')
            } else {
                DisplayError('Selected story(s) deleted successfully', 'Info')
            }
            //console.log (' ******** 2 ******* refresh')
            // Refresh the list
            await loadStoryData()
            recordSelected.value = []
        }



        return {
            errorMessage, styleMessage, stories, storyName, filteredData, filterValue, filteredRows, workspaceID, workspace,
            superUser, projectID, projectName, subprojectID, subprojectName, userID, displayInfo, trace, rowToInsert,
            handleCancel, refreshStories, handleInsert, handleMove, handleDelete, selectRecord,
            handleFocus, handleBlur, handleCancel, handleRowToInsert
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
    scrollbar-width: thin;
    height: 50rem;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>