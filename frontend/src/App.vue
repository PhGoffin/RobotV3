<template>
  <div class="main-container">

    <Header :userID="userID" :userrole="userrole" :currentuser="currentuser" :projects="myProjects" :connected="connected" :trace="trace"
      :workspaceID="workspaceID" :projectName="projectName" :subprojectName="subprojectName" @disconnect="disconnect" @changepassword="changePassword" @switchtrace="switchTrace" 
      :key="projectName + subprojectName"/>
    
      <router-view v-slot="{ Component }">
      <!-- <transition name="route" mode="out-in"> -->
      <component :is="Component" :userrole="userrole" :currentuser="currentuser" :userID="userID" :superUser="superUser" :location="location" :currentRole="currentRole"
        :role="userrole" :connected="connected" :workspace="workspace" :workspaceID="workspaceID" @updaterole="updateRole"
        :projectID="projectID" :projectName="projectName"  :subprojectID="subprojectID" :subprojectName="subprojectName" :trace="trace"
        @loginrefresh="loginRefresh" @storecontract="storeContract" @storesubcontract="storeSubcontract" @storelocation="storeLocation"
        @currentrole="storeCurrentRole">
      </component>
      <!-- </transition> -->
    </router-view>
    
    <Footer />

  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { displayMsg, consoleLog}  from './util/debug';


export default {

  components: { Header, Footer },

  setup() {

    const router = useRouter()

    const userID = ref(0)
    const userrole = ref('Guest')
    const currentuser = ref('')
    const currentRole = ref('')
    const superUser = ref(false)
    const connected = ref(false)
    const workspaceID = ref(0)
    const workspace = ref('')
    const projectID = ref(0)
    const projectName = ref('')
    const subprojectID = ref(0)
    const subprojectName = ref('')
    const myProjects = ref([])
    const trace = ref(false)
    const location = ref('app')



    displayMsg('App.vue', trace.value)    

    // Refresh role emitted from the controlPanel.vue
    const updateRole = (newrole, newuser) => {
      consoleLog('App.vue/updateRole', 2, 'updateRole', trace.value)
      userrole.value = newrole
      currentuser.value = newuser
    }

    // Refresh the current role emitted from the controlPanel.vue
    const storeCurrentRole = (newrole) => {
      consoleLog('App.vue/currentRole', 2, 'currentRole: ' + newrole, trace.value)
      currentRole.value = newrole
    }


    // Login emitted from the view Login.vue  
    const loginRefresh = async (newworkspaceID, newworkspace, newrole, newuser, newuserID, newSuper) => {
      consoleLog('App.vue/loginRefresh', 2, 'loginRefresh', trace.value)
      workspaceID.value = newworkspaceID
      workspace.value = newworkspace
      userrole.value = newrole
      currentuser.value = newuser
      userID.value = newuserID
      superUser.value = newSuper
      connected.value = true
      consoleLog('App.vue/loginRefresh', 3, newworkspaceID + ', ' + newworkspace + ', ' + newrole + ', ' + newuser + '(' + userID.value + '), connected:' + connected.value + ', superUser:' + superUser.value, trace.value)
      router.push({ name: 'ControlPanel' })
    }

    // disconnect event emmitted from the header.vue  
    const disconnect = () => {
      consoleLog('App.vue/disconnect',2,'disconnect...', trace.value)
      connected.value = false
      workspaceID.value = 0
      userrole.value = 'Guest'
      currentuser.value = ''
      projectID.value = 0
      projectName.value = ''
      subprojectID.value = 0
      subprojectName.value = ''
      router.push({ name: 'Login' })
    }

    // change the password from the header.vue  
    const changePassword = () => {
      consoleLog('App.vue/changePassword',2,'change Password', trace.value)
      router.push({ name: 'Password' })
    }

    // store contract event emitted by a screen
    const storeContract = (newprojectID, newproject) => {
      consoleLog ('App.vue/storeContract', 2, 'store the content of the project: (' + newprojectID + ') '  + newproject, trace.value)
      projectID.value = newprojectID
      projectName.value = newproject
    }

    // store subcontract event emitted by a screen
    const storeSubcontract = (newsubprojectID, newsubproject) => {
      consoleLog('App.vue/storeSubcontract',2,'store the content of the subproject: (' + newsubprojectID + ') '  + newsubproject, trace.value)
      subprojectID.value = newsubprojectID
      subprojectName.value = newsubproject
    }

    const switchTrace = () => {
      consoleLog('App.vue/switchTrace',2,'switch trace to: ' + !trace.value, trace.value)
      trace.value  = !trace.value
    }

    const storeLocation = (newLocation) => {
      consoleLog('App.vue/storeLocation',2,'set location to: ' + newLocation, trace.value)
      location.value  = newLocation
    }



    return { workspaceID, workspace, userrole, currentuser, userID, superUser, myProjects, projectID, 
      projectName, subprojectID, subprojectName, connected, trace, location, currentRole,
      updateRole, loginRefresh, disconnect, changePassword, storeContract, storeSubcontract, switchTrace, storeLocation, storeCurrentRole };

  }

}
</script>

<style>
body {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  font-family: Quicksand, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  background: #f2f2f2;
}

.main-container {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background-color: #fafafa;
    overflow: auto;
}


/* route transitions - obsolete */

.route-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.route-leave-active {
  transition: all 0.3s ease-in;
}
</style>