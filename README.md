# Angular Auth0 & JSONPlaceholder CRUD Application

This project is a simple Angular-based application that demonstrates user authentication using the **Auth0** API and basic CRUD operations using **JSONPlaceholder**. It allows users to register, log in, and manage posts securely. The project highlights the integration of Auth0 for authentication, alongside consuming a public API to perform typical Create, Read, Update, and Delete operations.

## Features
- 🌐 **User Authentication**: Secure login and registration via Auth0.
- 🖥️ **Universal Login**: Implements Auth0's Universal Login for easy and secure authentication.
- 📱 **CRUD Operations**: Manage posts (Create, Read, Update, Delete) through the **JSONPlaceholder** API.
- 🔐 **Profile Management**: Easy logout and profile management features.

## Prerequisites

Before running this application, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/)
- [Angular CLI](https://angular.io/cli)

## Getting Started

Follow these instructions to set up and run the application on your local machine.


1. **Clone the Repository**
   ```bash
   git clone https://github.com/Muia23/smart-posts.git

2. **Navigate to the Project Directory**
    ```bash
   cd smart-json

3. **Install Dependencies**
    ```bash
   npm install

4. **Run the Application**
    ```bash
   ng serve

5. **Open in Your Browser**
   http://localhost:4200

## Configuration
Before running the application, configure the Auth0 client ID and domain:

1. Create an Auth0 account and set up a new application.
2. Add your Auth0 configuration in src/auth/auth.config.ts   

## License
This project is licensed under the MIT License - see the LICENSE file for details.

Developed with 💻 and ☕ by **Muia23**