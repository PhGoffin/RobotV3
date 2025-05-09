/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-12
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-07 11:47:22
 * @Description: Store a reference (insert or update)
 */

import { ref } from 'vue'
import { consoleLog } from '../../util/debug';
import getReferenceByCode from './getReferenceByCode'
import addReference from './addReference'
import updateReference from './updateReference'

const storeReference = async (code, label, comment, projectID, userID, trace) => {
    const reference = ref([])
    let referenceID = 0
    consoleLog('storeReference.js/storeReference', 2, '------ Code: ' + code + ', label: ' + label, trace.value)
    // Check if the reference already exists
    // projectID, userID, code
    const { error, loadReference } = getReferenceByCode(projectID, userID, code)
    return await loadReference(reference, trace.value)
        .then(function () {
            return reference.value.success
        }).then(function (res) {
            consoleLog('storeReference.js/getReferenceByCode - getReference', 2, 'status: ' + res, trace.value)
            if (res) {
                referenceID = reference.value.data[0].referenceID
                consoleLog('storeReference.js/updateReference - Update reference', 2, '------ Update the reference: referenceID: ' + referenceID +', code: ' + code + ', label: ' + label, trace.value)
                // code, label, comment, active, projectID, userID, referenceID
                const { error, updateTheReference } = updateReference(code, label, comment, 1, projectID, userID, referenceID)
                return updateTheReference(reference, trace.value)
                    .then(function () {
                        consoleLog('storeReference.js/updateReference - Update reference', 2, '------ Update the reference', trace.value)
                        return reference.value.success
                    })
            } else {
                // no reference found, create a new one
                // projectID, userID, code, label, comment, position, active
                consoleLog('storeReference.js/updateReference - create reference', 2, '------ create a new reference: code: ' + code + ', label: ' + label, trace.value)
                const { error, addNewReference } = addReference(projectID, userID, code, label, comment, 9999, 1)
                return addNewReference(reference, trace.value)
                    .then(function () {
                        consoleLog('storeReference.js/addReference - Add reference', 2, '------ Add the reference', trace.value)
                        return reference.value.success
                    })
            }
        }).then(function (res) {
            consoleLog('storeReference.js', 2, 'Status: ' + res, trace.value)
            return res
        })
}

export default storeReference