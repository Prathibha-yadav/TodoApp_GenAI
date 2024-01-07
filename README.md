# Todo Application
Live Application Link: [Todo Application](https://prathibha-wd201-render.onrender.com)

## Project Overview

This repository contains the implementation details for the Tasks Manager project, a task management application built on Node.js and Express.js. The goal of this project is to provide users with a smarter and intuitive task management experience. The key features of the application include user authentication, task creation with due dates, dynamic categorization of tasks, task completion, and deletion.

## High-level Features

### 1. User Authentication

- Users can sign up for a new account.
- Existing users can log in and securely sign out.

### 2. Task Management

- Users can add a task by providing a name and due date.
- Tasks are automatically categorized into "Overdue," "Due Today," and "Due Later" based on the provided due date.

### 3. Task Completion

- Users can mark a task as complete by checking the completion box.

### 4. Task Deletion

- Users can delete a task by clicking on the delete icon.

## User Interface Requirements

To enhance user experience, specific requirements for the user interface have been outlined for each component.

### Sign-up and Login Pages

- Accessible from the navigation bar.
- Users can sign up or log in based on their account status.

### Task Creation

- Users can add a task by providing a name and due date.
- Automatic categorization into "Overdue," "Due Today," and "Due Later."

### Task Completion

- Checkbox to mark a task as complete.

### Task Deletion

- Delete icon for removing a task.

## Database

The application is built on a PostgreSQL database to ensure robust data storage and retrieval.

## Getting Started

To set up the project locally, follow these steps:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up the PostgreSQL database and configure the connection in the application.
4. Run the application with `npm start`.
