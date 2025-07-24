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


## Understanding the Project Structure

When you open your new NestJS project, you will see a `src` directory with a few files inside. Let's break down the most important ones:

-   `main.ts`: This is the entry point of your application. It creates a new NestJS application instance and starts the server.
-   `app.module.ts`: This is the root module of your application.
-   `app.controller.ts`: A basic controller with one route.
-   `app.service.ts`: A basic service with a single method.

Now, let's dive into what these concepts mean using a simple analogy: imagine a restaurant.

## Controllers: The Waiter

A **Controller** is like a **waiter** in a restaurant. Its job is to:
1.  **Listen** for a customer's (a user's) request.
2.  **Understand** what the customer wants (e.g., "I want the menu").
3.  **Go to the kitchen** (the Service) to get what the customer asked for.
4.  **Bring the food** (the data/response) back to the customer.

In NestJS, a controller listens for incoming web requests (like when a user visits a URL) and then calls the appropriate service to handle that request.

```typescript
// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // This means: when a user makes a GET request to the main URL...
  getHello(): string {
    return this.appService.getHello(); // ...ask the AppService to get the greeting.
  }
}
```

## Providers (Services): The Chef

A **Provider** (or **Service**) is like the **chef** in the kitchen. Its job is to handle the actual work:
1.  **Receives an order** from the waiter (the Controller).
2.  **Prepares the dish** (fetches data from a database, performs a calculation, etc.).
3.  **Gives the dish** back to the waiter.

The service contains the core logic of your application. This separation keeps your code clean—the waiter doesn't need to know how to cook, and the chef doesn't need to talk to the customers.

```typescript
// src/app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'; // The "dish" being prepared is a simple greeting.
  }
}
```

## Modules: The Restaurant

A **Module** is like the **entire restaurant**. It's a container that groups together related parts of your application:
-   The **waiters** (Controllers).
-   The **chefs** (Providers).

A small restaurant might have just one of each, but a large restaurant could have different sections (a bar, a main dining area, a dessert counter), each with its own waiters and chefs.

In NestJS, a module bundles a set of related features together. For example, a `UsersModule` would contain the `UsersController` and `UsersService`. This keeps your application organized as it grows.

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController], // The waiters in our restaurant
  providers: [AppService],      // The chefs in our restaurant
})
export class AppModule {}
```
By using this structure, NestJS helps you build applications that are organized, easy to understand, and simple to scale. 