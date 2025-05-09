/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-17
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Todo
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updateTodo = (todoID, todoName) => {

    const error = ref(null)

    const updateTheTodo = async (todo, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updateTodo.js/updateTheTodo', 3, 'LOCAL Database Update Todo not implemented', trace)
            } else {
                consoleLog('updateTodo.js/updateTheTodo', 3,'todoID: ' + todoID + ', todoName: ' + todoName )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'todo/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'todo': todoName, 'todoID': todoID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of a todo')
                }
                todo.value = await data.json()
                consoleLog('updateTodo.js/updateTheTodo', 3, '--- updateTodo ---' + url + 'todo/update', trace)
                consoleLog('updateTodo.js/updateTheTodo', 3, '--- Message: ' + todo.value.message, trace)
                consoleLog('updateTodo.js/updateTheTodo', 3, todo.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updateTodo.js/updateTheTodo', 3, error.value, trace)
        }
    }

    return { error, updateTheTodo }
}

export default updateTodo