'use strict'

const AWS = require('aws-sdk');

const TABLE_NAME = process.env.DYNAMODB_TABLE ? process.env.DYNAMODB_TABLE: 'VideoDB'

module.exports.get = async (videoId) => {

    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: videoId,
        },
    };

    try {
        const result = await dynamoDb.get(params).promise();
        return result.Item;
    } catch (error) {
        throw error;
    }
};
