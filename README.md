                          <!-- User Management System -->
A RESTful API for managing users, posts, and addresses, built with Express, TypeScript, Knex, and SQLite. This project provides a scalable backend with pagination, validation, and comprehensive testing.

                                <!-- Overview -->
This API enables CRUD operations for users, posts, and addresses, with features like paginated user listings and custom error handling. It’s designed for ease of setup and testing, using SQLite for lightweight database management.


                                   <!-- Features -->
Users: Create, read (with pagination), and count users, including associated addresses.
Posts: Manage user-specific posts with basic CRUD operations.
Addresses: Handle user addresses with create, read, and update capabilities.
Pagination: Efficiently retrieve user lists with configurable page sizes.
Validation: Ensure data integrity with middleware checks.
Testing: Extensive unit tests using Jest and Supertest.


                                <!-- Prerequisites -->
Before you begin, ensure you have the following installed:
Node.js: v14.x or higher (v18.x recommended) - Download
npm: v8.x or higher (included with Node.js)
SQLite: No separate installation needed (uses sqlite3 npm package)


<!-- Setup Instructions -->
1. Clone the Repository
Get the source code from your version control system:

git clone https://github.com/yourusername/user-management-system.git
cd user-management-system
2. Install Dependencies
Install the required Node.js packages:
npm install
This command installs:

<!-- Production Dependencies:  -->
express, knex, sqlite3, dotenv
Development Dependencies: typescript, ts-node, jest, @types/jest, supertest


3. Configure Environment Variables
Create a .env file in the root directory to customize settings (optional):
PORT=3000
NODE_ENV=development
PORT: Specifies the server port (default: 3000).
NODE_ENV: Sets the environment (development for local, test for testing).
If you skip this step, the app uses default values.

4. Initialize the Database
The project uses SQLite with the database file located at src/db/dev.sqlite3. Knex manages migrations from src/knexfile.ts.

<!-- Run the migrations to set up the database: -->

npm run migrate:latest
This creates the users, posts, and addresses tables in src/db/dev.sqlite3.

Verify: Check the tables:
sqlite3 src/db/dev.sqlite3 ".tables" or Db Browser
Expected output: addresses posts users knex_migrations

5. Run the Project Locally
Launch the server in development mode:
npm run dev
The server starts at http://localhost:3000 .
Test endpoints using a tool like Postman:
example; http://localhost:3000/users?pageNumber=0&pageSize=10

6. Run Unit Tests
Execute the test suite to verify functionality:
npm test
Tests are located in test/ (users.test.ts, posts.test.ts, addresses.test.ts).
Runs with NODE_ENV=test and sequentially to avoid SQLite conflicts.
Stop any running server first:

user-management-system/
├── src/
│   ├── controllers/      # API logic (e.g., user.controller.ts)
│   ├── db/              # Database files (knex.ts, migrations/)
│   ├── routes/          # Route definitions (e.g., userRoutes.ts)
│   ├── utils/           # Utilities (e.g., errorHandler.ts)
│   ├── knexfile.ts      # Knex configuration
│   ├── server.ts        # Express app factory
│   ├── index.ts         # Server startup
├── test/                # Unit tests (*.test.ts)
├── .env                 # Environment variables (optional)
├── package.json         # Project metadata and scripts
├── tsconfig.json        # TypeScript settings
└── README.md            # Project documentation



<!-- Available Scripts -->
<!-- Script	Description -->
npm run dev	                Runs the server in development mode with ts-node.
npm start	                Runs the compiled server (post-build).
npm run build	            Compiles TypeScript to dist/.
npm test	                Runs Jest tests sequentially.
npm run migrate:latest	    Applies Knex migrations from src/knexfile.ts.
npm run migrate:rollback	Rolls back the last migration batch.

API Endpoints
<!-- Users -->
GET /users?pageNumber={n}&pageSize={m}
Description: Retrieves a paginated list of users.

Query Params: pageNumber (default: 0), pageSize (default: 10).
Response: 200 OK with JSON array of users.

GET /users/count
Description: Returns the total number of users.
Response: 200 OK with { total: number }.

GET /users/:id
Description: Fetches a user by ID with their address.
Response: 200 OK with user object or 404 Not Found.

POST /users/:id
Description: Creates a new user (ignores :id, uses auto-increment).
Body: { name: string, email: string, password: string }.
Response: 201 Created with { id: number, message: string }.

Posts
GET /posts?userId={userId}
Description: Lists posts for a specific user.
Query Params: userId (required).
Response: 200 OK with array of posts or 400 Bad Request.

POST /posts
Description: Creates a post.
Body: { user_id: number, title: string, body: string }.
Response: 201 Created with { id: number, message: string }.

DELETE /posts/:id
Description: Deletes a post by ID.
Response: 204 No Content or 404 Not Found.
Addresses

GET /addresses/:userID
Description: Retrieves an address by user ID.
Response: 200 OK with address object or 404 Not Found.

POST /addresses
Description: Creates an address.
Body: { user_id: number, street: string, city: string, state: string, zip: string }.
Response: 201 Created with { message: string }.

PATCH /addresses/:userID
Description: Updates an address.
Body: Same as POST.
Response: 200 OK with { message: string }

<!-- Troubleshooting -->

Database Locked:
Reset the database:
del src\db\dev.sqlite3 && npm run migrate:latest


Test Failures:
Debug with:
npm test -- --detectOpenHandles