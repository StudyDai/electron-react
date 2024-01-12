export const flattenArr = (arr) => {
    return arr.reduce((pre, current) => {
        pre[current.id] = current
        return pre
    }, {})
}

export const objToArr = (obj) => {
    return Object.keys(obj).map(key => obj[key])
}