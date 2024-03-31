# Todo Application
Live Application Link: [Todo Application](https://wd401-main.onrender.com)

## Project Overview

This repository contains the implementation details for the Tasks Manager project, a task management application built on Node.js and Express.js. The goal of this project is to provide users with a smarter and intuitive task management experience. The key features of the application include user authentication, task creation with due dates, dynamic categorization of tasks, task completion, and deletion. Additionally, several advanced features have been implemented to enhance the application's robustness, including error logging, internationalization, containerization, CI/CD pipeline, testing strategies, and more.

## High-level Features

### 1. User Authentication

- Users can sign up for a new account.
- Existing users can log in and securely sign out.

-![alt text](<Screenshot 2024-03-31 173038.png>)

 ![alt text](<Screenshot 2024-03-31 173737.png>)

 ![alt text](<Screenshot 2024-03-31 173302.png>)

### 2. Task Management

- Users can add a task by providing a name and due date.
- Tasks are automatically categorized into "Overdue," "Due Today," and "Due Later" based on the provided due date.
- ![alt text](<Screenshot 2024-03-31 174254.png>)

### 3. Task Completion

- Users can mark a task as complete by checking the completion box.

### 4. Task Deletion

- Users can delete a task by clicking on the delete icon.

- ![alt text](<Screenshot 2024-03-31 173245.png>)

### 5. Testing Strategies

- Unit and integration tests have been incorporated into the project.
- Coverage reports have been generated to assess the effectiveness of the tests.
- GitHub Actions have been set up to automate testing processes.
  
- <img width="960" alt="Screenshot 2024-02-21 123004" src="https://github.com/Prathibha-yadav/To-Do-App/assets/126705101/95a12dfe-e147-4dc9-b4a2-8b32d473adb3">


### 6. CI/CD Pipeline

- A CI/CD pipeline has been established to automate the deployment process.
- This ensures seamless integration of code changes and swift error detection.

### 7. Application Environments

- The application has been deployed in cluster mode using PM2 for enhanced performance and scalability.
- Environment variable configurations have been implemented for both development and production environments.
- Security measures have been applied to safeguard the application.

### 8. Containerization

- The application has been containerized using Docker for efficient deployment and management.
- Environment variables have been configured within the containers for flexibility and security.
- A Docker Compose file has been defined for managing multiple services, including a database service.
- A CI/CD pipeline has been set up to deploy the Dockerized application on a server.

### 9. Internationalization & Localization

- Internationalization and localization have been implemented to cater to diverse user preferences and geographical locations.
- <img width="338" alt="image" src="https://github.com/Prathibha-yadav/To-Do-App/assets/126705101/a28805aa-7e85-4864-adb6-9c1c8a46242c">



### 10. Error Logging & Debugging

- Error logging and debugging practices have been followed, utilizing Sentry for efficient bug detection and resolution.
- <img width="960" alt="Screenshot 2024-03-19 222207" src="https://github.com/Prathibha-yadav/To-Do-App/assets/126705101/00feb4f3-caad-42b6-b7af-c6142e4ad7e4">

<img width="960" alt="Screenshot 2024-03-17 131518" src="https://github.com/Prathibha-yadav/To-Do-App/assets/126705101/2e32f7c2-fc8f-4db0-a184-ca55f00d0fc9">

## Notifications

Slack notifications have been configured to provide updates about the status of the CI/CD pipeline.

This README provides an overview of the project and its various features. For detailed implementation and technical documentation, refer to the codebase and relevant files within the repository.
<img width="414" alt="Screenshot 2024-03-06 213659" src="https://github.com/Prathibha-yadav/To-Do-App/assets/126705101/45a884e2-8451-4265-836a-4476c3c46a49">

<img width="960" alt="Screenshot 2024-03-21 183945" src="https://github.com/Prathibha-yadav/To-Do-App/assets/126705101/b146ac82-ed1e-4c74-a441-d5cf2deb9986">

## Getting Started

To set up the project locally, follow these steps:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up the PostgreSQL database and configure the connection in the application.
4. Run the application with `npm start`.
