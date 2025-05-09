<template>
    <div class="frame">
        <!-- <h1>{{ role }} / {{ userrole }}</h1> -->

        <!-- Display error message, if any -->
        <Message v-if="errorMessage" :textmessage="errorMessage" :style="styleMessage" />

        <!-- Display the workspace and the selection of the projects and subprojects -->
        <div class="selectData" v-if="connected">

            <div class="Row">
                <div class="input-container focus">
                    <input type="text" name="workspace" class="input disabled" v-model="workspaceName" disabled />
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
                    <select id="subproject" class="input" v-model="selectedSubproject" @change="handleSubprojectChange">
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
                    <li v-for="(icon, index) in icons" :key="icon.name" :data-index="index"
                        @click="GotoScreen(icon.text)">
                        <span :class="icon.class"></span>
                        <div>{{ icon.text }}</div>
                    </li>
                </transition-group>
            </div>

            <div class="role">
                <transition-group appear tag="ul" @before-enter="beforeEnter" @enter="enter">
                    <li v-for="(icon, index) in roles" :key="icon.class" :data-index="index"
                        @click="handleRole(icon.text)" :class="role == icon.text ? 'selected' : 'normal'">
                        <span :class="icon.class"></span>
                        <div>{{ icon.text }}</div>
                    </li>
                </transition-group>
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
            { class: 'fa-solid fa-chart-line', text: 'Dashboard', role: 'Tester' },
            { class: 'fa-solid fa-database', text: 'Dataset', role: 'Tester' },
            { class: 'fa-regular fa-face-grin-tongue-squint', text: 'Dummy Users', role: 'Tester' },
            { class: 'fa-solid fa-bars', text: 'Scenarios', role: 'Designer' },
            { class: 'fa-solid fa-map', text: 'Suite Set', role: 'Designer' },
            { class: 'fa-solid fa-list-check', text: 'Story Set', role: 'Designer' },
            { class: 'fa-solid fa-bookmark', text: 'References', role: 'Designer' },
            { class: 'fa-solid fa-spell-check', text: 'Dictionary Set', role: 'Designer' },
            { class: 'fa-solid fa-gears', text: 'Rules Set', role: 'Designer' },
            { class: 'fa-solid fa-people-group', text: 'Workspaces', role: 'Admin' },
            { class: 'fa-solid fa-user-group', text: 'Users', role: 'Admin' },
            { class: 'fa-solid fa-shield-halved', text: 'Projects', role: 'Admin' },
            { class: 'fa-solid fa-file-arrow-up', text: 'Upload', role: 'Admin' },
            { class: 'fa-solid fa-ghost', text: 'AIRobot', role: 'Admin' },
            // { class: 'fa-solid fa-paste', text: 'Templates', role: 'Super' },
            { class: 'fa-solid fa-hand-sparkles', text: 'Licenses', role: 'Super' },
            { class: 'fa-solid fa-percent', text: 'Functions', role: 'Super' },
            { class: 'fa-solid fa-hammer', text: 'Parameters', role: 'Super' },
            // { class: 'fa-solid fa-book', text: 'Libraries', role: 'Super' },
            //{ class: 'fa-regular fa-face-grin-tongue-squint', text: 'Todo', role: 'Super' },
        ])

        const iconsUserRole = ref([
            { class: 'fa-solid fa-user-gear', text: 'Tester', role: 'Designer*Admin*Super' },
            { class: 'fa-solid fa-person-shelter', text: 'Designer', role: 'Designer*Admin*Super' },
            { class: 'fa-solid fa-person-military-pointing', text: 'Admin', role: 'Admin*Super' },
            { class: 'fa-solid fa-user-secret', text: 'Super', role: 'Super' },
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

<style>
.frame {
    width: 100%;
    height: 85vh;
    background: #cfcdcd;
    margin: 0 auto;
    padding: 0.5px;
}

.frame h1 {
    padding: 0.75px;
}

.container {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
    padding: 10px;
    background: linear-gradient(to right, #3ab19b, #4cbf91);
    border-radius: 3rem;
    height: 80%;
}


.selectData {
    position: relative;
    top: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 15px;
    background: linear-gradient(to right, #3ab19b, #4cbf91);
    height: 20px;
    border-bottom: 0.1rem solid #b3b6b5;

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

/* .selectData span {
    background: #d3d0d0;
    color: #555;
    margin: 0 auto;
    padding: 0;
    width: 150px;
} */

.rolesButton {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
    padding: 10px;
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
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    line-height: 1.5em;
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


.role li span {
    font-size: 40px;
    color: #C2604D;
}

.role li:hover {
    background: rgb(161, 212, 228);
}


/* Standard style */

.input-container {
    position: relative;
    margin: 1rem 1rem 2rem 1rem;
}

.input {
    width: 100%;
    outline: none;
    border: 2px solid #3d3c3c;
    background-color: rgb(236, 227, 227);
    padding: 0.6rem 1.2rem;
    color: #3d3c3c;
    font-weight: 500;
    font-size: 0.95rem;
    letter-spacing: 0.5px;
    border-radius: 25px;
    transition: 0.3s;
}

.input.disabled {
    background-color: #a6acaa;
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
    background-color: #1abc9c;
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
    background-color: #1abc9c;
    height: 100%;

}
</style>