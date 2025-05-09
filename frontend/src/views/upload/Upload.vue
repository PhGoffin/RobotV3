<template>

    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">

            <div class="banner">
                <h3 class="title">{{ projectName }}<br>-- Upload File --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div>

                <form @submit.prevent="handleSubmit" enctype="multipart/form-data">

                    <div v-if="showPopup">
                        <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
                    </div>

                    <div class="input-container">
                        <input class="input-file" multiple type="file" @change="handleFileSelected" :key="fileInputKey">
                    </div>


                    <div class="input-container">
                        <div v-for="(file, index) in selectedFiles" :key="index">
                            <div :class="file.invalidMessage ? 'entity invalid' : 'entity selected'">
                                <div class="actions">
                                    <div>&nbsp;&nbsp;{{ index + 1 }}: {{ file.name }}</div>
                                    <div v-if="file.invalidMessage">&nbsp; - {{ file.invalidMessage }}</div>
                                    <div class="icons">

                                        <i class="fa-solid fa-circle-xmark"
                                            @click.prevent="selectedFiles.splice(index, 1); uploadFiles.splice(index, 1)"
                                            title="Remove the file"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="input-container" v-if="uploading">
                        <progress class="progress-bar" :value="progress" max="100">
                            {{ progress }} %
                        </progress>
                    </div>


                    <div class="input-container">
                        <button v-if="submitFlag">
                            <i class="fa-solid fa-circle-check"></i>
                            Upload</button>
                        <button @click="handleCancel" class="cancel">
                            <i class="fa-solid fa-ban"></i>
                            Cancel</button>
                    </div>


                    <div class="input-container">
                        <div v-for="(file, index) in filesUploaded" :key="index">

                            <div class="entity">
                                <div class="actions">
                                    <a :href="URL+ projectID + '_' + projectName + '@' + file.name">{{ index + 1 }}: {{ file.name }}</a>
                                    <div class="icons">
                                        <i class="fa-solid fa-trash-can" @click="handleConfirmation(file.name)"
                                            title="Delete the file"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
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
import listFiles from '../../composables/upload/listFiles'
import deleteUpload from '../../composables/upload/deleteUpload'
import PopupConfirm from '../../components/PopupConfirm.vue'


import _ from 'lodash'
import axios from 'axios'

