# Task Management API

## 🚀 Project Overview

This project is a task management API built using modern technologies to provide high performance and scalability:

- **Cloudflare Workers**
- **Hono.js**
- **TypeScript**
- **Prisma ORM**
- **Prisma Accelerate**
- **PostgreSQL**
- **JWT Authentication**

The combination of Cloudflare Workers and Prisma Accelerate offers significant benefits including global distribution, reduced latency, automatic scaling, and optimized database connections.

## ⚡ Why this stack?
- **Cloudflare Workers** ensure lightning-fast performance and global availability.
- **Hono.js** provides an ultra-lightweight, Express-like developer experience.
- **Prisma Accelerate** optimizes database queries with edge caching and enhanced connection handling.

## 🛠️ Local Setup

### 📋 Prerequisites

- Node.js (v16 or newer)
- PostgreSQL database
- Cloudflare account
- Prisma Accelerate account

### 📝 Setup Instructions

1. Clone the repository and navigate to the backend directory:
   ```bash
   git clone https://github.com/CallMeSahu/app-task-management.git
   cd app-task-management/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup your PostgreSQL connection and Prisma Accelerate:
   - Have your PostgreSQL connection URL ready
   - Login to [Prisma Accelerate](https://www.prisma.io/data-platform/accelerate)
   - Enable Prisma Accelerate for your PostgreSQL database
   - Save the provided Prisma Accelerate proxy URL

4. Create a `.env` file:
   ```bash
   touch .env
   ```

5. Add the following content to `.env`:
   ```
   DATABASE_URL="your_postgres_url"
   ```

6. Create a `wrangler.toml` file:
   ```bash
   touch wrangler.toml
   ```

7. Add the following content to `wrangler.toml`:
   ```toml
   name = "app-task-management"
   compatibility_date = "2025-04-08"
   main = "src/index.ts"

   [vars]
   DATABASE_URL="your_prisma_accelerate_proxy_url"
   JWT_SECRET="your_jwt_secret"
   ```

8. Migrate your database:
   ```bash
   npx prisma migrate dev --name init_schema
   ```

9. Generate Prisma client:
   ```bash
   npx prisma generate --no-engine
   ```

10. Run the application locally:
    ```bash
    npx wrangler dev
    ```

## 🔌 API Endpoints

## 🌐 Base URL

The API is deployed on Cloudflare Workers and accessible using the following link:

[Production API URL](https://app-task-management.siddharthasahu-work.workers.dev)

`https://app-task-management.siddharthasahu-work.workers.dev`

### 🔒 Authentication

All endpoints except for registration and login require JWT authentication. Include the JWT token in the Authorization Header:

```
Authorization: Bearer <your_jwt_token>
```

### 👤 User Endpoints

#### 📝 Register a new user

- **URL**: `/api/v1/user/signup`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "Test Admin",
    "email": "test@test.com",
    "password": "Test@123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_here"
  }
  ```

#### 🔑 User Login

- **URL**: `/api/v1/user/signin`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "test@test.com",
    "password": "Test@123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_here"
  }
  ```

### ✅ Task Endpoints

#### ➕ Create Task

- **URL**: `/api/v1/task`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "title": "Complete project documentation",
    "description": "Write comprehensive README.md file",
    "status": "PENDING"
  }
  ```
- **Response**:
  ```json
  {
    "task": {
        "id": "86abf0af-a628-4aa1-8c97-8a6923b52513",
        "title": "Complete project documentation",
        "description": "Write comprehensive README.md file",
        "status": "PENDING",
        "userId": "379db18a-9efc-465d-aa2e-58bbc52ae587"
    }
  }
  ```

#### 📋 Get All Tasks

- **URL**: `/api/v1/task`
- **Method**: `GET`
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "tasks": [
        {
            "id": "86abf0af-a628-4aa1-8c97-8a6923b52513",
            "title": "Complete project documentation",
            "description": "Write comprehensive README.md file",
            "status": "PENDING",
            "userId": "379db18a-9efc-465d-aa2e-58bbc52ae587"
        },
        {
            "id": "ca7aea8f-ceab-4201-a457-d5cf38d30091",
            "title": "Deploy application",
            "description": "Deploy the app to production environment",
            "status": "PENDING",
            "userId": "379db18a-9efc-465d-aa2e-58bbc52ae587"
        },
        {
            "id": "8471bbfa-41fc-414e-a0c8-7d644a5722ad",
            "title": "Fix API bugs",
            "description": "Address error handling in authentication endpoints",
            "status": "COMPLETED",
            "userId": "379db18a-9efc-465d-aa2e-58bbc52ae587"
        }
    ]
  }
  ```

#### 🔄 Update Task

- **URL**: `/api/v1/task/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "title": "Deploy application",
    "status": "COMPLETED"
  }
  ```
- **Response**:
  ```json
  {
    "task": {
        "id": "ca7aea8f-ceab-4201-a457-d5cf38d30091",
        "title": "Deploy the application",
        "description": "Deploy the app to production environment",
        "status": "COMPLETED",
        "userId": "379db18a-9efc-465d-aa2e-58bbc52ae587"
    }
  }
  ```

#### 🗑️ Delete Task

- **URL**: `/api/v1/task/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

## 📦 Postman Collection

You can access and import the Postman collection for testing this API using the following link:

[Task Management API Postman Collection](https://www.postman.com/galactic-station-100135/workspace/app-task-management)

## 🚀 Deployment

The API is deployed on Cloudflare Workers, which provides edge computing capabilities for low-latency globally distributed access.

### 📝 Deployment Steps

1. Authenticate with Cloudflare:
   ```bash
   npx wrangler login
   ```

2. Deploy the application:
   ```bash
   npx wrangler deploy
   ```

3. Your API will be available at the URL displayed on the dashboard after successful deployment.

### 🔐 Environment Variables for Production

Ensure the following environment variables are set in your Cloudflare Workers environment:

- `DATABASE_URL`: Your Prisma Accelerate URL
- `JWT_SECRET`: Secret key for JWT token generation and validation

## 📖 Additional Resources

- [Hono.js Documentation](https://hono.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Prisma Accelerate Documentation](https://www.prisma.io/data-platform/accelerate)