<template>
    <div class="top">
        <div class="header-box">
            <div>
                <h3>{{ robotversion }}</h3>
            </div>
            <div class="header-user">
                <div>
                    <h3>{{ projectName }} - {{ subprojectName }} &nbsp;&nbsp;&nbsp;</h3>
                </div>
                <div :class="connected ? 'connected' : 'notconnected'">
                    <h3 @click="$emit('disconnect')" title="Logout" class="pointer">
                        {{ currentuser }} :
                        <i :class="icon"></i>
                        {{ userrole }}
                    </h3>
                </div>

                <div class="connected" v-if="connected">
                    <span class="connected">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                    <router-link class="connected"
                        :to="{ name: 'ChangePassword', params: { id: userID, currentuser: currentuser, workspaceID: workspaceID, workspace: workspace, location: location } }">
                        <i class="fa-solid fa-key" title="Change password"></i>
                    </router-link>
                </div>

                <div :class="trace ? 'connected' : 'notconnected'" v-if="userrole === 'Super'">
                    <h3 @click="$emit('switchtrace')">
                        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                        <i class="fa-solid fa-display" title="Switch trace On/Off"></i>
                    </h3>
                </div>


            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref } from "vue";
import { displayMsg, consoleLog } from '../util/debug';



export default {

    props: ['trace', 'userID', 'currentuser', 'userrole', 'connected', 'projectName', 'subprojectName',  'workspaceID', 'trace'],
    setup(props) {
        const trace = ref(props.trace)
        const projectName = ref(props.projectName)
        const subprojectName = ref(props.subprojectName)

        const robotversion = ref(process.env.VUE_APP_ROBOT_VERSION)
        const location = ref('Header')

        displayMsg('Header.vue', trace.value)
        consoleLog('Header.vue - props', 1, props, trace.value)

        const icon = computed(() => {
            if (props.userrole === 'Tester') {
                return "fa-solid fa-user-gear"
            }
            if (props.userrole === 'Designer') {
                return "fa-solid fa-person-shelter"
            }
            if (props.userrole === 'Admin') {
                return "fa-solid fa-person-military-pointing"
            }
            if (props.userrole === 'Super') {
                return "fa-solid fa-user-secret"
            }
            return "fa-regular fa-circle-user"

        });


        return { robotversion, icon, location, projectName, subprojectName };
    },
};
</script>

<style scoped>
.header-box {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    max-width: 3600px;
    padding: 10px;
    background: #b1afaf;
    color: #555;
}

.header-user {
    display: flex;
    justify-content: center;
    align-items: center;
}



h3:hover {
    color: rgb(96, 99, 96);
}

.connected {
    cursor: pointer;
    color: green;
}

.notconnected {
    cursor: pointer;
    color: #f10808;
}
</style>