// use local docker pg
process.env.NODE_ENV = 'test';

// supertest to our local service instance
const supertest = require("supertest");
const app = require('../app/server');
const request = supertest(app);

const authHeader = {
    authorization: 'some-role'
};

describe('Persona Tests.', () => {
    afterAll(() => {
        app.closeServer();
    });

    test('TODO, invalid input, unauthorized, dup id, bad connection, invalid coordinates, etc.', async() => {
        // todo
    });

    test('TODO, Create.', async() => {
        // todo
    });

    test('TODO, getById.', async() => {
        // todo
    });

});