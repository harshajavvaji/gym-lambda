const { fetchCustomerSubscription, fetchSubscription, updateCustomer, updateCustomerSubscription } = require('../db/dbFunctions')
const { calculateExpiry } = require('./validateExpiry')


const handleExpiredSubscription = async (custSubRecord, customer) => {
    console.log('Handling expired subscription')
    custSubRecord.status = 'expired'
    if (customer.upcomingSubscriptionId != undefined && customer.upcomingSubscriptionId != "") {
        let upcomingSubRecord = await fetchCustomerSubscription(customer.upcomingSubscriptionId)
        let subscriptionRecord = await fetchSubscription(upcomingSubRecord.subscriptionId)
        let newExpiry = calculateExpiry(subscriptionRecord?.validity)
        upcomingSubRecord.expiryDate = newExpiry
        upcomingSubRecord.status = 'active'
        customer.activeSubscriptionId = customer.upcomingSubscriptionId
        customer.upcomingSubscriptionId = ""
        let isActiveSubUpdated = await updateCustomerSubscription(custSubRecord)
        let isCustSubUpdated = await updateCustomerSubscription(upcomingSubRecord)
        let isCustomerUpdated = await updateCustomer(customer)
        if (isCustSubUpdated && isCustomerUpdated && isActiveSubUpdated) {
            console.log('Customer and Subscription updated successfully, when upcoming exists')
        }
        else {
            console.log('Error updating customer and subscription, when upcoming exists')
        }
    }
    else{
        custSubRecord.status = 'expired'
        customer.status = 'expired'
        let isCustSubUpdated = await updateCustomerSubscription(custSubRecord)
        let isCustomerUpdated = await updateCustomer(customer)
        if (isCustSubUpdated && isCustomerUpdated) {
            console.log("Customer and Subscription updated successfully, when upcoming doesn't exists")
        }
        else {
            console.log("Error updating customer and subscription, when upcoming doesn't exists")
        }
    }
}

module.exports = { handleExpiredSubscription }

