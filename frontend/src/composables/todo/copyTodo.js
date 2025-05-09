/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-19
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Copy a Todo
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const copyTodo = (todoID, position) => {

    const error = ref(null)

    const copyTheTodo = async (todo, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('copyTodo.js/copyTheTodo', 3, 'LOCAL Database Copy Todo not implemented', trace)
            } else {
                consoleLog('copyTodo.js/copyTheTodo', 3,'todoID: ' + todoID + ', Position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'todo/copy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'todoID': todoID })
                })
                if (!data.ok) {
                    throw Error('Error during the copy of a todo')
                }
                todo.value = await data.json()
                consoleLog('copyTodo.js/copyTheTodo', 3, '--- copyTodo ---' + url + 'todo/copy', trace)
                consoleLog('copyTodo.js/copyTheTodo', 3, '--- Message: ' + todo.value.message, trace)
                consoleLog('copyTodo.js/copyTheTodo', 3, todo.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('copyTodo.js/copyTheTodo', 3, error.value, trace)
        }
    }

    return { error, copyTheTodo }
}

export default copyTodo