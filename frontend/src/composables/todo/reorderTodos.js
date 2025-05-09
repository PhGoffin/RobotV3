/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-18
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 12:20:04
 * @Description: Reorder all the Todos
 */


import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const reorderTodos = () => {

    const error = ref(null)

    const reorderTheTodos = async (todo, trace) => {
        try {

            if (process.env.VUE_APP_DATABASE == 'LOCAL') {
                consoleLog('reorderTodos.js/reorderTheTodos', 3, 'LOCAL Database reorderTodos is not implemented', trace)
            } else {
                consoleLog('reorderTodos.js/reorderTheTodos', 3,' ', trace)
                const url = process.env.VUE_APP_MYSQL_API
                let data = await fetch(url + 'todo/reorder')
                if (!data.ok) {
                    throw Error('No todo available')
                }
                todo.value = await data.json()
            }

        } catch (err) {
            error.value = err.message
            consoleLog('reorderTodos.js/reorderTheTodos', 3, err)
        }
    }

    return { error, reorderTheTodos }
}

export default reorderTodos