const AWS = require("aws-sdk");

// Connection to Dynamo AWS
const getDynamoConnection = () => {
    try {
        AWS.config.update({
            region: "us-east-1",
            endpoint: 'dynamodb.us-east-1.amazonaws.com',
            accessKeyId: process.env.AWS_ACCESS,
            secretAccessKey: process.env.AWS_SECRET
        });

        const connection = new AWS.DynamoDB.DocumentClient();
        return connection;
    } catch (error) {
        return {};
    }
};

module.exports = {
    getDynamoConnection,
};