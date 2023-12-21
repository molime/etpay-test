const AWS = require('aws-sdk');

const { getDynamoConnection } = require('../helpers/dynamo_connection');

let internalContext = {
    transfersCollectionName: process.env.TRANSFERS_COLLECTION_NAME
}



const deleteTransfer = async (event) => {

    const connection = getDynamoConnection();

    const params = {
        TableName: internalContext.transfersCollectionName,
        Key: {
            id: event.pathParameters.id
        }
    };

    try {
        await connection.delete(params).promise();
        return { statusCode: 200, body: 'Documento eliminado con éxito' };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify(error) };
    }
};

module.exports = { deleteTransfer };