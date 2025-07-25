# NestJS To-Do List Application

This project is a complete REST API for a to-do list application, built with the NestJS framework. It serves as a practical demonstration of several core NestJS features, including database integration, authentication, data validation, and automated testing. The application provides a secure, robust backend for managing user-specific to-do lists.

## Core Architecture and Features

The application is structured around NestJS modules, which encapsulate distinct features. The primary functionalities include a full CRUD (Create, Read, Update, Delete) interface for to-do items and a secure user authentication system.

### Database and ORM

Persistence is handled through a SQLite database, with **TypeORM** serving as the Object-Relational Mapper (ORM). This setup allows for a declarative, entity-based approach to database management. The `Todo` and `User` entities define the database schema, and TypeORM repositories are used within the services to abstract away raw database queries, providing a clean, type-safe API for data manipulation.

### Authentication and Security

User authentication is implemented using a JSON Web Token (JWT) strategy, integrated via the **Passport.js** library. The `/auth/register` endpoint allows new users to create an account, with passwords being securely hashed using `bcrypt` before storage. The `/auth/login` endpoint validates user credentials and, upon success, issues a signed JWT. All endpoints for managing to-do items are protected, requiring a valid JWT to be passed in the `Authorization` header, ensuring that users can only access their own data.

The authentication flow relies on two distinct Passport strategies:
-   **LocalStrategy**: This strategy is used exclusively for the `/auth/login` endpoint. It validates the incoming `username` and `password` against the stored, hashed password in the database. Its sole purpose is to verify a user's identity at the point of login.
-   **JwtStrategy**: Once a user is logged in, this strategy takes over. It is applied to all protected routes and works by extracting and validating the JWT from the `Authorization` header of each request. It ensures that the user has already been authenticated and grants access to the requested resources.

### Data Validation

To ensure the integrity of incoming data, the application leverages Data Transfer Objects (DTOs) in combination with the `class-validator` library. The built-in `ValidationPipe` is applied to controller routes that handle data creation and updates. This pipe automatically validates incoming request bodies against the defined DTO rules, rejecting any invalid requests with a descriptive `400 Bad Request` response before they can reach the business logic.

### Unit Testing with Jest

The project includes unit tests for the `TodoService`, demonstrating a standard approach to testing in a NestJS application. **Jest** is used as the testing framework. The tests showcase how to create a testing module and how to mock dependencies, such as the `TodoRepository`. This isolates the service's logic, allowing it to be tested reliably without requiring a live database connection.

## API Endpoints

-   `POST /auth/register`: Creates a new user.
-   `POST /auth/login`: Authenticates a user and returns a JWT.
-   `GET /todo`: Retrieves all to-do items for the authenticated user.
-   `POST /todo`: Creates a new to-do item for the authenticated user.
-   `GET /todo/:id`: Retrieves a specific to-do item.
-   `PATCH /todo/:id`: Updates a specific to-do item.
-   `DELETE /todo/:id`: Deletes a specific to-do item.

## Testing with Curl

Once the application is running, you can use the following `curl` commands to test the API.

### 1. Register a New User
```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{"username": "testuser", "password": "password123"}'
```

### 2. Log In and Get a Token
```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "testuser", "password": "password123"}'
```

### 3. Create a To-Do Item
```bash
curl -X POST http://localhost:3000/todo \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
-d '{"title": "Learn NestJS", "description": "Complete the authentication section."}'
```

### 4. Get All To-Do Items
```bash
curl -X GET http://localhost:3000/todo \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Get a Specific To-Do Item
```bash
curl -X GET http://localhost:3000/todo/1 \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Update a To-Do Item
```bash
curl -X PATCH http://localhost:3000/todo/1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
-d '{"completed": true}'
```

### 7. Delete a To-Do Item
```bash
curl -X DELETE http://localhost:3000/todo/1 \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## The entire process

The development of this application followed a structured, incremental process:

1.  **Scaffolding and Core Feature**: The project was initiated using the NestJS CLI, and a `todo` resource was generated to create the foundation for CRUD operations.

2.  **Database and Validation**: A SQLite database was integrated using TypeORM, and entities were defined. Data integrity was enforced through the implementation of DTOs and the `ValidationPipe`.

3.  **Authentication and Security**: A complete authentication layer was built using Passport.js, featuring JWTs for securing endpoints and `bcrypt` for password hashing.

4.  **Testing**: Unit tests were written for the application's services using Jest, with a focus on mocking dependencies to ensure isolated and reliable tests.