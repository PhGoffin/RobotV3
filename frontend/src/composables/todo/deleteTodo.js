/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-17
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Delete a Todo
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const deleteTodo = (todoID) => {

    const error = ref(null)

    const deleteTheTodo = async (todo, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('deleteTodo.js/deleteTheTodo', 3, 'LOCAL Database Delete Todo not implemented', trace)
            } else {
                consoleLog('deleteTodo.js/deleteTheTodo', 3,'todoID: ' + todoID , trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'todo/delete/' + todoID)
                if (!data.ok) {
                    throw Error('Error during the delete of a todo')
                }
                todo.value = await data.json()
                consoleLog('deleteTodo.js/deleteTheTodo', 3,'--- deleteTodo ---' + url + 'todo/delete/' + todoID, trace)
                consoleLog('deleteTodo.js/deleteTheTodo', 3,'--- Message: ' + todo.value.message, trace)
                consoleLog('deleteTodo.js/deleteTheTodo', 3,todo.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('deleteTodo.js/deleteTheTodo', 3, error.value, trace)
        }
    }

    return { error, deleteTheTodo }
}

export default deleteTodo