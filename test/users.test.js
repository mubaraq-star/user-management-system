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
    yield knex_1.default.destroy(); // Cleanly close connection
    yield new Promise(resolve => setTimeout(resolve, 100));
}));
describe('Users API', () => {
    // Helper function to clean up test data by email
    const cleanupTestUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, knex_1.default)('users').where({ email }).first();
        if (user) {
            yield (0, knex_1.default)('addresses').where({ user_id: user.id }).delete();
            yield (0, knex_1.default)('users').where({ id: user.id }).delete();
        }
    });
    describe('GET /users', () => {
        it('should return a list of users with pagination', () => __awaiter(void 0, void 0, void 0, function* () {
            const testEmail1 = `test1_${Date.now()}@example.com`;
            const testEmail2 = `test2_${Date.now()}@example.com`;
            yield cleanupTestUser(testEmail1);
            yield cleanupTestUser(testEmail2);
            yield (0, knex_1.default)('users').insert([
                { name: 'user1', email: testEmail1, password: `pass1_${Date.now()}`, created_at: new Date().toISOString() },
                { name: 'user2', email: testEmail2, password: `pass2_${Date.now()}`, created_at: new Date().toISOString() }
            ]);
            const res = yield (0, supertest_1.default)(server_1.default)
                .get('/users')
                .query({ pageNumber: 0, pageSize: 10 });
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
            yield cleanupTestUser(testEmail1);
            yield cleanupTestUser(testEmail2);
        }));
    });
    describe('GET /users/count', () => {
        it('should return the total count of users', () => __awaiter(void 0, void 0, void 0, function* () {
            const testEmail = `testcount_${Date.now()}@example.com`;
            yield cleanupTestUser(testEmail);
            yield (0, knex_1.default)('users').insert({
                name: 'testuser',
                email: testEmail,
                password: `passwordcount_${Date.now()}`, // Unique password
                created_at: new Date().toISOString()
            });
            const res = yield (0, supertest_1.default)(server_1.default).get('/users/count');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('total');
            expect(typeof res.body.total).toBe('number');
            yield cleanupTestUser(testEmail);
        }));
    });
    describe('POST /users/:id', () => {
        it('should create a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const testEmail = `test_${Date.now()}@example.com`;
            yield cleanupTestUser(testEmail);
            const uniquePassword = `password_${Date.now()}`;
            const res = yield (0, supertest_1.default)(server_1.default)
                .post('/users/999') // :id ignored by controller
                .send({
                name: 'testuser',
                email: testEmail,
                password: uniquePassword
            });
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('message', 'User created successfully');
            expect(res.body).toHaveProperty('id');
            yield cleanupTestUser(testEmail);
        }));
    });
    describe('GET /users/:id', () => {
        it('should return a user with address', () => __awaiter(void 0, void 0, void 0, function* () {
            const testEmail = `test2_${Date.now()}@example.com`;
            yield cleanupTestUser(testEmail);
            const uniquePassword = `password_${Date.now()}`;
            const [userId] = yield (0, knex_1.default)('users').insert({
                name: 'testuser',
                email: testEmail,
                password: uniquePassword,
                created_at: new Date().toISOString()
            });
            yield (0, knex_1.default)('addresses').insert({
                user_id: userId,
                street: '123 St',
                city: 'City',
                state: 'TS',
                zip: '12345'
            });
            const res = yield (0, supertest_1.default)(server_1.default).get(`/users/${userId}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'testuser');
            expect(res.body.address).toHaveProperty('street', '123 St');
            yield cleanupTestUser(testEmail);
        }));
        it('should return 404 for non-existent user', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonExistentId = 9999;
            yield (0, knex_1.default)('users').where({ id: nonExistentId }).delete();
            const res = yield (0, supertest_1.default)(server_1.default).get(`/users/${nonExistentId}`);
            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                status: 'error',
                message: 'User not found',
                timestamp: expect.any(String),
                path: `/users/${nonExistentId}`
            });
        }));
    });
});
