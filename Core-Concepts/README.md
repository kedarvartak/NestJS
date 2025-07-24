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

---

## Understanding the Project Structure

When you open your new NestJS project, you will see a `src` directory with a few files inside. Let's break down the most important ones:

-   `main.ts`: This is the entry point of your application. It creates a new NestJS application instance and starts the server.
-   `app.module.ts`: This is the root module of your application.
-   `app.controller.ts`: A basic controller with one route.
-   `app.service.ts`: A basic service with a single method.

Now, let's dive into what these concepts mean.

## Controllers: Handling Requests

Controllers are responsible for handling incoming requests and returning responses to the client. In NestJS, a controller is a class decorated with the `@Controller()` decorator.

```typescript
// src/app.controller.ts

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

-   The `@Controller()` decorator tells NestJS that this class is a controller.
-   The `@Get()` decorator before the `getHello()` method tells NestJS to create an endpoint for this method that responds to HTTP GET requests.
-   The controller uses the `AppService` to get the "Hello World!" message.

## Providers (Services): The Business Logic

Providers, often called Services, are where you should put the main business logic of your application. They can be injected into controllers or other services. A provider is a class decorated with the `@Injectable()` decorator.

```typescript
// src/app.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

-   The `@Injectable()` decorator marks the class as a provider that can be managed by the NestJS IoC (Inversion of Control) container.

## Modules: Organizing Your Code

Modules are used to organize your application's code into logical blocks. A module is a class decorated with the `@Module()` decorator.

```typescript
// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

The `@Module()` decorator takes an object with a few important properties:
-   `imports`: A list of other modules that this module depends on.
-   `controllers`: The set of controllers defined in this module.
-   `providers`: The providers that will be instantiated by the NestJS injector and that may be shared at least across this module.

By using modules, you can keep your application organized and scalable. 