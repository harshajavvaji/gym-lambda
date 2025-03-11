const AWS = require('aws-sdk');
require('dotenv').config()

const { fetchCustomersActive, fetchCustomerSubscription } = require('./db/dbFunctions')
const { isExpired } = require('./core/validateExpiry')
const { handleExpiredSubscription } = require('./core/handleExpiry')

AWS.config.update({
    region: process.env.REGION, // Replace with your region
    accessKeyId: process.env.ACCESSKEYID, // Replace with your access key ID
    secretAccessKey: process.env.SECRETACCESSKEY, // Replace with your secret access key
});


exports.handler = async (event) => {
    console.log("func execution started")
    const activeCustomersReponse = await fetchCustomersActive()
    const activeCustomers = activeCustomersReponse.Items
    activeCustomers.forEach(async (customer) => {
        const custSubRecord = await fetchCustomerSubscription(customer.activeSubscriptionId)
        if (custSubRecord?.expiryDate) {
            let expired = isExpired(custSubRecord.expiryDate)
            if (expired) {
                console.log('Subscription is expired')
                await handleExpiredSubscription(custSubRecord, customer)
            }
            else {
                console.log('Subscription is not expired')
            }
        }
    });
    console.log("func execution finished")
    return "done"
};

// const callingFuctions = async () => {
//     const activeCustomersReponse = await fetchCustomersActive()
//     console.log('1', activeCustomersReponse)
//     const activeCustomers = activeCustomersReponse.Items
//     console.log('3', activeCustomers)

//     for (const customer of activeCustomers) {
//         const custSubRecord = await fetchCustomerSubscription(customer.activeSubscriptionId)
//         if (custSubRecord?.expiryDate) {
//             let expired = isExpired(custSubRecord.expiryDate)
//             if (expired) {
//                 console.log('Subscription is expired')
//                 await handleExpiredSubscription(custSubRecord, customer)
//             }
//             else {
//                 console.log('Subscription is not expired')
//             }
//         }
//     };
// }

// callingFuctions()
