<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ projectName }}<br>-- Robot --</h3>
                <img src="../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>            
            </div>

            <div class="entity">

                <div class="selectData" v-if="connected">

                    <div class="Row">
                        <div class="input-container focus">
                            <input type="text" name="workspace" class="input disabled" v-model="workspaceName"
                                disabled />
                            <label>Workspace</label>
                            <span>Workspace</span>
                        </div>
                    </div>

                    <div class="Row" v-if="role != 'Guest'">
                        <div class="input-container focus">
                            <select id="project" class="input" v-model="selectedProject" @change="handleProjectChange"
                                @focus="handleFocus($event)" @blur="handleBlur($event)">
                                <option v-for="project in projects" :key="project.projectID"
                                    v-bind:value="{ id: project.projectID, text: project.project }">
                                    {{ project.project }}</option>
                            </select>
                            <label>Project</label>
                            <span>Project</span>
                        </div>
                    </div>

                    <div class="Row" v-if="role != 'Guest'">
                        <div class="input-container focus">
                            <select id="subproject" class="input" v-model="selectedSubproject"
                                @change="handleSubprojectChange">
                                <option v-for="subproject in subprojects" :key="subproject.subprojectID"
                                    v-bind:value="{ id: subproject.subprojectID, text: subproject.subproject }">
                                    {{ subproject.subproject }}</option>
                            </select>
                            <label>Subproject</label>
                            <span>Subproject</span>
                        </div>
                    </div>

                </div>


                <!-- Display the tiles for the menus and the roles -->
                <div class="container">
                    <div class="menu">
                        <transition-group appear tag="ul" @before-enter="beforeEnter" @enter="enter">
                            <li v-for="(icon, index) in icons" :key="icon.name99" :data-index="index"
                                @click="GotoScreen(icon.name)">
                                <i :class="icon.class"></i>
                                <div>{{ icon.text }}</div>
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
import getAllProjectsByUser from '../composables/project/getAllProjectsByUser'
import getAllSubprojects from '../composables/subproject/getAllSubprojects'
import getRoleOfUser from '../composables/user/getRoleOfUser'
import Message from '../components/Message.vue'
import gsap from 'gsap'
import { displayMsg, consoleLog } from '../util/debug';


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
        const projects = ref([])
        const selectedProject = ref(null)
        const subprojects = ref([])
        const selectedSubproject = ref(null)
        const subprojectName = ref(props.subprojectName)
        const subprojectID = ref(props.subprojectID)

        // -------------------------------------------
        // load all the projects of the workspace 
        // -------------------------------------------
        const { error1, loadProjects } = getAllProjectsByUser(userID.value, projects)
        consoleLog('ControlPanel.vue/loadProjects', 2, '****** projectID: ' + projectID.value, trace.value)

        loadProjects(projects, trace.value)
            .then(function () {
                // check the status of the load
                consoleLog('ControlPanel.vue/loadProjects', 2, 'Project Load status: ' + projects.value.success + ' data length: ' + projects.value.data.length, trace.value)
                if (projects.value.success && projects.value.data.length) {
                    // get the projectID of the first project in the list (it will be the default value for the select)
                    projects.value = projects.value.data

                    if (projectID.value == 0) {
                        projectID.value = projects.value[0].projectID
                        projectName.value = projects.value[0].project
                        selectedProject.value = ({ id: projectID.value, text: projectName.value })
                        // Emit a storeContract event to the App
                        consoleLog('ControlPanel.vue/loadProjects', 2, 'ControlPanel loadProjects -- emit event storeContract: (' + selectedProject.value.id + ') ' + selectedProject.value.text, trace.value)
                        context.emit('storecontract', projectID.value, projectName.value)
                    } else {
                        selectedProject.value = ({ id: projectID.value, text: projectName.value })
                    }

                    return (1)
                } else {
                    consoleLog('ControlPanel.vue/loadProjects', 2, 'No project found!', trace.value)
                    role.value = 'Guest'
                    userrole.value = role.value
                    context.emit('updaterole', role.value, username.value)
                    router.push({ name: 'GuestPanel' })
                    return (0)
                }
            }).then(function (success) {

                if (success) {
                    consoleLog('ControlPanel.vue/loadProjects', 2, 'Project uploaded, first one is ' + projectID.value, trace.value)

                    if (superUser.value) {
                        consoleLog('ControlPanel.vue/loadProjects', 2, 'the user is a super user', trace.value)
                        role.value = 'Super'
                        userrole.value = role.value
                        context.emit('updaterole', role.value, username.value)
                        if (currentRole.value != '') {
                            // active role defined, use it
                            role.value = currentRole.value
                        }


                    } else {
                        // now we can detect the role of the user
                        // Get the role of the user (one role per project)
                        const { projectRole, error, loadRole } = getRoleOfUser(workspaceID.value, projectID.value, userID.value)
                        loadRole(trace.value)
                            .then(function () {
                                // check if the load role is successfull
                                if (projectRole.value.success == 1) {
                                    projectRole.value = projectRole.value.data[0]
                                    role.value = projectRole.value.role
                                    userrole.value = role.value
                                    //console.log('user role: ' + userrole.value + ', role: ' + role.value)
                                    consoleLog('ControlPanel.vue/loadProjects', 2, 'Role: ' + role.value + ' current: ' + currentRole.value, trace.value)
                                    context.emit('updaterole', projectRole.value.role, username.value)
                                    if (currentRole.value != '') {
                                        consoleLog('ControlPanel.vue/loadProjects no current role', 2, 'Role: ' + role.value + ' current: ' + currentRole.value, trace.value)
                                        // active role defined, use it
                                        role.value = currentRole.value
                                    }
                                } else {
                                    // if no role detected, the user is a Guest
                                    consoleLog('ControlPanel.vue/loadProjects', 2, projectRole.value.message, trace.value)
                                    role.value = 'Guest'
                                    userrole.value = role.value
                                    context.emit('updaterole', role.value, username.value)
                                    DisplayError('I cannot detect a role for this project!\nCheck with your Administrator', 'Alert')
                                }
                            })
                    }


                    // after loading the projects, we can load the subprojects of the first project
                    const { error2, loadSubprojects } = getAllSubprojects(projectID.value)
                    consoleLog('ControlPanel.vue/loadProjects', 2, '****** subprojectID: ' + subprojectID.value, trace.value)

                    loadSubprojects(subprojects, trace.value)
                        .then(function () {
                            if (subprojects.value.success && subprojects.value.data.length) {
                                subprojects.value = subprojects.value.data
                                consoleLog('ControlPanel.vue/handleProjectChange', 2, subprojects, trace.value)
                                if (subprojectID.value == 0 || subprojectID.value == undefined) {
                                    // get the subprojectID of the first subproject in the list (it will be the default value for the select)
                                    subprojectID.value = subprojects.value[0].subprojectID
                                    subprojectName.value = subprojects.value[0].subproject
                                    selectedSubproject.value = ({ id: subprojectID.value, text: subprojectName.value })
                                    context.emit('storesubcontract', subprojects.value[0].subprojectID, subprojects.value[0].subproject)
                                } else {
                                    selectedSubproject.value = ({ id: subprojectID.value, text: subprojectName.value })
                                }
                                return (1)
                            } else {
                                consoleLog('ControlPanel.vue/handleProjectChange', 2, 'No subproject found!', trace.value)
                                DisplayError('I cannot detect a subproject for this project!\nCheck with your Administrator', 'Alert')
                                return (0)
                            }
                        })
                }

            })

        // --------------------------------------------------------------------------
        // User selects another project, we need to refresh the list of subprojects    
        // --------------------------------------------------------------------------
        const handleProjectChange = () => {
            // get the current projectID of the selected project
            consoleLog('ControlPanel.vue/handleProjectChange', 2, 'Project change Project Id: ' + selectedProject.value.id, trace.value)
            // Emit a storeContract event to the App
            consoleLog('ControlPanel.vue/handleProjectChange', 2, 'emit event storeContract: (' + selectedProject.value.id + ') ' + selectedProject.value.text, trace.value)
            context.emit('storecontract', selectedProject.value.id, selectedProject.value.text)
            projectID.value = selectedProject.value.id
            // refresh the list of subprojects
            const { error2, loadSubprojects } = getAllSubprojects(projectID.value)
            loadSubprojects(subprojects, trace.value)

                .then(function () {
                    if (subprojects.value.success && subprojects.value.data.length) {
                        subprojects.value = subprojects.value.data
                        consoleLog('ControlPanel.vue/handleProjectChange', 2, subprojects, trace.value)
                        // get the subprojectID of the first subproject in the list (it will be the default value for the select)
                        subprojectID.value = subprojects.value[0].subprojectID
                        selectedSubproject.value = ({ id: subprojectID, text: subprojects.value[0].subproject })
                        context.emit('storesubcontract', subprojects.value[0].subprojectID, subprojects.value[0].subproject)
                        //console.log(subprojects, trace.value)
                        return (1)
                    } else {
                        consoleLog('ControlPanel.vue/handleProjectChange', 2, 'No subproject found!', trace.value)
                        DisplayError('I cannot detect a subproject for this project!\nCheck with your Administrator', 'Alert')
                        return (0)
                    }
                })

            // now we can detect the role of the user
            // Get the role of the user (one role per project)
            if (superUser.value) {
                consoleLog('ControlPanel.vue/handleProjectChange', 3, 'the user is a super user', trace.value)
                role.value = 'Super'
                userrole.value = role.value
                context.emit('updaterole', role.value, username.value)

            } else {
                const { projectRole, error, loadRole } = getRoleOfUser(workspaceID.value, projectID.value, userID.value)
                loadRole(trace.value)
                    .then(function () {
                        // check if the load role is successfull
                        if (projectRole.value.success == 1) {
                            projectRole.value = projectRole.value.data[0]
                            role.value = projectRole.value.role
                            userrole.value = role.value
                            //console.log('user role: ' + userrole.value + ', role: ' + role.value, trace.value)
                            context.emit('updaterole', role.value, username.value)
                        } else {
                            // if no role detected, the user is a Guest
                            consoleLog('ControlPanel.vue/handleProjectChange', 3, projectRole.value.message, trace.value)
                            role.value = 'Guest'
                            userrole.value = role.value
                            context.emit('updaterole', role.value, username.value)
                            DisplayError('I cannot detect a role for this project!\nCheck with your Administrator', 'Alert')
                        }
                    })
            }
        }


        // ----------------------------------------------------------------------------
        // User selects another suproject, we need to store the subprojectID for later    
        // ----------------------------------------------------------------------------
        const handleSubprojectChange = () => {
            consoleLog('ControlPanel.vue/handleSubprojectChange', 2, 'Subproject Id: ' + selectedSubproject.value.id, trace.value)
            subprojectID.value = selectedSubproject.value.id
            context.emit('storesubcontract', selectedSubproject.value.id, selectedSubproject.value.text)
        }

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
            { class: 'fa-solid fa-chart-line', text: 'Dashboard', name: 'Dashboard', role: 'Tester' },
            { class: 'fa-solid fa-database', text: 'Dataset', name: 'Dataset', role: 'Tester' },
            { class: 'fa-regular fa-face-grin-tongue-squint', text: 'Dummy Users', name: 'Dummy Users', role: 'Tester' },
            { class: 'fa-solid fa-bars', text: 'Scenarios', name: 'Scenarios', role: 'Designer' },
            { class: 'fa-solid fa-map', text: 'Suite Set', name: 'Suite Set', role: 'Designer' },
            { class: 'fa-solid fa-list-check', text: 'Story Set', name: 'Story Set', role: 'Designer' },
            { class: 'fa-solid fa-bookmark', text: 'References', name: 'References', role: 'Designer' },
            { class: 'fa-solid fa-spell-check', text: 'Dictionary Set', name: 'Dictionary Set', role: 'Designer' },
            { class: 'fa-solid fa-gears', text: 'Rules Set', name: 'Rules Set', role: 'Designer' },
            { class: 'fa-solid fa-people-group', text: 'Workspaces', name: 'Workspaces', role: 'Admin' },
            { class: 'fa-solid fa-user-group', text: 'Users', name: 'Users', role: 'Admin' },
            { class: 'fa-solid fa-shield-halved', text: 'Projects', name: 'Projects', role: 'Admin' },
            { class: 'fa-solid fa-file-arrow-up', text: 'Upload', name: 'Upload', role: 'Admin' },
            { class: 'fa-solid fa-ghost', text: 'AI Robot', name: 'AIRobot', role: 'Admin' },
            { class: 'fa-solid fa-truck-fast', text: 'Performance', name: 'Performance', role: 'Admin' },
            // { class: 'fa-solid fa-paste', text: 'Templates', name: 'Templates', role: 'Super' },
            { class: 'fa-solid fa-hand-sparkles', text: 'Licenses', name: 'Licenses', role: 'Super' },
            { class: 'fa-solid fa-percent', text: 'Functions', name: 'Functions', role: 'Super' },
            { class: 'fa-solid fa-hammer', text: 'Parameters', name: 'Parameters', role: 'Super' },
            { class: 'fa-solid fa-head-side-virus', text: 'Natural Set', name: 'Natural Set', role: 'Super' },
            { class: 'fa-solid fa-microscope', text: 'Natural Labs', name: 'Natural Proto', role: 'Super' },
            // { class: 'fa-solid fa-book', text: 'Libraries', name: 'Libraries', role: 'Super' },
            //{ class: 'fa-regular fa-face-grin-tongue-squint', text: 'Todo', name: 'Todo', role: 'Super' },
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
        // User clicks on a menu, open the corresponding component 
        // ----------------------------------------------------------------------------
        const GotoScreen = (pageName) => {
            consoleLog('ControlPanel.vue/GotoScreen', 2, 'pageName: ' + pageName, trace.value)
            context.emit('storelocation', 'controlpanel')
            router.push({ name: pageName })
        }

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


        return {
            userrole, username, role, icons, roles, projects, selectedProject, subprojects, selectedSubproject,
            errorMessage, styleMessage, workspaceName,
            handleProjectChange, handleSubprojectChange, GotoScreen, beforeEnter, enter, handleFocus, handleBlur, handleRole
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
    background-color: #90cabe;;
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
    background: rgb(233, 240, 213);
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