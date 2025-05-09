<template>
  <div class="todos">
    <div v-for="todo in todos" :key="todo.todoID">
      <TodoSingle :todo="todo" :superUser="superUser" :trace="trace" 
      @refreshtodo="refreshTodo" @selectrecord="selectRecord"
      @handleinsert="handleInsert"  @handlecopy="handleCopy" @handlemove="handleMove" @handledelete="handleDelete"/>
    </div>
  </div>
</template>
    
<script>
import { ref } from 'vue'
import TodoSingle from './TodoSingle.vue'
import { displayMsg, consoleLog } from '../../util/debug';

export default {
  props: ['trace', 'todos', 'superUser'],
  components: { TodoSingle },
  setup(props, context) {
    const trace = ref(props.trace)

    displayMsg('TodoList.vue', trace.value)
    consoleLog('TodoList.vue - props', 1, props, trace.value)

    const todos = ref(props.todos)
    const superUser = ref(props.superUser)


    // --------------------------------------------------------------------------
    // TodoSingle emits a request to refresh the todos
    // --------------------------------------------------------------------------
    const refreshTodo = (status, msg) => {
      consoleLog('TodoList.vue/refreshWorkspaces', 2, 'Emit a request to the parent to refresh the list', trace.value)
      context.emit('refreshtodo', status, msg)
    }

    // --------------------------------------------------------------------------
    // TodoSingle emits a request to select a todo
    // --------------------------------------------------------------------------
    const selectRecord = (todoID) => {
      consoleLog('TodoList.vue/selectRecord', 2, 'Emit a request to the parent to select a record', trace.value)
      context.emit('selectrecord', todoID)
    }


    // --------------------------------------------------------------------------
    // TodoSingle emits a request to insert todo(s) after the record
    // --------------------------------------------------------------------------
    const handleInsert = (position) => {
      consoleLog('TodoList.vue/handleInsert', 2, 'Emit event to Insert a record', trace.value)
      context.emit('handleinsert', position)
    }

    // --------------------------------------------------------------------------
    // TodoSingle emits a request to copy todo(s) after the record
    // --------------------------------------------------------------------------
    const handleCopy = (todoID) => {
      consoleLog('TodoList.vue/handleCopy', 2, 'Emit event to Copy record(s)', trace.value)
      context.emit('handlecopy', todoID)
    }

    // --------------------------------------------------------------------------
    // TodoSingle emits a request to move todo(s) after the record
    // --------------------------------------------------------------------------
    const handleMove = (position) => {
      consoleLog('TodoList.vue/handleMove', 2, 'Emit event to move record(s)', trace.value)
      context.emit('handlemove', position)
    }

    // --------------------------------------------------------------------------
    // TodoSingle emits a request to delete todo(s)
    // --------------------------------------------------------------------------
    const handleDelete = (todoID) => {
      consoleLog('TodoList.vue/handleDelete', 2, 'Emit event to delete record(s)', trace.value)
      context.emit('handledelete', todoID)
    }


    return { trace, todos, superUser, 
      refreshTodo, selectRecord, handleInsert, handleCopy, handleMove, handleDelete }

  }
}
</script>
    
<style></style>