// use local docker pg
process.env.NODE_ENV = 'docker';

// supertest to our local service instance
const supertest = require("supertest");
const app = require('../app/server');
const request = supertest(app);

const sequelize = require('../app/db/index').sequelize;

const authHeader = {
    authorization: 'some-role'
};

// TEST DATA
const valid = {
    id: '123',
    firstname: 'first',
    lastname: 'last',
    interests: ['hunting'],
    latitude: 38.3,
    longitude: -77.5
}
let idCounter = 1;

describe('Persona Tests', () => {
  
    beforeAll(async () => {
        // Ensure the table exists before all tests
        await sequelize.sync({ force: true }); // Creates tables if they don’t exist

        // Truncate the table before tests start
        await sequelize.truncate({ cascade: true }); // Clears all data
    });
    afterAll(async () => {
        await sequelize.close(); // Close the DB connection
    });

    describe('Create valid Personas', () => {

        test('Create 2 personas', async() => {
            await createValidPersona(valid);
            
            const p2 = {...valid, id: '456', longitude: -77};
            await createValidPersona(p2);
        });
    });

    describe('Create Personas - Invalid Input', () => {

        testInvalidParam('id');
        testInvalidParam('firstname');
        testInvalidParam('lastname');
        testInvalidParam('interests');
        testInvalidParam('latitude');
        testInvalidParam('longitude');

        test('Test invalid authorization', async() => {
            await testInvalidAuthorization(null);
            await testInvalidAuthorization({authorization: ''});
        });

        test('Test duplicate id', async() => {
            return request.post(`/persona`)
            .send(valid)
            .set(authHeader)
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.text).toContain('is not unique')
            });
        });

        test('Test valid / invalid latitude logitude', async() => {
            await testInvalidCoordinates(100, valid.longitude);
            await testInvalidCoordinates(-100, valid.longitude);
            await testInvalidCoordinates(valid.latitude, -200);
            await testInvalidCoordinates(valid.latitude, 200);
            await testValidCoordinates(valid.latitude, valid.longitude);
            await testValidCoordinates(0, 0, 'weather data unavailable');
        });

        test('Test valid / invalid interests', async() => {
            await testInvalidInterests(null);
            await testValidInterests('should we enforce array?');
            await testValidInterests({object: 'value'});
            await testValidInterests(['todo - expand on this more']);
            await testValidInterests([]);
        });
    });

    describe('Get Personas ById', () => {

        test('Test getById Valid', async() => {
            await getById(valid.id, valid);
        });

        test('Test getById Invalid', async() => {
            await getByIdInvalid('invalid-id', 404, 'was not found');
        });
    });
});

async function getById(id, persona){
    return request.get(`/persona/${id}`)
        .set(authHeader)
        .then((res) => {
            expect(res.status).toBe(200);
            // native
            expect(res.body.id).toBe(persona.id);
            expect(res.body.firstname).toBe(persona.firstname);
            expect(res.body.lastname).toBe(persona.lastname);
            expect(res.body.interests).toStrictEqual(persona.interests);
            expect(res.body.longitude).toBe(persona.longitude);
            expect(res.body.latitude).toBe(persona.latitude);
            // amended weather
            expect(res.body.city).toBeTruthy();
            expect(res.body.state).toBeTruthy();
            expect(res.body.current_tempurature).toBeTruthy();
        });
}

async function getByIdInvalid(id, status, message){
    return request.get(`/persona/${id}`)
        .set(authHeader)
        .then((res) => {
            expect(res.status).toBe(status);
            expect(res.text).toContain(message)
        });
}

async function testInvalidInterests(interests){
    const invalid = {...valid, id: idCounter++, interests}
    return request.post(`/persona`)
        .send(invalid)
        .set(authHeader)
        .then((res) => {
            expect(res.status).toBe(400);
            expect(res.text).toContain('Missing required')
        });
}

async function testValidInterests(interests){
    const good = {...valid, id: idCounter++, interests}
    return request.post(`/persona`)
        .send(good)
        .set(authHeader)
        .then((res) => {
            expect(res.status).toBe(201);
        });
}

async function testInvalidCoordinates(lat, lon){
    const invalid = {...valid, latitude: lat, longitude: lon}
    return request.post(`/persona`)
        .send(invalid)
        .set(authHeader)
        .then((res) => {
            expect(res.status).toBe(500); // caught by DB
            expect(res.text).toContain('Validation error')
        });
}

async function testValidCoordinates(lat, lon, optMessage){
    const good = {...valid, id: idCounter++, latitude: lat, longitude: lon}
    return request.post(`/persona`)
        .send(good)
        .set(authHeader)
        .then((res) => {
            expect(res.status).toBe(201);
            if(optMessage){
                expect(res.body.city).toBe(optMessage);
                expect(res.body.state).toBe(optMessage);
            }
        });
}

async function testInvalidAuthorization(auth){
    await request.post(`/persona`)
        .send(valid)
        .set(auth ? auth : {})
        .then((res) => {
            expect(res.status).toBe(403);
            expect(res.body.message.toLowerCase()).toContain('authorization');
        });
}

async function createValidPersona(persona){
    return request.post(`/persona`)
        .send(persona)
        .set(authHeader)
        .then((res) => {
            expect(res.status).toBe(201);
            // native
            expect(res.body.id).toBeTruthy();
            expect(res.body.id).toBe(persona.id);
            expect(res.body.firstname).toBe(persona.firstname);
            expect(res.body.lastname).toBe(persona.lastname);
            expect(res.body.interests).toStrictEqual(persona.interests);
            expect(res.body.longitude).toBe(persona.longitude);
            expect(res.body.latitude).toBe(persona.latitude);
            // amended weather
            expect(res.body.city).toBeTruthy();
            expect(res.body.state).toBeTruthy();
            expect(res.body.current_tempurature).toBeTruthy();

            return res.body;
        });
}

function testInvalidParam(param){
    describe(`Test invalid parameter ${param}.`, () => {

        test(`Test null ${param}`, async() => {
            const invalid = {...valid};
            invalid[param] = null;
            await request.post(`/persona`)
                .send(invalid)
                .set(authHeader)
                .then((res) => {
                    expect(res.status).toBe(400);
                    expect(res.body.message).toBe(`Missing required ${param} parameter.`);
                });
        });

        test(`Test undefined ${param}`, async() => {
            const invalid = {...valid};
            invalid[param] = undefined;
            await request.post(`/persona`)
                .send(invalid)
                .set(authHeader)
                .then((res) => {
                    expect(res.status).toBe(400);
                    expect(res.body.message).toBe(`Missing required ${param} parameter.`);
                });
        });

        test(`Test empty ${param}`, async() => {
            const invalid = {...valid};
            
            const type = Array.isArray(param) ? 'array' : typeof param;
            switch (type) {
            case 'string':
                invalid[param] = '';
                break;
            case 'number':
                invalid[param] = Number.NaN;
                break;
            case 'array':
                invalid[param] = [];
                break;
            default:
                console.log('Unsupported type:', type);
            }

            await request.post(`/persona`)
                .send(invalid)
                .set(authHeader)
                .then((res) => {
                    expect(res.status).toBe(400);
                    expect(res.body.message).toBe(`Missing required ${param} parameter.`);
                });
        });

        test(`Test missing ${param}`, async() => {
            const invalid = {...valid};
            delete invalid[param];
            
            await request.post(`/persona`)
                .send(invalid)
                .set(authHeader)
                .then((res) => {
                    expect(res.status).toBe(400);
                    expect(res.body.message).toBe(`Missing required ${param} parameter.`);
                });
        });
    });
}