<template>
    <div class="my-container" @keyup.esc="handleCancel" tabindex="0">

        <div class="form">
            <div class="banner">
                <h3 class="title">{{ projectName }}<br>{{ ruleName }}<br>-- Rules --</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <button @click="handleInsert('0')">
                    <i class="fa-solid fa-circle-plus"></i>
                    Rule</button>

                <button @click="handleExport" class="action" title="Export current rules into a .json file">
                    <i class="fa-solid fa-file-code"></i>
                    JSON Export</button>
                <a :href="URL + jsonFile" :key="jsonFile" v-if="viewLink">{{ jsonFile }}</a>


                <form @submit.prevent="">

                    <table>
                        <tr>
                            <td class="menu">
                                <div class="input-container focus" style="max-width: 10rem">
                                    <input type="text" name="RowNb" class="input" @focus="handleFocus($event)"
                                        @blur="handleBlur($event)" @change="handleRowToInsert" v-model="rowToInsert"
                                        required />
                                    <label>Row(s) to insert</label>
                                    <span>Row(s) to insert</span>
                                </div>
                            </td>
                            <td class="menu">
                                <div class="actions3">
                                    <div class="input-container focus" style="min-width: 30rem; max-width: 30rem">
                                        <input type="text" name="dataFilter" class="input" @focus="handleFocus($event)"
                                            title="You can filter by the code, label or by comment"
                                            @blur="handleBlur($event)" v-model="filterValue" />
                                        <label>Filter {{ filteredRows }}</label>
                                        <span>Filter {{ filteredRows }}</span>
                                    </div>
                                    <i class="fa-regular fa-trash-can" @click="filterValue = ''"
                                        title="Reset the filter"></i>
                                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    <input type="radio" id="type1" value="0" v-model="commentSwitch"
                                         /><label for="type1">All&nbsp;&nbsp;</label>
                                    <input type="radio" id="type2" value="1" v-model="commentSwitch"
                                         /><label for="type2">Business&nbsp;&nbsp;</label>                                        
                                </div>
                            </td>
                        </tr>

                    </table>

                </form>


                <div class="entities" height="150px">
                    <div v-if="error"> {{ error }}</div>
                    <div v-if="filteredData.length" class="layout">
                        <RulesList class="rulesList" :rules="filteredData" :workspaceID="workspaceID"
                            :workspace="workspace" :superUser="superUser" :projectID="projectID" :location="location"
                            :subprojectID="subprojectID" :userID="userID" :trace="trace" @refreshrules="refreshRules"
                            @selectrecord="selectRecord" @handleinsert="handleInsert" @handlecopy="handleCopy"
                            @handlemove="handleMove" @handledelete="handleDelete" />
                    </div>
                </div>
                <div class="input-group">
                    <button @click="handleCancel" class="cancel">
                        <i class="fa-solid fa-ban"></i>
                        OK</button>
                </div>

            </div>
        </div>


    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import RulesList from '../../components/rule/RulesList.vue'
import getRulesByHeader from '../../composables/rule/getRulesbyHeader'
import updatePositionRules from '../../composables/rule/updatePositionRules'
import reorderRules from '../../composables/rule/reorderRules'
import addRule from '../../composables/rule/addRule'
import copyRule from '../../composables/rule/copyRule'
import deleteRule from '../../composables/rule/deleteRule'
import exportRule from '../../composables/rule/exportRule'

