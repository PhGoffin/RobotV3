<template>
    <div class="my-container">

        <div class="form">
            <div class="banner">
                <h3 class="title">Todo</h3>
                <img src="../../assets/RobotV2.png" alt="robot">
                <Transition>
                    <p class="message" :class="styleMessage" v-if="errorMessage"> {{ errorMessage }}</p>
                </Transition>
            </div>

            <div class="entity">

                <p>&nbsp;</p>
                <p>&nbsp;</p>

                <form @submit.prevent="handleSubmit">

                    <div class="input-container focus">
                        <input type="text" name="RowNb" class="input" @focus="handleFocus($event)"
                            @blur="handleBlur($event)" @change="handleRowNb" v-model="rowNb" required />
                        <label>Row(s) to insert</label>
                        <span>Row(s) to insert</span>
                    </div>

                </form>



                <div class="todos"  height="150px">
                    <div v-if="error"> {{ error }}</div>
                    <div v-if="todos.length" class="layout">
                        <TodoList class="entitylist" :todos="todos" :superUser="superUser" :trace="trace"
                            @refreshtodo="refreshTodo" @selectrecord="selectRecord" @handleinsert="handleInsert"
                            @handlecopy="handleCopy" @handlemove="handleMove" @handledelete="handleDelete" />
                    </div>
                </div>


                <button @click="handleCancel" class="cancel">Cancel</button>


            </div>
        </div>


    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TodoList from '../../components/todo/TodoList.vue'
