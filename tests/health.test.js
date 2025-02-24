// use local docker pg
process.env.NODE_ENV = 'test';

// supertest to our local service instance
const supertest = require("supertest");
const app = require('../app/server');
const request = supertest(app);


const authHeader = {
    authorization: 'jwt with roles'
};

describe('Test health.', () => {

    test('/GET health.', async() => {

        await request.get('/health')
            .set(authHeader)
            .then((res) => {
                expect(res.status).toBe(200);
                expect(Object.keys(res.body).length).toBeGreaterThan(0);
            });
    });
});