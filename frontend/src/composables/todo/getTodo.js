/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-17
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Load detail of a Todo
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getTodo = (todoID) => {

    const error = ref(null)

    const loadTodo = async (todo, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('getTodo.js/loadTodo', 3, 'LOCAL Database getTodo is not implemented', trace)
            } else {
                consoleLog('getTodo.js/loadTodo', 3,' todoID ' + todoID, trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'todo/' + todoID)
                if (!data.ok) {
                    throw Error('No todo available')
                }
                todo.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('getTodo.js/loadTodo', 3, err)
        }
    }

    return { error, loadTodo }
}

export default getTodo