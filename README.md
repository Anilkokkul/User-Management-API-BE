# User Management API Backend Server

This is the backend server for the User Management API. It provides endpoints for user registration, OTP-based login, and user profile management using Node.js, Express, MongoDB, and JWT for authentication.

## Features

- User registration with OTP verification.
- OTP-based login.
- Fetch and update user profiles.

## Prerequisites

- Node.js (v14.x or later)
- MongoDB (local or cloud instance)
- An email service provider for sending OTP emails (e.g., Gmail)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Anilkokkul/User-Management-API-BE
cd user-Management-API-BE
```
### 2. Install Dependencies
```
npm install
```
### 3.Environment Variables
##### Create a .env file in the root directory and add the following environment variables:

```
PORT=5000
MONGO_URL=<your_mongodb_uri>
EMAIL_ID=<your_email_address>
PASS=<your_email_password>
SECRET_KEY=<your_jwt_secret>
```
### 4. Run the application
```
npm start
```
## API Documentation

[Postman API Documentation](https://documenter.getpostman.com/view/28958585/2sA3kUGhMg)

