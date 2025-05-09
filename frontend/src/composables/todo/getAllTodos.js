/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-17
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:30:52
 * @Description: Get all the Todos
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getAllTodos = () => {

    const error = ref(null)

    const loadTodo = async (todos, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getAllTodos.js/loadTodo', 3, 'LOCAL Database load todo not implemented!', trace)
            } else {
                //console.log('MySQL workspace')
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'todo' )
                if (!data.ok) {
                    throw Error('no todo available')
                }
                todos.value = await data.json()
                //todos.value = todos.value.data
                consoleLog('getAllTodos.js/loadTodo', 3, todos.value, trace)

            }


        } catch (err) {
            error.value = err.message
            consoleLog('getAllTodos.js/loadTodo', 3, error.value, trace)
        }
    }

    return { error, loadTodo }
}

export default getAllTodos