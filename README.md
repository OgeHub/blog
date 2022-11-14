# NodeJS API using TypeScript

**Introduction**: This is my first NodeJS API with TypeScript. Thanks to `Rettson` for his tutorial video on using the NodeJS API with TypeScript, which majorly
guided me to accomplish this.

**Description**: With this API, you can register as a user and make a post. Below are routes in this API.

## Base URL

**Local**: `Base_URL` = `http://localhost:3000/api`  
**Live**: `Base_URL` = `https://my-nodejs-typescript.onrender.com/api`

## Routes

**Register**:  
POST `Base_URL`/users/register  
Content-Type: application/json  
req.body:  
{
"username": "testUser",
"name": "Test User",
"email": "test@user.api",
"password": "testing12"
}

**Login with username**:  
POST `Base_URL`/users/loginWithUsername  
Content-Type: application/json  
req.body:  
{
"username": "testUser",
"password": "testing12"
}

**Login with Email**:  
POST `Base_URL`/users/loginWithEmail  
Content-Type: application/json  
req.body:  
{
"email": "test@user.api",
"password": "testing12"
}

**Get all users**:  
GET `Base_URL`/users  
Content-Type: application/json  
Authorization: Bearer accessToken(from response of register or login)

**Get a user details**:  
GET `Base_URL`/users/:id  
Content-Type: application/json  
Authorization: Bearer accessToken(from response of register or login)

**Edit user details**:  
PATCH `Base_URL`/users/:id  
Content-Type: application/json  
Authorization: Bearer accessToken(from response of register or login)  
req.body:  
{
"username": "editUser",
"name": "Edit User"
}

**Create a post**:  
POST `Base_URL`/posts  
Content-Type: application/json  
Authorization: Bearer accessToken(from response of register or login)  
req.body:  
{
"title": "Testing Post",
"body": "This is a testing post"
}

**Get all posts**:  
GET `Base_URL`/posts  
Content-Type: application/json  
Authorization: Bearer accessToken(from response of register or login)

**Get a post**:  
GET `Base_URL`/posts/:id  
Content-Type: application/json  
Authorization: Bearer accessToken(from response of register or login)

**Delete a post**:  
DELETE `Base_URL`/posts/:id  
Content-Type: application/json  
Authorization: Bearer accessToken(from response of register or login)

**Edit a post**:  
PATCH `Base_URL`/posts/:id  
Content-Type: application/json  
Authorization: Bearer accessToken(from response of register or login)  
req.body:  
{
"title": "Editing Post",
"body": "This is editing post"
}

## Technologies

**NodeJS TypeScript Express MongoDB**

_Updates coming soon_:

1. ~~Live URL~~
2. ~~Edit user details~~
3. ~~Delete and edit post(by user that created it)~~
4. Verify email
5. Reset password
6. Logout
7. Sorting, limit and pagination(for get all users and get all posts)
