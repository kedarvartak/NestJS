# Exception Handling in NestJS

Robust error handling is a critical component of any production-grade application. NestJS includes a built-in exception layer that is responsible for processing all unhandled exceptions across an application. When an exception is not handled by your application code, it is caught by this layer, which then automatically sends an appropriate, user-friendly JSON response. This default behavior helps ensure that no unhandled errors leak sensitive information to the client.

Out of the box, NestJS provides a versatile `HttpException` class, which is recommended for most common HTTP error scenarios. This class takes two main arguments: a string or JSON object for the response body, and an HTTP status code. When you throw an `HttpException`, the framework catches it and sends a response with the specified status code and body, providing a consistent error-handling experience across your API. For common scenarios, NestJS also provides several standard exceptions that inherit from `HttpException`, such as `NotFoundException`, `BadRequestException`, and `UnauthorizedException`.

For more advanced or custom error-handling scenarios, NestJS allows you to create your own exception filters. An exception filter is a class that implements the `ExceptionFilter` interface and is decorated with `@Catch()`. The `@Catch()` decorator can take a specific exception type as an argument, meaning the filter will only be called for that type of exception. Inside the filter, you have full control over the response that is sent back to the client, allowing you to implement custom logging, formatting, or other logic. This gives you the flexibility to tailor the error-handling mechanism to the specific needs of your application, ensuring that you can manage any error scenario in a predictable and controlled manner.

Here is an example of throwing a standard exception in a controller:

```typescript
import { Controller, Get, NotFoundException } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get(':id')
  findUserById(id: string) {
    // In a real app, you would have logic to find a user.
    // If the user is not found, you can throw a NotFoundException.
    throw new NotFoundException(`User with ID ${id} not found.`);
  }
}
```

And here is an example of a custom exception filter for a specific exception type:

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
      });
  }
}
``` 