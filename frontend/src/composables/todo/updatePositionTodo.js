/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-18
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 09:52:55
 * @Description: Update a Todo position
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';

const updatePositionTodo = (todoID, position) => {

    const error = ref(null)

    const updateThePosition = async (todo, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('updatePositionTodo.js/updateThePosition', 3, 'LOCAL Database Update Todo position not implemented', trace)
            } else {
                consoleLog('updatePositionTodo.js/updateThePosition', 3,'todoID: ' + todoID + ', position: ' + position )
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'todo/position', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'position': position, 'todoID': todoID  })
                })
                if (!data.ok) {
                    throw Error('Error during the update of the todo position')
                }
                todo.value = await data.json()
                consoleLog('updatePositionTodo.js/updateThePosition', 3, '--- updatePositionTodo ---' + url + 'todo/position', trace)
                consoleLog('updatePositionTodo.js/updateThePosition', 3, '--- Message: ' + todo.value.message, trace)
                consoleLog('updatePositionTodo.js/updateThePosition', 3, todo.value, trace)
            }

        } catch (err) {
            error.value = err.message
            consoleLog('updatePositionTodo.js/updateThePosition', 3, error.value, trace)
        }
    }

    return { error, updateThePosition }
}

export default updatePositionTodo