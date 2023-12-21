const AWS = require('aws-sdk');

const { getDynamoConnection } = require('../helpers/dynamo_connection');

let internalContext = {
    transfersCollectionName: process.env.TRANSFERS_COLLECTION_NAME
}

const updateTransfer = async (event) => {
    // Suponiendo que se envía el campo 'monto' a actualizar, junto con el 'id' en el path
    const requestBody = JSON.parse(event.body);

    const connection = getDynamoConnection();

    const params = {
        TableName: internalContext.transfersCollectionName,
        Key: {
            id: event.pathParameters.id
        },
        UpdateExpression: 'set monto = :monto',
        ExpressionAttributeValues: {
            ':monto': requestBody.monto
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        const data = await connection.update(params).promise();
        return { statusCode: 200, body: JSON.stringify(data.Attributes) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify(error) };
    }
};

module.exports = {
    updateTransfer
}