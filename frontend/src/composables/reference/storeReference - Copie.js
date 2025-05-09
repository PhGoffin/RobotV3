/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-12
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-07 10:49:47
 * @Description: Store a reference (insert or update)
 */

import { ref } from 'vue'
import { consoleLog } from '../../util/debug';
import getReferenceByCode from './getReferenceByCode'
import addReference from './addReference'
import updateReference from './updateReference'


const storeReference = (code, label, comment, projectID, userID) => {

    const error = ref(null)
    let referenceID = 0
    const storeTheReference = async (reference, trace) => {
        consoleLog('storeReference.js/storeReference', 2, '------ Code: ' + code + ', label: ' + label , trace.value)
        // Check if the reference already exists
        // projectID, userID, code
        const { error, loadReference } = getReferenceByCode(projectID, userID, code)
        await loadReference(reference, trace.value)
            .then(function () {
                consoleLog('storeReference.js/getReferenceByCode - getReference', 2, 'status: ' + reference, trace.value)
                return reference.value.success
            }).then(function (res) {
                console.log ('loadReference RES: ', res)
                if (res) {
                    referenceID = reference.value.data[0].referenceID
                    consoleLog('storeReference.js/updateReference - Update reference', 2, '------ Update the reference: code: ' + code + ', label: ' + label, trace.value)
                    // code, label, comment, active, projectID, userID, referenceID
                    const { error, updateTheReference } = updateReference(code, label, comment, 1, projectID, userID, referenceID)
                    updateTheReference(reference.value, trace.value)
                        .then(function () {
                            consoleLog('storeReference.js/updateReference - Update reference', 2, '------ Update the reference', trace.value)
                            consoleLog('storeReference.js/updateReference - Update reference', 2, 'status: ' + reference, trace.value)
                            return reference.value.success
                        })
                } else {
                    // no reference found, create a new one
                    // projectID, userID, code, label, comment, position, active
                    consoleLog('storeReference.js/updateReference - create reference', 2, '------ create a new reference: code: ' + code + ', label: ' + label, trace.value)
                    const { error, addNewReference } = addReference(projectID, userID, code, label, comment, 9999, 1)
                    addNewReference(reference.value, trace.value)
                        .then(function () {
                            consoleLog('storeReference.js/addReference - Add reference', 2, '------ Add the reference', trace.value)
                            consoleLog('storeReference.js/addReference - Add reference', 2, 'Status: ' + reference, trace.value)
                            return reference.value.success
                        })
                }
            })        


    }
    return { error, storeTheReference }
}

export default storeReference