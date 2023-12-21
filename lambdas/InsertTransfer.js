const AWS = require('aws-sdk');

const { getDynamoConnection } = require('../helpers/dynamo_connection');

let internalContext = {
    transfersCollectionName: process.env.TRANSFERS_COLLECTION_NAME
}

const insertTransfer = async (event) => {
    const requestBody = JSON.parse(event.body);

    const connection = getDynamoConnection();

    const params = {
        TableName: internalContext.transfersCollectionName,
        Item: requestBody
    };

    try {
        await connection.put(params).promise();
        return { statusCode: 200, body: JSON.stringify(requestBody) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify(error) };
    }
};
module.exports = { insertTransfer };