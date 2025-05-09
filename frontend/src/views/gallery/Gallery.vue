<template>
    <div class="my-container" @keyup.esc="handleCancel" @keydown.left="handleGalleryPrevious"
        @keydown.right="handleGalleryNext" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">Gallery</h3>
                <div class="actions">
                    <button @click="handleGalleryPrevious"><i class="fa-solid fa-backward"></i> </button>
                    <button @click="handleGalleryNext"><i class="fa-solid fa-forward"></i></button>
                </div>


                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">
                <h1 class="title">Gallery of the print screens - slot:
                    <span class="subtitle" v-if="slot == 0"> Error </span>
                    <span class="subtitle" v-else>User {{ slot }}</span>
                </h1>

                <div class="actions">
                    <img class="printscreen" v-bind:src="require(`../../../../printscreen/${imagePath}`)" alt="print screen"
                        v-if="imageExists">
                    <img class="printscreen" style="width: 40rem; height:40rem;" src="../../assets/filenotfound.png"
                        alt="robot" v-else>
                </div>

                <button @click="handleCancel" class="cancel">
                    <i class="fa-solid fa-ban"></i>
                    Cancel</button>


            </div>
        </div>


    </div>
</template>

<script>
import { computed, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug'
import fileExist from '../../composables/selenium/fileExist'



export default {
    name: 'Workspace',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'connected', 'workspaceID', 'workspace', 'projectID', 'projectName', 'connected'],
    components: { Spinner },


    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const userID = ref(props.userID)
        const slot = ref(0)
        const imagePath = ref('')
        const imageExists = ref(false)

        displayMsg('Gallery.vue', trace.value)
        consoleLog('Gallery.vue - props', 1, props, trace.value)

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
            consoleLog('Gallery.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }

        // ---------------------------------------------
        // Compute the datasets depending of the filter
        // ---------------------------------------------
        // const imagePath = computed(() => {
        //     consoleLog('Gallery.vue/imagePath', 2, 'computed value', trace.value)
        //     //return '../../../../printscreen/' + userID.value + '_image' + slot.value + '.png'
        //     return '../../assets/RobotV2.png'    
        // });


        // --------------------------------------------------------------------------
        // User cancel the action, Back to the control panel
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('Gallery.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'Logfiles' })
        }

        // --------------------------------------------------------------------------
        // User asks to see the previous picture
        // --------------------------------------------------------------------------
        const handleGalleryPrevious = () => {
            consoleLog('Gallery.vue/handleGalleryPrevious', 2, 'User clicks on Previous', trace.value)
            slot.value = slot.value - 1
            if (slot.value < 0) slot.value = 5
            // check if picture exists for the slot
            fileCheck(slot.value)
        }

        // --------------------------------------------------------------------------
        // User asks to see the next picture
        // --------------------------------------------------------------------------
        const handleGalleryNext = () => {
            consoleLog('Gallery.vue/handleGalleryPrevious', 2, 'User clicks on Next', trace.value)
            slot.value = slot.value + 1
            if (slot.value > 5) slot.value = 0
            // check if picture exists for the slot
            fileCheck(slot.value)
        }


        // --------------------------------------------------------------------------
        // Check if a file exists
        // --------------------------------------------------------------------------
        const fileCheck = async (slotID) => {

            const selenium = []
            let fileName = './printscreen/' + userID.value + '_image' + slotID + '.png'
            consoleLog('Gallery.vue/fileCheck', 2, ' fileName: ' + fileName, trace.value)

            const { error, checkFile } = fileExist(fileName, trace.value)
            return await checkFile(selenium, trace.value)
                .then(function () {
                    consoleLog('Gallery.vue/fileCheck', 2, selenium.value.success, trace.value)
                    consoleLog('Gallery.vue/fileCheck', 2, selenium.value.message, trace.value)
                    if (selenium.value.success) {
                        consoleLog('Gallery.vue/fileCheck', 2, 'file Exists', trace.value)
                        imagePath.value = userID.value + '_image' + slotID + '.png'
                        imageExists.value = true
                    } else {
                        consoleLog('Gallery.vue/fileCheck', 2, "file doesn't Exist", trace.value)
                        //imagePath.value = "RobotV2.png"
                        imageExists.value = false
                    }
                })
        }

        fileCheck(0)


        return {
            errorMessage, styleMessage, trace, slot, imagePath, imageExists,
            handleCancel, handleGalleryNext, handleGalleryPrevious
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
    grid-template-columns: 20% 1fr;
}

.banner {
    background-color: #1abc9c;
    position: relative;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.2);
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
    top: 15rem;
    left: 20%;
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

.entity .title {
    padding: 2.3rem 2.2rem;
    color: #1abc9c;
    font-weight: bold;
    font-size: 1.5rem;
    line-height: 1;
    margin-bottom: 0.7rem;
}

.entity .subtitle {
    color: #1abc9c;
    font-weight: bold;
    font-size: 1.5rem;
    line-height: 1;
    margin-bottom: 0.7rem;
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

.printscreen {
    width: 95%;
}
</style>