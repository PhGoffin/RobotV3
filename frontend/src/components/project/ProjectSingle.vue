<template>
  <div v-if="showPopup">
    <PopupConfirm @close="handleCancelDelete" @confirm="handleConfirmDelete" />
  </div>

  <div class="entity">

    <div class="actions">
      <h3 @click="showDetails = !showDetails" title="Click to show the comment" class="data">{{ project.project }}</h3>

      <div class="actions">

        <div class="icons" v-if="actionAllowed">
          <i class="fa-regular fa-trash-can" @click="handleConfirmation" title="Delete the project"></i>
        </div>

        <div class="icons" v-if="actionAllowed">
          <router-link
            :to="{ name: 'ProjectEdit', params: { id: project.projectID, projectID: project.projectID, workspaceID: workspaceID, workspace: workspace } }">
            <i class="fa-regular fa-pen-to-square" title="Edit the project"></i>
          </router-link>
        </div>

        <div class="icons" v-if="actionAllowed">
          <router-link
            :to="{ name: 'Subprojects', params: { id: project.projectID, projectName: projectName, superUser: superUser } }">
            <i class="fa-solid fa-diagram-project" title="Manage subprojects"></i>
          </router-link>
        </div>

        <div class="icons" v-if="actionAllowed">
          <router-link
            :to="{ name: 'UsersProject', params: { id: project.projectID, projectName: project.project, workspaceID: workspaceID, workspace: workspace, superUser: superUser } }">
            <i class="fa-solid fa-user-group" title="Linked users"></i>
          </router-link>
        </div>

        <div class="icons" v-if="actionAllowed">
          <i class="fa-solid fa-hammer" @click="handleParameter" title="Parameters"></i>
        </div>


      </div>

    </div>
    <div class="details" v-if="showDetails">
      <p>Id: {{  project.projectID }}</p>
      <p>{{ project.comment }}</p>
      <p>Updated by: {{ project.updatedby }} on: {{ project.updated }}</p>
    </div>


  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import deleteProject from '../../composables/project/deleteProject'
import { displayMsg, consoleLog } from '../../util/debug';
import PopupConfirm from '../PopupConfirm.vue'



export default {
  props: ['trace', 'project', 'projectID', 'workspaceID', 'workspace', 'superUser'],
  components: { PopupConfirm },

  setup(props, context) {
    const router = useRouter()
    const trace = ref(props.trace)

    displayMsg('ProjectSingle.vue', trace.value)
    consoleLog('ProjectSingle.vue - props', 1, props, trace.value)


    const showDetails = ref(false)
    const showPopup = ref(false)
    const workspaceID = ref(props.workspaceID)
    const workspace = ref(props.workspace)
    const project = ref(props.project)
    const selectedProjectID = ref(props.projectID)
    const projectID = ref(project.value.projectID)
    const projectName = ref(project.value.project)
    const superUser = ref(props.superUser)


    // -------------------------------------------
    // Manage the actions depending of the role of the user
    // -------------------------------------------
    const actionAllowed = computed(() => {
      consoleLog('ProjectSingle.vue/actionAllowed', 2, 'Action Allowed: Super User: ' + project.value.superuser + ', SuperUser: ' + superUser.value, trace.value)
      if (project.value.role === 'Admin') {
        return (projectID.value == selectedProjectID.value)
      } else if (superUser.value == 1) {
          return 1
      }
    });


    // -------------------------------------------
    // User agree to delete a project
    // -------------------------------------------
    const handelDelete = () => {
      consoleLog('ProjectSingle.vue/handelDelete', 2, 'User asks to delete a project', trace.value)
      const { error, deleteTheProject } = deleteProject(workspaceID.value, projectID.value)
      deleteTheProject(project, trace.value)
        .then(function () {
          consoleLog('ProjectSingle.vue/handelDelete', 3, '------ Delete project: ' + workspaceID.value + ', ' + projectID.value, trace.value)
          consoleLog('ProjectSingle.vue/handelDelete', 3, project.value, trace.value)
          consoleLog('ProjectSingle.vue/handelDelete', 3, 'Success: ' + project.value.message, trace.value)

          if (project.value.success) {
            consoleLog('ProjectSingle.vue/handelDelete', 2, 'Message: ' + project.value.message, trace.value)
            return 1
          } else {
            // Error during delete found!
            consoleLog('ProjectSingle.vue/handelDelete', 2, project.value.message, trace.value)
            return 0
          }
        }).then(function (status) {
          // ask the project view to refresh the list
          consoleLog('ProjectSingle.vue/handelDelete', 2, 'Emit a request to the parent to refresh the list', trace.value)
          context.emit('refreshprojects', status, project.value.message)
        })
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
    // User want to manage the project parameter
    // --------------------------------------------------------------------------
    const handleParameter = () => {
      consoleLog('Projects.vue/handleParameter', 2, 'Ask for project parameters', trace.value)
      context.emit('storelocation', 'project')
      router.push({ name: 'Parameters', params: { location: "project" } })
    }




    return {
      showDetails, workspaceID, workspace, superUser, actionAllowed, projectID, projectName, showPopup,
      handleConfirmation, handelDelete, handleCancelDelete, handleConfirmDelete, handleParameter
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
  background: white;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid red;
  width: 80%;
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

.actions i:hover {
  color: #777;
}
</style>