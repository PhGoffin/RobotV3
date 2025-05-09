<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div :class="scenario.active ? 'entity' : 'entity inactive'">
    <div class="actions">

      <h3 @click="showDetails = !showDetails" title="Click to show the comment" class="data">{{ scenario.scenario }}
      </h3>


      <div class="actions">

        <div class="icons" v-if="importSuiteData">
          <router-link :to="{ name: 'SuiteEdit', params: { id: suiteStoryID, location: 'scenario' } }"
            @click="handleImport">
            <i class="fa-solid fa-file-import" :class="classColor" @click="handleImport"
              title="Use this scenario in the Suite"></i>
          </router-link>
        </div>

        <div class="icons" v-if="importStoryData">
          <router-link :to="{ name: 'StoryEdit', params: { id: suiteStoryID, location: 'scenario' } }"
            @click="handleImport">
            <i class="fa-solid fa-file-import" :class="classColor" @click="handleImport"
              title="Use this scenario in the Story"></i>
          </router-link>
        </div>

        <div class="icons" v-if="importAIDashboard">
          <i class="fa-solid fa-file-import" :class="classColor" @click="handleimportAIDashboard"
            title="Import this scenario into the AI Dashboard"></i>
        </div>

        <div class="icons" v-if="!importData && !importTest">
          <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the scenario"></i>
        </div>

        <div class="icons" v-if="actionAllowed && !importTest">
          <router-link
            :to="{ name: 'ScenarioEdit', params: { id: scenario.scenarioID, subprojectID: scenario.subprojectID, workspaceID: workspaceID, workspace: workspace } }">
            <i class="fa-regular fa-pen-to-square" title="Edit the scenario"></i>
          </router-link>
        </div>

        <div class="icons" v-if="!importData && !importTest">
          <i>&nbsp;</i>
        </div>


        <div class="icons" v-if="!importData && !importTest">
          <i class="fa-solid fa-copy" @click="handleCopy" title="Copy after this row"></i>
        </div>

        <div class="icons" v-if="!importData && !importTest">
          <i class="fa-solid fa-down-left-and-up-right-to-center" @click="handleMove" title="Move after this row"></i>
        </div>

        <div class="icons" v-if="!importData && !importTest">
          <input type="checkbox" name="selection" class="input checkbox" @change="handleSelect"
            title="Check to indicate the row(s) to Copy or Move" />
        </div>

        <div class="icons" v-if="!importData && !importTest">
          <i>&nbsp;</i>
        </div>

        <div class="icons" v-if="!importData">
          <router-link
            :to="{ name: 'Tests', params: { id: scenario.scenarioID, subprojectID: scenario.subprojectID, workspaceID: workspaceID, workspace: workspace } }"
            @click="handleGotoTest">
            <i class="fa-solid fa-vial" title="Manage the tests"></i>
          </router-link>
        </div>

        <div class="icons" v-if="!importData">
          <i>&nbsp;</i>
        </div>

        <div class="icons" v-if="!importData && !executing && !importTest">
          <i class="fa-regular fa-circle-play" @click="handleExecute" title="Execute the scenario"></i>
        </div>

        <div class="icons" v-if="executing">
          <Spinner />
        </div>

        <!-- <div class="icons" v-if="actionAllowed">
          <i class="fa-regular fa-eye" @click="handleLogfile" title="View the logfile"></i>
        </div> -->

      </div>

    </div>
    <div class="details" v-if="showDetails">
      <p>ID: {{ scenario.scenarioID }}</p>
      <p>{{ scenario.comment }}</p>
      <p>Updated by: {{ scenario.updatedby }} on: {{ scenario.updated }}</p>
    </div>


  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import deleteScenario from '../../composables/scenario/deleteScenario'
import deleteAllTests from '../../composables/test/deleteAllTests'
import executeScenario from '../../composables/playwright/executeScenario'
import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'



