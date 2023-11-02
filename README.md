# NodeJS API using TypeScript

**Introduction**: This is my first NodeJS API with TypeScript. Thanks to `Rettson` for his tutorial video on using the NodeJS API with TypeScript, which majorly
guided me to accomplish this. [Click here](https://documenter.getpostman.com/view/29759830/2s9YXbB6i7) for the detailed API documentation on Postman.

**Description**: With this API, you can register as a user and make a post. Below are the routes in this API.

## Base URL

**Local**: `Base_URL` = `http://localhost:3000/api`  
**Live**: `Base_URL` = `https://my-nodejs-typescript.onrender.com/api`

## Routes

**Register**:

```http
POST /users/register
Host: Base_URL
Content-type: application/json
```

-   Request body:

```json
{
    "username": "testUser",
    "name": "Test User",
    "email": "test@user.api",
    "password": "testing12"
}
```

**Verify Email**:

```http
PATCH /users/verify_email/:token
Host: Base_URL

Content-Type: application/json
```

**Login with username**:

```http
POST /users/login_with_username
Host: Base_URL
Content-Type: application/json
```

-   Request body:

```json
{
    "username": "testUser",
    "password": "testing12"
}
```

**Login with Email**:

```http
POST /users/login_with_email
Host: Base_URL
Content-Type: application/json
```

-   Request body:

```json
{
    "email": "test@user.api",
    "password": "testing12"
}
```

**Forgot password**:

```http
PATCH /users/forgot_password
Host: Base_URL
Content-Type: application/json
```

-   Request body:

```json
{
    "email": "test@user.api"
}
```

**Reset password**:

```http
PATCH /users/reset_password/:token
Host: Base_URL
Content-Type: application/json
```

-   Request body:

```json
{
    "password": "testing12"
}
```

**Get all users**:

```http
GET /users
Host: Base_URL
Accept: application/json
Authorization: Bearer accessToken(from response of register or login)
```

**Get a user details**:

```http
GET /users/:id
Host: Base_URL
Content-Type: application/json
Authorization: Bearer accessToken(from response of register or login)
```

**Edit user details**:

```http
PATCH /users/:id
Host: Base_URL
Content-Type: application/json
Authorization: Bearer accessToken(from response of register or login)
```

-   Request body:

```json
{
    "username": "editUser",
    "name": "Edit User"
}
```

**Create a post**:

```http
POST /posts
Host: Base_URL
Content-Type: application/json
Authorization: Bearer accessToken(from response of register or login)
```

-   Request body:

```json
{
    "title": "Testing Post",
    "body": "This is a testing post"
}
```

**Get all posts**:

```http
GET /posts
Host: Base_URL
Content-Type: application/json
Authorization: Bearer accessToken(from response of register or login)
```

**Get a post**:

```http
GET /posts/:id
Host: Base_URL
Content-Type: application/json
Authorization: Bearer accessToken(from response of register or login)
```

**Delete a post**:

```http
DELETE /posts/:id
Host: Base_URL
Content-Type: application/json
Authorization: Bearer accessToken(from response of register or login)
```

**Edit a post**:

```http
PATCH /posts/:id
Host: Base_URL
Content-Type: application/json
Authorization: Bearer accessToken(from response of register or login)
```

-   Request body:

```json
{
    "title": "Editing Post",
    "body": "This is editing post"
}
```

## Technologies

**NodeJS TypeScript Express MongoDB**

_Updates coming soon_:

1. ~~Live URL~~
2. ~~Edit user details~~
3. ~~Delete and edit post(by user that created it)~~
4. ~~Verify email~~
5. ~~Reset password~~
6. Logout
7. Sorting, limit and pagination(for get all users and get all posts)