import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Rule',
    props: ['id', 'trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected',
        'workspaceID', 'workspace', 'projectID', 'projectName', 'subprojectID', 'subprojectName', 'location'],
    components: { RulesList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)
        const recordSelected = ref([])
        const recordTarget = ref(0)
        const rowToInsert = ref(1)


        displayMsg('Rule.vue', trace.value)
        consoleLog('Rule.vue - props', 1, props, trace.value)

        // -------------------------------------------
        // Check if the user is still connected
        // -------------------------------------------
        if (!props.connected) {
            router.push({ name: 'Login' })
            return
        }


        const workspaceID = ref(props.workspaceID)
        const workspace = ref(props.workspace)
        const projectID = ref(props.projectID)
        const projectName = ref(props.projectName)
        const subprojectID = ref(props.subprojectID)
        const subprojectName = ref(props.subprojectName)
        const userID = ref(props.userID)
        const userName = ref(props.currentuser)
        const superUser = ref(props.superUser)
        const ruleheaderID = ref(props.id)
        const rules = ref([])
        const displayInfo = ref('')
        const ruleName = ref('')
        const location = ref(props.location)
        const filterValue = ref('')
        const URL = ref(process.env.VUE_APP_MYSQL_API + 'rule/download/')
        const jsonFile = ref(userName.value + '_rule.json')
        const viewLink = ref(false)
        const commentSwitch = ref(0)        

        
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
            consoleLog('Rule.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        const loadRuleData = async () => {

            // -------------------------------------------
            // load all the rules of the rule header 
            // -------------------------------------------
            consoleLog('Rule.vue/loadRuleData', 2, 'Loading rule by rule header', trace.value)
            const { error, loadRule } = getRulesByHeader(ruleheaderID.value)
            loadRule(rules, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Rule.vue/loadRuleData', 2, 'Rules status: ' + rules.value.success, trace.value)
                    if (rules.value.success && rules.value.data.length) {
                        rules.value = rules.value.data
                        filteredData.value = rules.value
                        ruleName.value = rules.value[0].rule
                        consoleLog('Rule.vue/loadRuleData', 2, rules.value, trace.value)
                        return (1)
                    } else {
                        consoleLog('Rule.vue/loadRuleData', 2, 'No rule found!', trace.value)
                        return (0)
                    }
                })
        }
        // Load projects data
        loadRuleData()


        // ---------------------------------------------
        // Compute the rules depending of the filter
        // ---------------------------------------------
        const filteredData = computed(() => {
            consoleLog('Rule.vue/filteredData', 2, 'computed value', trace.value)
            
            if (rules.value.length) {
                //console.log ('commentSwitch: ', commentSwitch.value)
                if (commentSwitch.value == 0) {
                    return rules.value.filter((ar) => ar.rule.toUpperCase().includes(filterValue.value.toUpperCase())
                    || ar.comment.toUpperCase().includes(filterValue.value.toUpperCase()))

                } else {
                    return rules.value.filter((ar) => (ar.rule.toUpperCase().includes(filterValue.value.toUpperCase())
                    || ar.comment.toUpperCase().includes(filterValue.value.toUpperCase())) & ar.commentType == commentSwitch.value)
                }
            } else {
                filteredRows.value = ''
                return rules.value
            }
        });


        // ---------------------------------------------
        // Compute the filter rows(s) indicator
        // ---------------------------------------------
        const filteredRows = computed(() => {
            return '( ' + filteredData.value.length + ' )'
        })


        // --------------------------------------------------------------------------
        // RuleSingle emits a request to refresh the rules
        // --------------------------------------------------------------------------
        const refreshRules = (status, msg) => {
            consoleLog('Rule.vue/refreshRules', 2, 'received a request to refresh the rules  from RulesList / RuleSingle', trace.value)
            consoleLog('Rule.vue/refreshRules', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadRuleData()
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
        // User asks to Export rules into a json file
        // --------------------------------------------------------------------------
        const handleExport = async (event) => {
            let ret = await doExport()
            if (ret) viewLink.value = true
        }

        // --------------------------------------------------------------------------
        // User cancel the action, Back to the control panel
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('Rule.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'Rules Set' })
        }

        // --------------------------------------------------------------------------
        // User change the row number
        // --------------------------------------------------------------------------
        const handleRowToInsert = () => {
            if (rowToInsert.value < 1 || rowToInsert.value > 10) {
                DisplayError('Row(s) to insert must be between 1 and 10', 'Warning')
                rowToInsert.value = 1
            }
        }

        // --------------------------------------------------------------------------
        // Call the API to reorder correctly all the positions of the rules 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let rule = []
            consoleLog('Rule.vue/doReorder', 2, 'Reorder all the positions of the Rules', trace.value)
            const { error, reorderTheRule } = reorderRules(ruleheaderID.value)
            return await reorderTheRule(rule, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Rule.vue/doReorder', 2, 'Rule reorder status: ' + rule.value.success, trace.value)
                    if (rule.value.success) {
                        consoleLog('Rule.vue/doReorder', 2, rule, trace.value)
                        return (1)
                    } else {
                        consoleLog('Rule.vue/doReorder', 2, 'Error during the reorder of the rules position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to insert a rule 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let rule = []
            const now = new Date();
            let comment = 'New'

            // projectID, ruleheaderID, ruleContinue, condition, result, message, comment, position, active
            consoleLog('Rule.vue/doInsert', 2, 'Insert a new Rule', trace.value)
            const { error, addNewRule } = addRule(projectID.value, ruleheaderID.value, 1, '1 == 1', '', '', comment, position, 1)
            return await addNewRule(rule, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Rule.vue/doInsert', 2, 'Rule insert status: ' + rule.value.success, trace.value)
                    if (rule.value.success) {
                        consoleLog('Rule.vue/doInsert', 2, rule, trace.value)
                        return (1)
                    } else {
                        consoleLog('Rule.vue/doInsert', 2, 'Error during the insert of a rule', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to copy a rule 
        // --------------------------------------------------------------------------
        const doCopy = async (ruleID, position) => {
            let rule = []
            consoleLog('Rule.vue/doCopy', 2, 'Copy an existing Rule - ruleID: ' + ruleID + ' at position: ' + position, trace.value)
            const { error, copyTheRule } = copyRule(ruleID, position)
            return await copyTheRule(rule, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Rule.vue/doCopy', 2, 'Rule copy status: ' + rule.value.success, trace.value)
                    if (rule.value.success) {
                        consoleLog('Rule.vue/doCopy', 2, rule, trace.value)
                        return (1)
                    } else {
                        consoleLog('Rule.vue/doCopy', 2, 'Error during the copy of a rule', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to update the position of a rule 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (ruleID, position) => {

            let rule = []
            consoleLog('Rule.vue/doUpdatePosition', 2, 'Change the position of a Rule - ruleID: ' + ruleID + ', position: ' + position, trace.value)
            const { error, updateThePosition } = updatePositionRules(ruleID, position)
            return await updateThePosition(rule, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('Rule.vue/doUpdatePosition', 2, 'Rule status: ' + rule.value.success, trace.value)
                    if (rule.value.success) {
                        consoleLog('Rule.vue/doUpdatePosition', 2, rule, trace.value)
                        return (1)
                    } else {
                        consoleLog('Rule.vue/doUpdatePosition', 2, 'Error during the update of the rule position', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete a rule 
        // --------------------------------------------------------------------------
        const doDelete = async (ruleID) => {
            let rule = []
            consoleLog('Rule.vue/doDelete', 2, 'Delete an existing Rule ' + ruleID, trace.value)
            const { error, deleteTheRule } = deleteRule(ruleID)
            return await deleteTheRule(rule, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Rule.vue/doDelete', 2, 'Rule delete status: ' + rule.value.success, trace.value)
                    if (rule.value.success) {
                        consoleLog('Rule.vue/doDelete', 2, rule, trace.value)
                        return (1)
                    } else {
                        consoleLog('Rule.vue/doDelete', 2, 'Error during the delete of a rule', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to export the rules into a json file 
        // --------------------------------------------------------------------------
        const doExport = async () => {
            let rule = []
            let filename = './data/' + jsonFile.value

            consoleLog('Rule.vue/doExport', 2, 'Export rules in ' + filename, trace.value)
            const { error, exportTheRule } = exportRule(ruleheaderID.value, filename)
            return await exportTheRule(rule, trace.value)
                .then(function () {
                    // check the status of the export
                    consoleLog('Rule.vue/doExport', 2, 'Rule export status: ' + rule.value.success, trace.value)
                    if (rule.value.success) {
                        consoleLog('Rule.vue/doExport', 2, rule, trace.value)
                        return (1)
                    } else {
                        consoleLog('Rule.vue/doExport', 2, 'Error during the export of the rules', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Rules received a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (ruleID) => {
            consoleLog('Rule.vue/selectRecord', 2, 'Received a request to select a record: ' + ruleID, trace.value)
            if (!recordSelected.value.includes(ruleID)) {
                recordSelected.value.push(ruleID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != ruleID)
            }
            consoleLog('Rule.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('Rule.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }

        // --------------------------------------------------------------------------
        // Rules received a request to add a new Rule
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('Rule.vue/handleInsert', 2, 'Add ' + rowToInsert.value + ' new empty rule(s) after the Rule position: ' + position, trace.value)
            let originalPosition = position
            position = position.toString().padStart(6, '0') + 'I'
            let status = 1;
            let err = 1;
            for (let i = 1; i <= rowToInsert.value; i++) {
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a rule', 'Alert')
            } else {
                DisplayError('Inserted ' + rowToInsert.value + ' rule(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            await doReorder()
            // Refresh the list
            context.emit('storelocation', 'controlpanel=' + originalPosition)
            location.value = 'controlpanel=' + originalPosition
            await loadRuleData()

        }

        // --------------------------------------------------------------------------
        // Rules received a request to copy record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('Rule.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' rule(s) after the Rule position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to copy before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                let originalPosition = position
                position = position.toString().padStart(6, '0') + 'C'
                // Copy all the selected rule(s)
                for (let recordID of recordSelected.value) {
                    position = originalPosition.toString().padStart(6, '0') + 'C'
                    position = position + counter
                    counter = counter + 1
                    if (await doCopy(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the copy of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected rule(s) copy successfully', 'Info')
                }
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                // Refresh the list
                context.emit('storelocation', 'controlpanel=' + originalPosition)
                location.value = 'controlpanel=' + originalPosition
                await loadRuleData()
                recordSelected.value = []
            }
        }

        // --------------------------------------------------------------------------
        // Rules received a request to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('Rule.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' rule(s) after the Rule position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                let originalPosition = position
                position = position.toString().padStart(6, '0') + 'M'
                // Update the position of all the selected rule(s)
                for (let recordID of recordSelected.value) {
                    position = originalPosition.toString().padStart(6, '0') + 'M'
                    position = position + counter
                    counter = counter + 1
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected record(s)', 'Alert')
                } else {
                    DisplayError('Selected rule(s) reorder successfully', 'Info')
                }
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                // Refresh the list
                context.emit('storelocation', 'controlpanel=' + originalPosition)
                location.value = 'controlpanel=' + originalPosition
                await loadRuleData()
                recordSelected.value = []
            }
        }

        // --------------------------------------------------------------------------
        // Rules received a request to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (ruleID, position) => {
            consoleLog('Rule.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' rule(s) and the Rule: ' + ruleID, trace.value)
            let status = 1;
            let originalPosition = position - 1

            // Add the ruleID if it's not already in the list
            if (!recordSelected.value.includes(ruleID)) {
                recordSelected.value.push(ruleID)
            }

            // Delete the selected rule(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected rule(s)', 'Alert')
            } else {
                DisplayError('Selected rule(s) deleted successfully', 'Info')
            }
            // Refresh the list
            context.emit('storelocation', 'controlpanel=' + originalPosition)
            location.value = 'controlpanel=' + originalPosition
            await loadRuleData()
            recordSelected.value = []
        }



        return {
            errorMessage, styleMessage, rules, ruleName, filteredData, filterValue, filteredRows, workspaceID, workspace, location, commentSwitch,
            superUser, projectID, projectName, subprojectID, subprojectName, userID, displayInfo, trace, rowToInsert, URL, jsonFile, viewLink,
            handleCancel, refreshRules, handleInsert, handleCopy, handleMove, handleDelete, selectRecord,
            handleFocus, handleBlur, handleCancel, handleRowToInsert, handleExport
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

.entity {
    /* padding: 2.3rem 2.2rem; */
    position: relative;
    background-color: #eee;
}


form {
    padding: 0 2.3rem 0 2.2rem;
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

th.menu,
td.menu {
    padding: 0 1.2rem 0 0;
    text-align: left;
}
button.action {
    background-color: #7cbcbc;
}

button.action:hover {
    background-color: white;
    color: black;
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

.entities {
    overflow: scroll;
    /* scrollbar-color: red orange; */
    scrollbar-width: thin;
    height: 50rem;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>