export default {
  props: ['trace', 'scenario', 'workspaceID', 'workspace', 'superUser', 'userID', 'currentuser', 'projectID', 'subprojectID', 'location'],
  components: { Spinner, PopupConfirm },

  setup(props, context) {
    const router = useRouter()

    const trace = ref(props.trace)

    displayMsg('ScenarioSingle.vue', trace.value)
    consoleLog('ScenarioSingle.vue - props', 1, props, trace.value)


    const showDetails = ref(false)
    const showPopup = ref(false)
    const scenario = ref(props.scenario)
    const userID = ref(props.userID)
    const userName = ref(props.currentuser)
    const scenarioID = ref(scenario.value.scenarioID)
    const scenarioName = ref(scenario.value.scenario)
    const projectID = ref(props.projectID)
    const subprojectID = ref(scenario.value.subprojectID)
    const subprojectName = ref(scenario.value.subproject)
    const superUser = ref(props.superUser)
    const comment = ref(scenario.value.comment)

    const actionAllowed = ref(1)
    const selenium = ref([])
    const executing = ref(0)
    const recordSelected = ref(false)

    const location = ref(props.location)
    const suiteStoryID = ref(0)
    const importSuiteData = ref(false)
    const importStoryData = ref(false)
    const importData = ref(false)
    const importTest = ref(false)
    const importAIDashboard = ref(false)


    const classColor = ref('blue')



    // --------------------------------------------------------------------
    // Check if we come from the suite/story screen or for the control panel
    // format: suite=<suiteID>
    // format: story=<storyID> 
    // --------------------------------------------------------------------
    if (location.value != undefined) {
      if (location.value.includes('suite=') || location.value.includes('story=')) {
        // split the location to find the keywords
        let data = location.value.split("=");
        //console.log(data)
        if (data[0] != undefined) {
          if (data[0].trim() == 'suite') importSuiteData.value = true
          else importStoryData.value = true
          suiteStoryID.value = data[1]
          importData.value = true
        }
      } else if (location.value.includes('testimport=')) {
        importTest.value = true
      } else if (location.value.includes('aidashboard')) {
        importAIDashboard.value = true
      }
    }

    // ------------------------------------------------------------
    // User asks to use this scenario in the suite or in the story
    // ------------------------------------------------------------
    const handleImport = () => {
      consoleLog('ScenarioSingle.vue/handleImport', 2, 'Emit event to select this data in the suite/story: ' + suiteStoryID.value, trace.value)
      // Syntax is: scenario=<suiteStoryID>=<scenarioID>=<comment>
      context.emit('storelocation', 'scenario=' + suiteStoryID.value + '=' + scenarioID.value + '=' + comment.value)
    }

    // ------------------------------------------------------------
    // User asks to go to the tests screen
    // ------------------------------------------------------------
    const handleGotoTest = () => {

      if (location.value.includes('controlpanel=')) {
        consoleLog('ScenarioSingle.vue/handleGotoTest', 2, 'Emit event to reset location to controlpanel', trace.value)
        context.emit('storelocation', 'controlpanel')
      }
    }




    // ------------------------------------------------------------
    // User asks to use this scenario in the IA Sashboard
    // ------------------------------------------------------------
    const handleimportAIDashboard = () => {
      consoleLog('ScenarioSingle.vue/handleimportAIDashboard', 2, 'Emit event to select this data in the AI Dashbaord: ' + suiteStoryID.value, trace.value)
      // Syntax is: scenario=<suiteStoryID>=<scenarioID>=<comment>
      context.emit('storelocation', 'scenario=' + suiteStoryID.value + '=' + scenarioID.value + '=' + comment.value)
      router.push({ name: 'AIDashboard' })
    }



    // --------------------------------------------------------------------------
    // User wants to execute a scenario
    // --------------------------------------------------------------------------
    const handleExecute = () => {
      consoleLog('ScenarioSingle.vue/handleExecute', 2, 'User want to execute a test: ' + scenarioName.value, trace.value)
      // Display an info message in the Scenarios.vue
      context.emit('refreshscenarios', 1, "let's start a test!", 0)
      executing.value = 1 // Show the spinner
      const { error, execTest } = executeScenario(scenarioName.value, scenarioID.value, projectID.value, subprojectID.value, userID.value, userName.value)
      execTest(selenium, trace.value)
        .then(function () {
          consoleLog('ScenarioSingle.vue/handleExecute', 2, '------ scenarioID: ' + scenarioID.value + ', subprojectID: ' + subprojectID.value + ', userID: ' + userID.value, trace.value)
          consoleLog('ScenarioSingle.vue/handleExecute', 2, selenium, trace.value)
          executing.value = 0 // Hide the spinner
          if (selenium.value.success) {
            context.emit('refreshscenarios', 1, selenium.value.message, 1)
          } else {
            context.emit('refreshscenarios', 0, selenium.value.message, 1)
          }
        })
    }


    // --------------------------------------------------------------------------
    // User ask to go to the logfile
    // --------------------------------------------------------------------------
    const handleLogfile = () => {
      consoleLog('Dashboard.vue/handleLogfile', 2, 'User want to view the Logfile', trace.value)
      context.emit('storelocation', 'scenario')
      router.push({ name: 'Logfiles' })
    }



    // -------------------------------------------
    // User agree to delete a scenario
    // -------------------------------------------
    const handelDelete = async () => {
      consoleLog('ScenarioSingle.vue/handelDelete', 2, 'User asks to delete a scenario', trace.value)
      const { error, deleteTheScenario } = deleteScenario(subprojectID.value, scenarioID.value)
      await deleteTheScenario(scenario, trace.value)
        .then(function () {
          consoleLog('ScenarioSingle.vue/handelDelete', 3, '------ Delete scenario: ' + subprojectID.value + ', ' + scenarioID.value, trace.value)
          consoleLog('ScenarioSingle.vue/handelDelete', 3, scenario.value, trace.value)
          consoleLog('ScenarioSingle.vue/handelDelete', 3, 'Success: ' + scenario.value.message, trace.value)

          if (scenario.value.success) {
            consoleLog('ScenarioSingle.vue/handelDelete', 2, 'Message: ' + scenario.value.message, trace.value)
            return 1
          } else {
            // Error during delete found!
            consoleLog('ScenarioSingle.vue/handelDelete', 2, scenario.value.message, trace.value)
            return 0
          }
        })


      let test = []
      consoleLog('ScenarioSingle.vue/doDelete', 2, 'Delete all linked test - datasetheaderID: ' + scenarioID.value, trace.value)
      const { error2, deleteTheTest } = deleteAllTests(scenarioID.value)
      await deleteTheTest(test, trace.value)
        .then(function () {
          // check the status of the delete
          consoleLog('ScenarioSingle.vue/doDelete', 2, 'Full Test delete status: ' + test.value.success, trace.value)
          if (test.value.success) {
            consoleLog('ScenarioSingle.vue/doDelete', 2, test, trace.value)
            return (1)
          } else {
            consoleLog('ScenarioSingle.vue/doDelete', 2, 'No Test to delete', trace.value)
            return (1)
          }
        })

      // ask the scenario view to refresh the list
      consoleLog('ScenarioSingle.vue/handelDelete', 2, 'Emit a request to the parent to refresh the list', trace.value)
      context.emit('refreshscenarios', 1, scenario.value.message, 1)



    }


    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleConfirmation = () => {
      consoleLog('Projects.vue/handleConfirmation', 2, 'Ask for a confirmation to delete', trace.value)
      showPopup.value = true
    }

    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleCancelDelete = () => {
      consoleLog('Projects.vue/handleCancelDelete', 2, 'Cancel the delete', trace.value)
      showPopup.value = false
    }


    // --------------------------------------------------------------------------
    // User confirm the delete action
    // --------------------------------------------------------------------------
    const handleConfirmDelete = () => {
      consoleLog('Projects.vue/handleConfirmDelete', 2, 'Confirm the delete', trace.value)
      showPopup.value = false
      handelDelete()
    }


    // --------------------------------------------------------------------------
    // User cancel the delete action
    // --------------------------------------------------------------------------
    const handleSelect = () => {
      consoleLog('ReferenceSingle.vue/handleSelect', 2, 'Select a record', trace.value)
      recordSelected.value = !recordSelected.value
      context.emit('selectrecord', scenarioID.value)
    }

    // --------------------------------------------------------------------------
    // User want to copy record(s)
    // --------------------------------------------------------------------------
    const handleCopy = () => {
      consoleLog('ReferenceSingle.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', scenario.value.position)
    }

    // --------------------------------------------------------------------------
    // User want to move record(s)
    // --------------------------------------------------------------------------
    const handleMove = () => {
      consoleLog('ReferenceSingle.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', scenario.value.position)
    }



    return {
      showDetails, superUser, actionAllowed, subprojectID, subprojectName, showPopup, executing,
      importSuiteData, importStoryData, importData, importAIDashboard, classColor, suiteStoryID, importTest,
      handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete, handleExecute,
      handleLogfile, handleCopy, handleMove, handleSelect, handleImport, handleimportAIDashboard, handleGotoTest
    }
  }
}
</script>

<style scoped>
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

.entity.inactive {
  position: relative;
  margin: 20px auto;
  background: rgb(236, 223, 223);
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid red;
  width: 80%;
}

.input.checkbox {
  height: 1.5rem;
  width: 1.5rem;
}

h3 {
  cursor: pointer;
  width: auto;
}

p {
  text-align: left;
}

.data {
  text-align: left;
  padding-left: 1.5rem;
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

.actions i.blue {
  font-size: 24px;
  margin-left: 10px;
  color: #072af5;
  cursor: pointer;
}

.actions i:hover {
  color: #777;
}
</style>