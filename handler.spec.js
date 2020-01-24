const { getVideo } = require('./handler');
const AWS = require("aws-sdk");
const AWSMock = require("aws-sdk-mock");
// const { describe, it, expect, beforeEach, afterEach,test } = require("jest");

describe('Get Videos', function () {

    beforeEach(() => {
        AWSMock.setSDKInstance(AWS);
    });

    afterEach(() => {
        AWSMock.restore('DynamoDB.DocumentClient')
    });

    test('generate a status 200', (done) => {
        const expectedId = '1';
        const event = buildEvent(expectedId);
        const expectedVideo = {id: expectedId, title: 'irrelevant title'};
        mockInstanceWithValue(expectedVideo);

        getVideo(event,null, (error, response) => {
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(JSON.stringify(expectedVideo));
            done()
        });
    });

    test('get 404 when no video founds', (done) => {
        const event = buildEvent('nonexistent id');
        mockInstanceWithValue(null);
        getVideo(event, null, (error, response) => {
            expect(response.statusCode).toBe(404);
            done()
        })
    });

    test('get 501 when have unknown error', (done) => {
        const event = buildEvent();
        mockInstanceWithError('This is an irrelevant error')
        getVideo(event, null, (error, response) => {
            expect(response.statusCode).toBe(501);
            done()
        })
    });

    test('get custom error status', (done) => {
        const event = buildEvent();
        const expectedStatus = 505;
        mockInstanceWithError({statusCode: expectedStatus})
        getVideo(event, null, (error, response) => {
            expect(response.statusCode).toBe(expectedStatus);
            done()
        })
    });

    const buildEvent = (videoId= 'irrelevant') => ({
        "pathParameters": {
            "id": videoId
        }
    });

    const mockInstanceWithValue = (response) => {
        AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
            callback(null, {Item: response});
        })
    };

    const mockInstanceWithError = (error) => {
        AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
            throw error;
        })
    };

});
