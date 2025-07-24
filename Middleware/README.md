# Understanding Middleware in NestJS

Middleware is a fundamental concept in many web frameworks, and NestJS is no exception. It provides a powerful mechanism for executing code before a route handler is called. Middleware functions have access to the request and response objects, and the `next()` function in the application's request-response cycle. This capability allows you to perform a wide range of tasks, such as logging incoming requests, handling authentication and authorization, or manipulating request and response headers.

In NestJS, middleware can be implemented as either a function or a class that implements the `NestMiddleware` interface. A class-based approach is often preferred for more complex middleware as it allows for dependency injection, enabling the middleware to use other providers like services or configuration objects. When implemented, the `use` method of the class will contain the core logic of the middleware.

To apply middleware, you must configure it within a module. This is done by implementing the `NestModule` interface and using the `configure` method. Inside this method, you use a consumer object to apply your middleware to specific routes or to all routes using wildcards. This gives you fine-grained control over where your middleware is executed, ensuring that it only runs for the intended parts of your application. This separation of configuration from the middleware logic itself helps in keeping the codebase organized and maintainable.

Here is an example of a simple logger middleware that logs the HTTP method and URL of every incoming request:

```typescript
// logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request... ${req.method} ${req.originalUrl}`);
    next();
  }
}
```

And here is how you would apply this middleware to all routes in your application module:

```typescript
// app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
``` 