import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: 'UploadFile',
    props: ['trace', 'projectID', 'projectName', 'userID', 'userName', 'location', 'connected'],
    components: { Spinner, PopupConfirm },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        const projectName = ref(props.projectName)
        const projectID = ref(props.projectID)
        const userID = ref(props.userID)
        const selectedFiles = ref([])
        const uploadFiles = ref([])
        const fileName = ref('')
        const progress = ref(0)
        const uploading = ref(false)
        const showPopup = ref(false)

        const filesUploaded = ref([])  // list of all the files already uploaded
        const fileInputKey = ref(0)
        const submitFlag = ref(0)
        const URL = ref(process.env.VUE_APP_MYSQL_API + 'upload/download/')

        displayMsg('Upload.vue', trace.value)
        consoleLog('Upload.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Management of the errors
        // -------------------------------------------
        const errorMessage = ref('')
        const styleMessage = ref('')


        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }

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
            consoleLog('UserEdit.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }

        // --------------------------------------------------------------------------
        // User cancel the action, leave the screen and returns to the list
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('Upload.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'ControlPanel' })
        }

        // --------------------------------------------------------------------------
        // User cancel the action, leave the screen and returns to the list
        // --------------------------------------------------------------------------
        const loadAllFiles = async () => {
            const myFiles = ref([])

            const { error, listTheFiles } = listFiles(projectID.value, projectName.value)
            return await listTheFiles(myFiles.value, trace.value)
                .then(function () {
                    //console.log('myFiles : ', myFiles.value)
                    //console.log('myFiles success: ', myFiles.value.value.success)
                    if (myFiles.value.value.success) {
                        myFiles.value = myFiles.value.value.data
                        consoleLog('Upload.vue/listFiles', 2, myFiles.value[0], trace.value)
                        filesUploaded.value = []
                        for (let i = 0; i < myFiles.value.length; i++) {
                            filesUploaded.value.push({ 'name': myFiles.value[i] })
                        }
                        //console.log('filesUploaded: ', filesUploaded.value)


                    } else {
                        consoleLog('Upload.vue/listFiles', 2, "No files in the uploads directory", trace.value)
                    }
                })
        }
        loadAllFiles()


        const validate = (file) => {
            // check the size (client check)
            const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
            // Check the extension (client check)
            const allowedTypes = ["image/jpeg", "image/png", "image/gif",
                "application/pdf",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
            if (file.size > MAX_SIZE) {
                return 'Max size is 5 Mo!'
            }
            if (!allowedTypes.includes(file.type)) {
                return 'Only pdf, PowerPoint, Excel and images are allowed!'
            }

            return ""
        }

        // --------------------------------------------------------------------------
        // User select file(s) to upload
        // --------------------------------------------------------------------------
        const handleFileSelected = (event) => {
            consoleLog('Upload.vue/handleFileSelected', 2, 'User select file(s)', trace.value)
            submitFlag.value = 1
            //selectedFiles.value = event.target.files
            uploadFiles.value = [...uploadFiles.value, ...event.target.files]
            selectedFiles.value = [...selectedFiles.value,
            ..._.map(event.target.files, file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                invalidMessage: validate(file)
            }))]
            //console.log('SelectedFiles: ', selectedFiles.value)
        }


        // -------------------------------------------
        // User asks to delete a dataset
        // -------------------------------------------
        const handelDelete = () => {
            const uploadFile = ref([])
            consoleLog('Upload.vue/handelDelete', 2, 'Delete an uploaded file', trace.value)
            const { error, deleteTheUpload } = deleteUpload(projectID.value, projectName.value, fileName.value)
            deleteTheUpload(uploadFile, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Upload.vue/deleteUpload', 2, 'deleteUpload status: ' + uploadFile.value.success, trace.value)
                    if (uploadFile.value.success) {
                        consoleLog('Upload.vue/deleteUpload', 2, uploadFile.value, trace.value)
                        DisplayError('File deleted!', 'Info')
                        loadAllFiles()                        
                        return (1)
                    } else {
                        consoleLog('Upload.vue/deleteUpload', 2, 'No Upload file found!', trace.value)
                        DisplayError('Error during the delete of the upload!', 'Warning')
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // User cancel the delete action
        // --------------------------------------------------------------------------
        const handleConfirmation = (filename) => {
            consoleLog('Upload.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
            fileName.value = filename
            showPopup.value = true
        }

        // --------------------------------------------------------------------------
        // User cancel the delete action
        // --------------------------------------------------------------------------
        const handleCancelDelete = () => {
            consoleLog('Upload.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
            showPopup.value = false
        }


        // --------------------------------------------------------------------------
        // User confirm the delete action
        // --------------------------------------------------------------------------
        const handleConfirmDelete = () => {
            consoleLog('Upload.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
            showPopup.value = false
            handelDelete()
        }


        // --------------------------------------------------------------------------
        // User submit the form (to upload file(s))
        // --------------------------------------------------------------------------
        const handleSubmit = async () => {

            if (!selectedFiles.value.length) return
            submitFlag.value = 0
            consoleLog('Upload.vue/handleSubmit', 2, 'User upload the file(s)', trace.value)
            const url = process.env.VUE_APP_MYSQL_API + 'upload/file'
            const formData = new FormData();
            formData.append('projectID', projectID.value)
            formData.append('projectName', projectName.value)
            _.forEach(uploadFiles.value, file => {
                if (validate(file) === "") {
                    formData.append('files', file)
                }
            })

            try {
                uploading.value = true
                await axios.post(url, formData, {
                    onUploadProgress: e => progress.value = Math.round(e.loaded * 100 / e.total)
                })
                    .then(function (res) {
                        fileInputKey.value = !fileInputKey.value
                        uploading.value = false
                        progress.value = 0
                        if (res.data.success) {
                            DisplayError('File uploaded!', 'Info')
                            selectedFiles.value = []
                            uploadFiles.value = []
                            loadAllFiles()
                        } else {
                            DisplayError(res.data.message, 'Alert')
                            //console.log('Error: ', res.data.message)
                        }
                    })
            } catch (err) {
                DisplayError('Error during the upload of the file!', 'Alert')
                uploading.value = false
                progress.value = 0
                //console.log(err)
            }
        }



        return {
            errorMessage, styleMessage, trace, projectName, projectID, userID, showPopup, URL,
            fileInputKey, submitFlag, selectedFiles, uploadFiles, progress, uploading, filesUploaded,
            handleCancel, handleFileSelected, handleSubmit, handleConfirmation, 
            handelDelete, handleCancelDelete, handleConfirmDelete
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
    position: relative;
    margin: 20px auto;
    background: white;
    padding: 10px 20px;
    border-top-right-radius: 1.5rem;
    box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
    border-left: 4px solid #2300e9;
    width: 80%;
}

.entity.selected {
    background: rgb(247, 239, 193);
    border-left: 4px solid #eed811;
}

.entity.inactive {
    position: relative;
    margin: 20px auto;
    background: white;
    padding: 10px 20px;
    border-radius: 4px;
    box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
    border-left: 4px solid red;
    width: 80%;
}

.entity.invalid {
    background: rgb(247, 199, 193);
    border-left: 4px solid red;
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

.input-file {
    border-radius: 25px;
    border: 2px solid #3d3c3c;
    background-color: #1abc9c;
    color: white;
    padding: 0.6rem 1.2rem;
    cursor: pointer;
}

input[type=file]::file-selector-button {
    border: 2px solid #6c5ce7;
    padding: .2em .4em;
    border-radius: 10px;
    background-color: #d1d0e1;
    transition: 1s;
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

.progress-bar {
    text-align: center;
    padding: 20px 10px;

}
</style>