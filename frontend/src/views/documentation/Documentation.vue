<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">ROBOT<br>-- Documentation --
                    <form @submit.prevent="handleSubmit">
                            <button @click="handleCancel" class="cancel">
                                <i class="fa-solid fa-ban"></i>
                                Cancel</button>
                    </form>
                </h3>
                <img src="../../assets/RobotV2.png" alt="robot">


                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">


                <!-- Display the tiles for the menus and the roles -->
                <div class="container">
                    <div class="menu">
                        <transition-group appear tag="ul" @before-enter="beforeEnter" @enter="enter">
                            <li v-for="(icon, index) in icons" :key="icon.name99" :data-index="index" @click="handleMenu">
                                <i :class="icon.class"></i>
                                <!-- <div>{{ icon.text }}</div> -->
                                <p>
                                    <a :href="icon.name" target="_blank">{{ icon.text }}</a>
                                </p>
                            </li>
                        </transition-group>
                    </div>

                    <div class="role">
                        <transition-group appear tag="ul" @before-enter="beforeEnter" @enter="enter">
                            <li v-for="(icon, index) in roles" :key="icon.class" :data-index="index"
                                @click="handleRole(icon.name)" :class="role == icon.name ? 'selected' : 'normal'">
                                <i :class="icon.class"></i>
                                <div>{{ icon.text }}</div>
                            </li>
                        </transition-group>
                    </div>
                </div>

            </div>
        </div>


    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Message from '../../components/Message.vue'
import gsap from 'gsap'
import { displayMsg, consoleLog } from '../../util/debug';


