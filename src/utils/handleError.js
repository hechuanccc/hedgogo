export function handleError (errors, field, fields) {
    let responseError = ''
    let gettype = Object.prototype.toString

    let utility = {
        isObj: function (o) {
            return gettype.call(o) === '[object Object]'
        }
    }

    if (Array.isArray(errors)) {
        for (let item in errors) {
            if (errors[item].hasOwnProperty(field)) {
                responseError += fields[field] + errors[item][field]
                return responseError
            }
        }
    } else if (utility.isObj(errors)) {
        for (let item in errors.error) {
            if (item === field) {
                responseError += fields[field] + errors.error[item]
                return responseError
            }
        }
    }
    return ''
}
