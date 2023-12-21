const AWS = require('aws-sdk');

const { getDynamoConnection } = require('../helpers/dynamo_connection');

let internalContext = {
    transfersCollectionName: process.env.TRANSFERS_COLLECTION_NAME
}

const readTransfer = async (event) => {

    const connection = getDynamoConnection();

    const params = {
        TableName: internalContext.transfersCollectionName,
        Key: {
            id: event.pathParameters.id
        }
    };

    try {
        const data = await connection.get(params).promise();
        return { statusCode: 200, body: JSON.stringify(data.Item) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify(error) };
    }
};

module.exports = { readTransfer };