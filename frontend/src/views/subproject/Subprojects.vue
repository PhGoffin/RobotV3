<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ projectName }}<br>-- Subprojects --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="subproject">

                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <button @click="handleAdd">
                    <i class="fa-solid fa-circle-plus"></i>
                    Subproject</button>

                <div class="entities" height="150px">
                    <div v-if="error"> {{ error }}</div>
                    <div v-if="subprojects.length" class="layout">
                        <SubprojectsList class="subprojectsList" :subprojects="subprojects" :projectID="projectID"
                            :superUser="superUser" :trace="trace" @refreshsubprojects="refreshSubprojects"
                            @selectrecord="selectRecord" @handlemove="handleMove" />
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SubprojectsList from '../../components/subproject/SubprojectsList.vue'
import getAllSubprojects from '../../composables/subproject/getAllSubprojects'
import getProject from '../../composables/project/getProject'
import updatePositionSubproject from '../../composables/subproject/updatePositionSubproject'
import reorderSubprojects from '../../composables/subproject/reorderSubprojects'


import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Subproject',
    props: ['trace', 'id', 'superUser', 'connected'],
    components: { SubprojectsList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])


        displayMsg('Subprojects.vue', trace.value)
        consoleLog('Subprojects.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }


        const projectID = ref(props.id)
        const projectName = ref('')
        const project = ref([])
        const superUser = ref(props.superUser)
        const subprojects = ref([])

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
            consoleLog('Subprojects.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }

        // -------------------------------------------
        // load all the data of a a project 
        // -------------------------------------------
        const { error, loadProject } = getProject(projectID.value)
        loadProject(project, trace.value)
            .then(function () {
                consoleLog('UsersProject.vue/getProject', 2, '------ project: ' + projectID.value, trace.value)
                consoleLog('UsersProject.vue/getProject', 2, project.value, trace.value)
                projectName.value = project.value.project
                consoleLog('UsersProject.vue/getProject', 2, 'Emit a request to the parent to store the contract (' + projectID.value + ') ' + projectName.value, trace.value)
                context.emit('storecontract', projectID.value, projectName.value)
            })

        const loadSubprojectData = async () => {
            // -------------------------------------------
            // load all the subprojects of a project 
            // -------------------------------------------
            consoleLog('Subprojects.vue/loadSubprojectData', 2, 'Loading subprojects by project', trace.value)
            const { error, loadSubprojects } = getAllSubprojects(projectID.value)
            loadSubprojects(subprojects, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Subprojects.vue/loadSubprojectData', 2, 'Subproject Loaded by Project - status: ' + subprojects.value.success, trace.value)
                    if (subprojects.value.success && subprojects.value.data.length) {
                        subprojects.value = subprojects.value.data
                        consoleLog('Subprojects.vue/loadSubprojectData', 2, subprojects, trace.value)
                        return (1)
                    } else {
                        consoleLog('Subprojects.vue/loadSubprojectData', 2, 'No project found!', trace.value)
                        return (0)
                    }
                })
        }


        // Load projects data
        loadSubprojectData()

        // --------------------------------------------------------------------------
        // SubprojectSingle emits a request to refresh the subcontracts
        // --------------------------------------------------------------------------
        const refreshSubprojects = (status, msg) => {
            consoleLog('Subprojects.vue/refreshSubprojects', 2, 'received a request to refresh the subprojects from SubprojectList / SubprojectSingle', trace.value)
            consoleLog('Subprojects.vue/refreshSubprojects', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadSubprojectData()
        }

        // --------------------------------------------------------------------------
        // Call the API to reorder correctly all the positions of the subprojects 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let subproject = ref([])
            consoleLog('Subprojects.vue/doReorder', 2, 'Reorder all the positions of the Subproject', trace.value)
            const { error, reorderTheSubprojects } = reorderSubprojects(projectID.value)
            return await reorderTheSubprojects(subprojects, trace.value)
                .then(function () {
                    // check the status of the reorder
                    // consoleLog('Subprojects.vue/doReorder', 2, 'Subproject reorder status: ' + subproject.value.success, trace.value)
                    // if (subproject.value.success) {
                    //     consoleLog('Subprojects.vue/doReorder', 2, subproject, trace.value)
                    //     return (1)
                    // } else {
                    //     consoleLog('Subprojects.vue/doReorder', 2, 'Error during the reorder of the subprojects position', trace.value)
                    //     consoleLog('Subprojects.vue/doReorder', 2, subproject, trace.value)

                    //     DisplayError('Internal Error during the reorder', 'Error')
                    //     return (0)
                    // }
                    return (1)
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to update the position of a subproject 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (subprojectID, position) => {

            let subproject = []
            consoleLog('subprojects.vue/doUpdatePosition', 2, 'Change the position of a subproject - subprojectID: ' + subprojectID + ', position: ' + position, trace.value)
            const { error, updateThePosition } = updatePositionSubproject(subprojectID, position)
            return await updateThePosition(subproject, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('subprojects.vue/doUpdatePosition', 2, 'subproject status: ' + subproject.value.success, trace.value)
                    if (subproject.value.success) {
                        consoleLog('subprojects.vue/doUpdatePosition', 2, subproject, trace.value)
                        return (1)
                    } else {
                        consoleLog('subprojects.vue/doUpdatePosition', 2, 'Error during the update of the subproject position', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Subpoject received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (subprojectID) => {
            consoleLog('subprojects.vue/selectRecord', 2, 'Received a request to select a record: ' + subprojectID, trace.value)
            if (!recordSelected.value.includes(subprojectID)) {
                recordSelected.value.push(subprojectID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != subprojectID)
            }
            consoleLog('subprojects.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('subprojects.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // Subproject received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('subprojects.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' subproject(s) after the subproject position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.padStart(6, '0') + 'M'
                consoleLog('subprojects.vue/handleMove', 2, '************** Position: ' + position, trace.value)
                // Update the position of all the selected subproject(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected subproject(s) reorder successfully', 'Info')
                }
                await doReorder()
                // Refresh the list
                await loadSubprojectData()
                recordSelected.value = []
            }
        }

        // --------------------------------------------------------------------------
        // User cancel the action, Back to the projects
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('Subprojects.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'Projects' })
        }


        // --------------------------------------------------------------------------
        // User asks to add a new subproject
        // --------------------------------------------------------------------------
        const handleAdd = () => {
            consoleLog('Subprojects.vue/handleAdd', 2, 'Add a new project', trace.value)
            router.push({ name: 'SubprojectAdd' })
        }


        return {
            errorMessage, styleMessage, projectID, projectName, subprojects, superUser, trace,
            handleCancel, handleAdd, refreshSubprojects, selectRecord, handleMove
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

.subproject {
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
.entities {
    overflow: scroll;
    scrollbar-width: thin;
    height: 50rem;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>