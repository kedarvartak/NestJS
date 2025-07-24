# Core Concepts: Setting Up Your First NestJS Project

Now that we have a good understanding of what NestJS is, let's get our hands dirty by setting up a new project.

## Prerequisites

Before we start, make sure you have [Node.js](https://nodejs.org/en/download/) installed on your system (which includes `npm`, the Node Package Manager).

## Installing the NestJS CLI

The easiest way to create a new NestJS project is by using the NestJS Command Line Interface (CLI). It's a powerful tool that helps you create, manage, and build your application.

To install the CLI globally on your system, open your terminal and run the following command:

```bash
npm i -g @nestjs/cli
```

## Creating a New Project

Once the CLI is installed, you can create a new project with a single command. Replace `my-nest-app` with the name you want for your project.

```bash
nest new my-nest-app
```

This command will:
1. Create a new directory called `my-nest-app`.
2. Scaffold a new NestJS project with all the necessary files and dependencies.
3. Install all the required packages from `npm`.

## Running the Application

After the installation is complete, navigate into your new project directory and start the application:

```bash
cd my-nest-app
npm run start:dev
```

This will start the development server. You can now open your browser and go to `http://localhost:3000`. You should see a "Hello World!" message.

Congratulations! You've just created and run your first NestJS application. In the next sections, we will explore the different parts of this project. 