import getAllTodos from '../../composables/todo/getAllTodos'
import updatePositionTodo from '../../composables/todo/updatePositionTodo'
import reorderTodos from '../../composables/todo/reorderTodos'
import addTodo from '../../composables/todo/addTodo'
import copyTodo from '../../composables/todo/copyTodo'
import deleteTodo from '../../composables/todo/deleteTodo'
import Spinner from '../../components/Spinner.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
    name: 'Todos',
    props: ['trace', 'userrole', 'role', 'currentuser', 'userID', 'superUser', 'role', 'connected', 'workspaceID'],
    components: { TodoList, Spinner },

    setup(props, context) {
        const router = useRouter()
        const trace = ref(props.trace)

        displayMsg('Todo.vue', trace.value)
        consoleLog('Todo.vue - props', 1, props, trace.value)

        const workspaceID = ref(props.workspaceID)
        const todos = ref([])
        const superUser = ref(props.superUser)
        const displayInfo = ref('')
        const recordSelected = ref([])
        const recordTarget = ref(0)
        const rowNb = ref(1)

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
            consoleLog('Todo.vue/DisplayError', 2, 'Message: ' + errorMessage.value + ', Style: ' + styleMessage.value, trace.value)
            if (myStyle != 'Alert') {
                setTimeout(() => displayErrorFunction(myCallback), 3000)
            }
        }


        const loadTodoData = async () => {

            // -------------------------------------------
            // load all the todos
            // -------------------------------------------
            consoleLog('Todo.vue/loadTodoData', 2, 'Loading all the Todos', trace.value)
            const { error, loadTodo } = getAllTodos()
            await loadTodo(todos, trace.value)
                .then(function () {
                    // check the status of the load
                    consoleLog('Todo.vue/loadTodoData', 2, 'Todo status: ' + todos.value.success, trace.value)
                    if (todos.value.success && todos.value.data.length) {
                        todos.value = todos.value.data
                        consoleLog('Todo.vue/loadTodoData', 2, todos, trace.value)
                        return (1)
                    } else {
                        consoleLog('Todo.vue/loadTodoData', 2, 'No Todo found!', trace.value)
                        return (0)
                    }
                })
        }


        // Load todo data
        loadTodoData()

        // --------------------------------------------------------------------------
        // Todo emits a request to refresh the todos
        // --------------------------------------------------------------------------
        const refreshTodo = (status, msg) => {
            consoleLog('Todo.vue/refreshTodo', 2, 'received a request to refresh the todos from TodoList / TodoSingle', trace.value)
            consoleLog('Todo.vue/refreshTodo', 2, 'Code: ' + status + ', message: ' + msg, trace.value)
            if (status == 1) {
                DisplayError(msg, 'Info')
            } else {
                DisplayError(msg, 'Alert')
            }
            loadTodoData()
        }


        // --------------------------------------------------------------------------
        // User cancel the action, Back to the control panel
        // --------------------------------------------------------------------------
        const handleCancel = () => {
            consoleLog('Todo.vue/handleCancel', 2, 'User Cancel the action', trace.value)
            router.push({ name: 'ControlPanel' })
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
        // User change the row number
        // --------------------------------------------------------------------------
        const handleRowNb = () => {
            if (rowNb.value < 1 || rowNb.value > 10) {
                DisplayError('Row(s) to insert must be between 1 and 10', 'Warning')
                rowNb.value = 1
            }
        }


        // --------------------------------------------------------------------------
        // Call the API to reorder correctly all the position of a todos 
        // --------------------------------------------------------------------------
        const doReorder = async () => {

            let todo = []
            consoleLog('Todo.vue/doReorder', 2, 'Reorder all the position of a Todos', trace.value)
            const { error, reorderTheTodos } = reorderTodos()
            return await reorderTheTodos(todo, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Todo.vue/doReorder', 2, 'Todo reorder status: ' + todo.value.success, trace.value)
                    if (todo.value.success) {
                        consoleLog('Todo.vue/doReorder', 2, todo, trace.value)
                        return (1)
                    } else {
                        consoleLog('Todo.vue/doReorder', 2, 'Error during the reorder of the todos position', trace.value)
                        DisplayError('Internal Error during the reorder', 'Error')
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to insert  a todo 
        // --------------------------------------------------------------------------
        const doInsert = async (position) => {
            let todo = []
            const now = new Date();
            const currentDateTime = now.toLocaleString();
            let label = 'New - ' + currentDateTime
            // New - 1/19/2024, 8:41:31 AM

            consoleLog('Todo.vue/doInsert', 2, 'Insert a new Todo', trace.value)
            const { error, addNewTodo } = addTodo(label, position)
            return await addNewTodo(todo, trace.value)
                .then(function () {
                    // check the status of the reorder
                    consoleLog('Todo.vue/doInsert', 2, 'Todo insert status: ' + todo.value.success, trace.value)
                    if (todo.value.success) {
                        consoleLog('Todo.vue/doInsert', 2, todo, trace.value)
                        return (1)
                    } else {
                        consoleLog('Todo.vue/doInsert', 2, 'Error during the insert of a todo', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to copy  a todo 
        // --------------------------------------------------------------------------
        const doCopy = async (todoID, position) => {
            let todo = []
            consoleLog('Todo.vue/doCopy', 2, 'Copy an existing Todo - todoID: ' + todoID + ' at position: ' + position, trace.value)
            const { error, copyTheTodo } = copyTodo(todoID, position)
            return await copyTheTodo(todo, trace.value)
                .then(function () {
                    // check the status of the copy
                    consoleLog('Todo.vue/doCopy', 2, 'Todo copy status: ' + todo.value.success, trace.value)
                    if (todo.value.success) {
                        consoleLog('Todo.vue/doCopy', 2, todo, trace.value)
                        return (1)
                    } else {
                        consoleLog('Todo.vue/doCopy', 2, 'Error during the copy of a todo', trace.value)
                        return (0)
                    }
                })
        }


        // --------------------------------------------------------------------------
        // Call the API to update the position of a todo 
        // --------------------------------------------------------------------------
        const doUpdatePosition = async (todoID, position) => {

            let todo = []
            consoleLog('Todo.vue/doUpdatePosition', 2, 'Change the position of a Todo - todoID: ' + todoID + ', position: ' + position, trace.value)
            const { error, updateThePosition } = updatePositionTodo(todoID, position)
            return await updateThePosition(todo, trace.value)
                .then(function () {
                    // check the status of the update
                    consoleLog('Todo.vue/doUpdatePosition', 2, 'Todo status: ' + todo.value.success, trace.value)
                    if (todo.value.success) {
                        consoleLog('Todo.vue/doUpdatePosition', 2, todo, trace.value)
                        return (1)
                    } else {
                        consoleLog('Todo.vue/doUpdatePosition', 2, 'Error during the update of the todo position', trace.value)
                        return (0)
                    }
                })
        }

        // --------------------------------------------------------------------------
        // Call the API to delete a todo 
        // --------------------------------------------------------------------------
        const doDelete = async (todoID) => {
            let todo = []
            consoleLog('Todo.vue/doDelete', 2, 'Delete an existing Todo - todoID: ' + todoID,  trace.value)
            const { error, deleteTheTodo } = deleteTodo(todoID)
            return await deleteTheTodo(todo, trace.value)
                .then(function () {
                    // check the status of the delete
                    consoleLog('Todo.vue/doDelete', 2, 'Todo delete status: ' + todo.value.success, trace.value)
                    if (todo.value.success) {
                        consoleLog('Todo.vue/doDelete', 2, todo, trace.value)
                        return (1)
                    } else {
                        consoleLog('Todo.vue/doDelete', 2, 'Error during the delete of a todo', trace.value)
                        return (0)
                    }
                })
        }



        // --------------------------------------------------------------------------
        // Todo emits a request to select a record
        // --------------------------------------------------------------------------
        const selectRecord = (todoID) => {
            consoleLog('TodoList.vue/selectRecord', 2, 'Emit a request to the parent to select a record: ' + todoID, trace.value)
            if (!recordSelected.value.includes(todoID)) {
                recordSelected.value.push(todoID)
            } else {
                recordSelected.value = recordSelected.value.filter((ar) => ar != todoID)
            }
            consoleLog('TodoList.vue/selectRecord', 2, recordSelected.value, trace.value)
            consoleLog('TodoList.vue/selectRecord', 2, 'Length: ' + recordSelected.value.length, trace.value)
        }


        // --------------------------------------------------------------------------
        // User asks to add a new Todo
        // --------------------------------------------------------------------------
        const handleInsert = async (position) => {
            consoleLog('Todo.vue/handleInsert', 2, 'Add ' + rowNb.value + ' new empty todo(s) after the Todo position: ' + position, trace.value)
            position = position.padStart(6, '0') + 'I'
            let status = 1;
            let err = 1;
            for (let i = 1; i <= rowNb.value; i++) {
                //console.log (' ******** 1 ******* Loop: ' + i)
                position = position + i
                if (await doInsert(position) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the insert of a todo', 'Alert')
            } else {
                DisplayError('Inserted ' + rowNb.value + ' todo(s) successfully', 'Info')
            }
            // Regenerate a nice position sequence (1, 2, 3....)
            //console.log (' ******** 2 ******* reorder')
            await doReorder()
            // Refresh the list
            //console.log (' ******** 3 ******* refresh')
            await loadTodoData()

        }


        // --------------------------------------------------------------------------
        // User want to move record(s)
        // --------------------------------------------------------------------------
        const handleCopy = async (position) => {
            consoleLog('Todo.vue/handleCopy', 2, 'Copy ' + recordSelected.value.length + ' todo(s) after the Todo position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to copy before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.padStart(6, '0') + 'C'
                //console.log (' ******** 1 ******* Loop')
                // Copy all the selected todo(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doCopy(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the copy of the selected todo(s)', 'Alert')
                } else {
                    DisplayError('Selected todo(s) copy successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadTodoData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // User want to move record(s)
        // --------------------------------------------------------------------------
        const handleMove = async (position) => {
            consoleLog('Todo.vue/handleMove', 2, 'Move ' + recordSelected.value.length + ' todo(s) after the Todo position: ' + position, trace.value)
            if (recordSelected.value.length == 0) {
                DisplayError('Please select the record(s) to move before...', 'Warning')
            } else {
                let counter = 1
                let status = 1;
                position = position.padStart(6, '0') + 'M'
                //console.log (' ******** 1 ******* Loop')
                // Update the position of all the selected todo(s)
                for (let recordID of recordSelected.value) {
                    position = position + counter
                    counter = counter + 1
                    if (await doUpdatePosition(recordID, position) == 0) status = 0
                }
                if (status == 0) {
                    DisplayError('Error during the reorder of the selected todo(s)', 'Alert')
                } else {
                    DisplayError('Selected todo(s) reorder successfully', 'Info')
                }
                //console.log (' ******** 2 ******* reorder')
                // Regenerate a nice position sequence (1, 2, 3....)
                //await doReorder()
                //console.log (' ******** 3 ******* refresh')
                // Refresh the list
                await loadTodoData()
                recordSelected.value = []
            }
        }


        // --------------------------------------------------------------------------
        // User want to delete selected record(s)
        // --------------------------------------------------------------------------
        const handleDelete = async (todoID) => {
            consoleLog('Todo.vue/handleDelete', 2, 'Delete ' + recordSelected.value.length + ' todo(s) and the Todo: ' + todoID, trace.value)
            let status = 1;
            //console.log (' ******** 1 ******* Loop')

            // Add the todoID if it's not already in the list
            if (!recordSelected.value.includes(todoID)) {
                recordSelected.value.push(todoID)
            }

            // Delete the selected todo(s)
            for (let recordID of recordSelected.value) {
                if (await doDelete(recordID) == 0) status = 0
            }
            if (status == 0) {
                DisplayError('Error during the delete of the selected todo(s)', 'Alert')
            } else {
                DisplayError('Selected todo(s) deleted successfully', 'Info')
            }
            //console.log (' ******** 2 ******* refresh')
            // Refresh the list
            await loadTodoData()
            recordSelected.value = []
        }




        return {
            errorMessage, styleMessage, todos, workspaceID, superUser, displayInfo, trace, rowNb,
            handleCancel, handleInsert, handleCopy, handleMove, handleDelete,
            refreshTodo, selectRecord, handleFocus, handleBlur, handleRowNb
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
    width: 80%;
    /* max-width: 2000px; */
    min-height: 65vh;
    background-color: #eee;
    border-radius: 3rem;
    box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    overflow: hidden;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.banner {
    background-color: #1abc9c;
    position: relative;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.2);
    max-width: 60%;
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
    position: relative;
    top: 1%;
    width: 200px;
    height: 200px;
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
    width: 130%;
    margin-left: -12rem;
}

.entity .title {
    padding: 2.3rem 2.2rem;
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
    top: -3.5rem;
    width: 35%;
}

.input-container {
    position: relative;
    margin: 1rem 0;
}

.input {
    width: 100%;
    outline: none;
    border: 2px solid #3d3c3c;
    background: white;
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

button.hide {
    visibility: hidden;
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
</style>