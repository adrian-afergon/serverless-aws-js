'use strict'

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = async (videoId) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: videoId,
        },
    };

    try {
        const result = await dynamoDb.get(params).promise();
        return result.Item;
    } catch (error) {
        throw new Error(error);
    }
};
