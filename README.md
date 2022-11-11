# NodeJS API using TypeScript

**Introduction**: This is my first NodeJS API with TypeScript. Thanks to `Rettson` for his tutorial video on using the NodeJS API with TypeScript, which majorly
guided me to accomplish this.

**Description**: With this API, you can register as a user and make a post. Below are routes in this API.

## Routes
**Register**:
POST http://localhost:3000/api/users/register
Content-Type: application/json

{
    "username": "testUser",
    "name": "Test User",
    "email": "test@user.api",
    "password": "testing12"
}

**Login with username**
POST http://localhost:3000/api/users/loginWithUsername
Content-Type: application/json

{
    "username": "testUser",
    "password": "testing12"
}

**Login with Email**
POST http://localhost:3000/api/users/loginWithEmail
Content-Type: application/json

{
    "email": "test@user.api",
    "password": "testing12"
}

**Get all users**
GET http://localhost:3000/api/users
Content-Type: application/json
Authorization: Bearer accessToken(from response of register or login)

**Get a user details**
GET http://localhost:3000/api/users/:id
Content-Type: application/json
Authorization: Bearer accessToken(from response of register or login)

**Create a post**
POST  http://localhost:3000/api/posts
Content-Type: application/json
Authorization: Bearer accessToken(from response of register or login)
{
    "title": "Testing Post",
    "body": "This is a testing post"
}

**Get all posts**
GET   http://localhost:3000/api/posts
Content-Type: application/json
Authorization: Bearer accessToken(from response of register or login)

**Get a post**
GET   http://localhost:3000/api/post/:id
Content-Type: application/json
Authorization: Bearer accessToken(from response of register or login)

## Technologies
**NodeJS TypeScript Express MongoDB

*Updates coming soon*: 
1. Live URL 
2. Delete and edit post(by user that created it) 
3. Verify email 
4. Reset password 
5. Logout
6. Sorting, limit and pagination(for get all users and get all posts)


