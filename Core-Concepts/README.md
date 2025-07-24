# Core Concepts of NestJS

This document provides an overview of the foundational concepts in NestJS, focusing on how they contribute to a well-structured and scalable application architecture.

## Controllers

Controllers are a fundamental part of a NestJS application, responsible for handling incoming HTTP requests and sending back appropriate responses. Each controller is a class decorated with `@Controller()`, which associates it with a specific route prefix. Methods within the controller can be mapped to specific HTTP methods (like GET, POST, etc.) and routes using decorators such as `@Get()`, `@Post()`, and others. This approach allows for a clean separation of concerns, where controllers act as the primary interface for client-server communication.

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
```

## Providers (Services)

Providers, commonly referred to as Services, are designed to encapsulate the business logic of your application. They are plain TypeScript classes decorated with `@Injectable()`, which allows them to be managed by the NestJS dependency injection system. By separating logic into services, you can keep your controllers lean and focused on handling request/response cycles. Services can be easily injected into controllers or other services, promoting reusability and making the codebase easier to test and maintain.

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

## Modules

Modules are the primary way to organize the structure of a NestJS application. A module is a class annotated with the `@Module()` decorator, which provides metadata that NestJS uses to organize the application components. Each application has at least one module, the root module. Modules can import other modules, and they encapsulate a set of related capabilities, including controllers and providers. This modularity helps in managing complexity, as you can group features into distinct, reusable units.

```typescript
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