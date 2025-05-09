/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-07
 * @Last Modified by: 
 * @Last Modified time: 2024-01-10 10:23:04
 * @Description: Get detail of a dummyuser
 */

import { ref } from 'vue'
import { consoleLog}  from '../../util/debug';


const getDummyuser = (dummyuserID) => {

  const error = ref(null)

  const loadDummyuser = async (dummyuser, trace) => {
    try {
      if (process.env.VUE_APP_DATABASE == 'LOCAL') {
        consoleLog('getDummyuser.js/loadDummyuser', 3, 'LOCAL Database get a dummyuser not implemented', trace)
      } else {
        consoleLog('getDummyuser.js/loadDummyuser', 3, 'dummyuserID:' + dummyuserID, trace)
        const url = process.env.VUE_APP_MYSQL_API
        let data = await fetch(url + 'dummyuser/' + dummyuserID)
        if (!data.ok) {
          throw Error('no dummyuser available')
        }
        dummyuser.value = await data.json()
      }


    } catch (err) {
      error.value = err.message
      consoleLog('getDummyuser.js/loadDummyuser', 3, error.value, trace)
    }
  }

  return { error, loadDummyuser }
}

export default getDummyuser