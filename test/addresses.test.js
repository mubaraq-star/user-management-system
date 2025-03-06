"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../src/server"));
const knex_1 = __importDefault(require("../src/db/knex"));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Destroying DB connection...');
    yield knex_1.default.destroy();
    yield new Promise(resolve => setTimeout(resolve, 100));
}));
describe('Addresses API', () => {
    const cleanupTestAddress = (userId, street) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, knex_1.default)('addresses').where({ user_id: userId, street }).delete();
    });
    const cleanupTestUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, knex_1.default)('users').where({ email }).first();
        if (user) {
            yield (0, knex_1.default)('addresses').where({ user_id: user.id }).delete();
            yield (0, knex_1.default)('users').where({ id: user.id }).delete();
        }
    });
    let testUserId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const testEmail = `addresstest_${Date.now()}@example.com`;
        yield cleanupTestUser(testEmail);
        [testUserId] = yield (0, knex_1.default)('users').insert({
            name: 'addressuser',
            email: testEmail,
            password: `addrpass_${Date.now()}`,
            created_at: new Date().toISOString()
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield cleanupTestUser(`addresstest_${testUserId}@example.com`);
    }));
    describe('POST /addresses', () => {
        it('should create an address', () => __awaiter(void 0, void 0, void 0, function* () {
            const testStreet = `123 St ${Date.now()}`;
            yield cleanupTestAddress(testUserId, testStreet);
            const res = yield (0, supertest_1.default)(server_1.default)
                .post('/addresses')
                .send({
                user_id: testUserId,
                street: testStreet,
                city: 'City',
                state: 'TS',
                zip_code: '12345'
            });
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('message', 'Address created successfully');
            yield cleanupTestAddress(testUserId, testStreet);
        }));
    });
    describe('GET /addresses/:userID', () => {
        it('should return an address', () => __awaiter(void 0, void 0, void 0, function* () {
            const testStreet = `123 St ${Date.now()}`;
            yield cleanupTestAddress(testUserId, testStreet);
            yield (0, knex_1.default)('addresses').insert({
                user_id: testUserId,
                street: testStreet,
                city: 'City',
                state: 'TS',
                zip_code: '12345'
            });
            const res = yield (0, supertest_1.default)(server_1.default).get(`/addresses/${testUserId}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('street', testStreet);
            yield cleanupTestAddress(testUserId, testStreet);
        }));
        it('should return 404 for non-existent address', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonExistentUserId = 9999;
            yield (0, knex_1.default)('addresses').where({ user_id: nonExistentUserId }).delete();
            const res = yield (0, supertest_1.default)(server_1.default).get(`/addresses/${nonExistentUserId}`);
            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                status: 'error',
                message: 'Address not found',
                timestamp: expect.any(String),
                path: `/addresses/${nonExistentUserId}`
            });
        }));
    });
    describe('PATCH /addresses/:userID', () => {
        it('should update an address', () => __awaiter(void 0, void 0, void 0, function* () {
            const testStreet = `123 St ${Date.now()}`;
            const newStreet = `456 New St ${Date.now()}`;
            yield cleanupTestAddress(testUserId, testStreet);
            yield (0, knex_1.default)('addresses').insert({
                user_id: testUserId,
                street: testStreet,
                city: 'City',
                state: 'TS',
                zip: '12345'
            });
            const res = yield (0, supertest_1.default)(server_1.default)
                .patch(`/addresses/${testUserId}`)
                .send({
                user_id: testUserId, // Include required field
                street: newStreet,
                city: 'City',
                state: 'TS', // Include required field
                zip: '12345'
            });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Address updated successfully');
            yield cleanupTestAddress(testUserId, newStreet);
        }));
    });
});
