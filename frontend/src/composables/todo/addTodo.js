/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-17
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Add a new Todo
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const addTodo = (todoName, position) => {

    const error = ref(null)

    const addNewTodo = async (todo, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('addTodo.js/addNewTodo', 3, 'LOCAL Database Add Todo not implemented', trace)
            } else {
                consoleLog('addTodo.js/addNewTodo', 3,'todoName: ' + todoName + ', Position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'todo/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'todo': todoName, 'position': position })
                })
                if (!data.ok) {
                    throw Error('Error during the insert of a todo')
                }
                todo.value = await data.json()
                consoleLog('addTodo.js/addNewTodo', 3, '--- createTodo ---' + url + 'todo/create', trace)
                consoleLog('addTodo.js/addNewTodo', 3, '--- Message: ' + todo.value.message, trace)
                consoleLog('addTodo.js/addNewTodo', 3, todo.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('addTodo.js/addNewTodo', 3, error.value, trace)
        }
    }

    return { error, addNewTodo }
}

export default addTodo