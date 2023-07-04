const toString = Object.prototype.toString

/**
 * 移除对象中的空值。
 * @param {*} o
 * @returns {Object}
 */
export function removeNullItem (o) {
    const s = {}.toString.call(o)
    if (s === '[object Array]') {
        processArray(o)
    } else if (s === '[object Object]') {
        proccessObject(o)
    }
}

/**
 * 处理数组。
 * @param {*} arr
 */
function processArray (arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (
            typeof arr[i] === 'object'
        ) {
            removeNullItem(arr[i])
        }
    }
    return arr.length === 0
}

/**
 * 处理对象。
 * @param {*} o
 */
function proccessObject (o) {
    for (const attr in o) {
        if (o[attr] === null || o[attr] === undefined) delete o[attr]
        else if (typeof o[attr] === 'object') {
            if (isEmptyObj(o[attr])) delete o[attr]
        }
    }
}

function isEmptyObj (o) {
    if (isUndefined(o)) {
        return true
    }

    if (o instanceof Element) {
        return false
    }

    const arr = Object.keys(o)
    return arr.length === 0
}

function isUndefined (val) {
    return typeof val === 'undefined'
}

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
export function isArray (val) {
    return toString.call(val) === '[object Array]'
}
