
const isExpired = (expiryEpoch) => {
    let currentTime = new Date().getTime()
    if (currentTime < expiryEpoch) { // need to change it back (for testing purpose)
        return true
    }
    else {
        return false
    }
}

const calculateExpiry = (validity)=>{
    let months = Number(validity.slice(0,-1)) // 3m
    let currentTime = new Date()
    let newExpiry = new Date(currentTime.setMonth(currentTime.getMonth()+months)).getTime()
    return newExpiry
}

module.exports = {isExpired, calculateExpiry}