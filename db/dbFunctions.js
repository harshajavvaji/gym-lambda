
const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
    region: process.env.REGION, // Replace with your region
    accessKeyId: process.env.ACCESSKEYID, // Replace with your access key ID
    secretAccessKey: process.env.SECRETACCESSKEY, // Replace with your secret access key
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();


const fetchCustomersActive = async () => {
    let params = {
        TableName: process.env.CUSTOMERTABLENAME,
        IndexName: "status-index",
        KeyConditionExpression: '#status = :statusValue',
        ExpressionAttributeNames: {
            '#status': 'status'
        },
        ExpressionAttributeValues: {
            ':statusValue': 'active'
        }
    };
    try {
        let customers = []
        let custObjs = (await dynamoDB.query(params).promise()).Items;
    
        for(const cust of custObjs){ 
            params = {
                TableName: process.env.CUSTOMERTABLENAME,
                Key: { id: cust.id },
            }
            result = (await dynamoDB.get(params).promise()).Item
            customers = [...customers, result]
            console.log('result', customers)            
        }
        console.log('result', customers)
        return { count: customers.length, Items: customers };
        
    } catch (error) {
        console.error("Error occured:", error);
        return {
            statusCode: 500,
            error
        };
    }
}

const fetchCustomerFromIds = async (customerId) => {
}

const fetchCustomerSubscription = async (custSubId) => {
    const params = {
        TableName: process.env.CUSTOMERSUBSCRIPTIONTABLENAME,
        Key: { id: custSubId },
    };

    try {
        const custSubRecord = await dynamoDB.get(params).promise();
        return custSubRecord.Item;
    } catch (error) {
        console.log(error)
        return false;
    }
}

const fetchSubscription = async (subId) => {

    console.log(subId)
    const params = {
        TableName: process.env.SUBSCRIPTIONTABLENAME,
        Key: { id: subId },
    };

    try {
        const subsRecord = await dynamoDB.get(params).promise();
        return subsRecord.Item;
    } catch (error) {
        return false;
    }
}

const fetchCustomer = async (custId) => {

    console.log(custId)
    const params = {
        TableName: process.env.CUSTOMERTABLENAME,
        Key: { id: custId },
    };

    try {
        const custRecord = await dynamoDB.get(params).promise();
        return custRecord.Item;
    } catch (error) {
        return false;
    }
}

const updateCustomerSubscription = async (updatedCustSubscription) => {
    try {
        const params = {
            TableName: process.env.CUSTOMERSUBSCRIPTIONTABLENAME,
            Item: updatedCustSubscription
        };
        await dynamoDB.put(params).promise()
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

const updateCustomer = async (updatedCustomer) => {
    try {
        const params = {
            TableName: process.env.CUSTOMERTABLENAME,
            Item: updatedCustomer
        };
        await dynamoDB.put(params).promise()
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}


module.exports = { fetchCustomersActive, fetchCustomerSubscription, fetchSubscription, updateCustomer, updateCustomerSubscription }