export default {
    name: "controlpanel",
    props: ['trace', 'userrole', 'role', 'currentuser', 'currentRole', 'userID', 'superUser', 'role', 'connected', 'workspaceID', 'workspace',
        'projectID', 'projectName', 'subprojectID', 'subprojectName'],
    components: { Message },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        //console.log (props)
        displayMsg('ControlPanel.vue', trace.value)
        consoleLog('ControlPanel.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Management of the errors
        // -------------------------------------------
        const errorMessage = ref('')
        const styleMessage = ref('')
        // Display error message on the screen
        const DisplayError = (myMessage, myStyle) => {
            errorMessage.value = myMessage
            styleMessage.value = myStyle
            setTimeout(() => errorMessage.value = '', 3000)
        }

        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }

        // get the user information from the parent
        const workspaceID = ref(props.workspaceID)
        const workspaceName = ref(props.workspace)
        const userrole = ref(props.userrole)
        const currentRole = ref(props.currentRole)
        const username = ref(props.currentuser)
        const userID = ref(props.userID)
        const superUser = ref(props.superUser)
        const role = ref(props.role)

        // declare the projects and the subprojects
        const projectID = ref(props.projectID)
        const projectName = ref(props.projectName)



        // ----------------------------------------------------------------------------
        // User selects another role, store this information for later
        // ----------------------------------------------------------------------------
        const handleRole = (selectedRole) => {
            consoleLog('ControlPanel.vue/handleRole', 2, 'selectedRole: ' + selectedRole, trace.value)
            role.value = selectedRole
            context.emit('currentrole', role.value)
        }



        // ----------------------------------------------------------------------------
        // Setup the icons for the menu and the role
        // ----------------------------------------------------------------------------
        const iconsRole = ref([
            { class: 'fa-solid fa-book', text: 'Tester Manual', name: './documentation/TesterUserManual.pdf', role: 'Tester' },
            { class: 'fa-solid fa-book', text: 'Flyer', name: './documentation/Flyer.pdf', role: 'Tester' },
            { class: 'fa-solid fa-book', text: 'Designer Manual', name: './documentation/DesignerUserManual.pdf', role: 'Designer' },
            { class: 'fa-solid fa-book', text: 'Function Manual', name: './documentation/FunctionsUserManual.pdf', role: 'Designer' },
            { class: 'fa-solid fa-book', text: 'Good Practices', name: './documentation/GoodPracticesForAutomatedTests.pdf', role: 'Designer' },
            { class: 'fa-solid fa-book', text: 'Natural Language', name: './documentation/NaturalUserManual.pdf', role: 'Designer' },
            { class: 'fa-solid fa-book', text: 'Admin Manual', name: './documentation/AdminUserManual.pdf', role: 'Admin' },
            { class: 'fa-solid fa-book', text: 'AI Robot Manual', name: './documentation/AIRobotUserManual.pdf', role: 'Admin' },
            { class: 'fa-solid fa-book', text: 'Robot Presentation', name: './documentation/RobotDemoV2.pdf', role: 'Admin' },
        ])

        const iconsUserRole = ref([
            { class: 'fa-solid fa-user-gear', text: 'Tester', name: 'Tester', role: 'Designer*Admin*Super' },
            { class: 'fa-solid fa-person-shelter', text: 'Designer', name: 'Designer', role: 'Designer*Admin*Super' },
            { class: 'fa-solid fa-person-military-pointing', text: 'Admin', name: 'Admin', role: 'Admin*Super' },
            { class: 'fa-solid fa-user-secret', text: 'Super', name: 'Super', role: 'Super' },
        ])

        const icons = computed(() => {
            return iconsRole.value.filter((i) => i.role == role.value)
        })

        const roles = computed(() => {
            return iconsUserRole.value.filter((u) => u.role.includes(userrole.value))
        })

        // ----------------------------------------------------------------------------
        // Transition functions
        // ----------------------------------------------------------------------------
        const beforeEnter = (el) => {
            el.style.opacity = 0
            el.style.transform = 'translateY(100px)'
        }

        const enter = (el, done) => {
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                onComplete: done,
                delay: el.dataset.index * 0.2
            })
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
        // User cancel the action, leave the screen and returns to the list
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('Documentation.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'ControlPanel' })
        }

        // --------------------------------------------------------------------------
        // User click on the button not on the link
        // --------------------------------------------------------------------------
        const handleMenu = () => {
            DisplayError("Click on the name of the documentation", 'Info')
        }        

        return {
            userrole, username, role, icons, roles,
            errorMessage, styleMessage, workspaceName,
            beforeEnter, enter, handleFocus, handleBlur, handleRole, handleCancel, handleMenu
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

.container {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
    padding: 10px;
    height: 80%;
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
    top: 12rem;
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

    background: linear-gradient(to right, #b4dcd4, #4cbf91);
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
    margin-left: 1rem;
}

.input {
    width: 100%;
    outline: none;
    border: 2px solid #c98072;
    /* border: 2px solid #3d3c3c; */
    /* border-bottom: 0.1rem solid #c98072; */

    /* background: none; */
    background-color: #d3dad8;

    padding: 0.6rem 1.2rem;
    color: #3d3c3c;
    font-weight: 500;
    font-size: 0.95rem;
    letter-spacing: 0.5px;
    border-radius: 25px;
    transition: 0.3s;
}

.input.disabled {
    background-color: #b9bbba;
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
    /* background-color: #eee; */
    background-color: #90cabe;
    ;
    height: 100%;
}

th.menu,
td.menu {
    padding: 0 1.2rem 0 0;
    text-align: left;
}

.menu ul {
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 20px;
    max-width: 600px;
    margin: 60px auto;
}

.menu li {
    list-style-type: none;
    /* background: white; */
    background: rgb(188, 229, 236);        
    padding: 30px;
    border-radius: 10px;
    box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    line-height: 1.5em;
}


.menu li i {
    font-size: 40px;
    color: #DAA82E;
}


.menu li:hover {
    background: #e0dfdf
}


.menu ul {
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 20px;
    max-width: 600px;
    margin: 60px auto;
}


.menu li span {
    font-size: 40px;
    color: #DAA82E;
}


.menu li:hover {
    background: #e0dfdf
}


.role ul {
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    max-width: 400px;
    margin: 60px auto;
}

.role li.normal {
    list-style-type: none;
    background: rgb(203, 222, 228);
    padding: 30px;
    border-radius: 10px;
    box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    line-height: 1.5em;
}

.role li.selected {
    list-style-type: none;
    background: rgb(183, 247, 140);
    padding: 30px;
    border-radius: 10px;
    box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    line-height: 1.5em;
}


.role li i {
    font-size: 40px;
    color: #C2604D;
}

.role li:hover {
    background: rgb(161, 212, 228);
}

.selectData {
    position: relative;
    top: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 50px;
    height: 20px;
    border-bottom: 0.1rem solid #c98072;

}

.selectData div {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* .selectData select {
    background: #d3d0d0;
    color: #555;
    margin: 0 auto;
    padding: 0;
    width: 150px;
} */

.selectData label {
    margin: 0 auto;
    padding: 10px;
    font-weight: bold;
    font-size: small;
    text-align: right;
}
</style>